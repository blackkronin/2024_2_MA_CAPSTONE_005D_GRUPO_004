"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { fetchUserCategories, generateDynamicPrompt, getConfigForUser, ConfigurationsType, determineTopic } from "@/utils/reports_ai/prompts_reporter";
import { searchArticles } from "@/utils/reports_ai/tavily_scraper";
import { downloadPDF } from "@/utils/reports_ai/PDFConverter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { OpenAI } from "openai";
import { User } from "@supabase/supabase-js";
import crypto from 'crypto';
import "@/app/apaStyle.css";
import "@/app/globals.css";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const generateUniqueFileName = (name: string) => {
  const sanitized = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const uniqueSuffix = crypto.randomBytes(4).toString('hex');
  return `${sanitized}_${uniqueSuffix}`;
};

const OpenAIReportGen: React.FC = ({}) => {
  const [report, setReport] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [streamedContent, setStreamedContent] = useState('');
  const [articleTitles, setArticleTitles] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('');
  const [reportTitle, setReportTitle] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        console.log(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Error fetching user. Please try again.");
      }
    };

    fetchUser();
  }, []);

  const handleGenerateReport = async () => {
    if (user) {
      setLoading(true);
      setError(null);
      setMessages([]);
      setArticleTitles([]);
      setStreamedContent('');

      try {
        const { primaryCategory, secondaryCategory } = await fetchUserCategories(user.id);

        setMessages((prev) => [...prev, "Iniciando la búsqueda de artículos..."]);
        const articles = await searchArticles(prompt);

        if (articles.length === 0) {
          setMessages((prev) => [...prev, "No se encontraron artículos."]);
          return;
        }

        setMessages((prev) => [...prev, `Artículos encontrados: ${articles.length}`]);
        setArticleTitles(articles.map((article) => article.title));

        const userInfo = `Nombre: ${user.user_metadata.full_name}`;
        const dynamicPrompt = generateDynamicPrompt(userInfo, articles, prompt, primaryCategory, secondaryCategory);

        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: dynamicPrompt }],
          stream: true,
        });

        let reportContent = "";
        for await (const chunk of response) {
          const delta = chunk.choices[0]?.delta?.content || "";
          reportContent += delta;
          setStreamedContent((prev) => prev + delta);
        }

        setReport(reportContent);

        const summaryResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Genera un resumen breve siguiente contenido:\n\n${reportContent}`,
            },
          ],
          max_tokens: 150,
        });

        const summary = summaryResponse.choices[0]?.message?.content?.trim() || "No summary available";

        const category = determineTopic(prompt, articles);
        setCategory(category);

        const show_title = `Reporte de ${category}`;
        setReportTitle(show_title);

        await saveReportToSupabase(reportContent, category, show_title, summary, primaryCategory, secondaryCategory);
      } catch (error) {
        console.error("Error generando el reporte:", error);
        setError("Error generando el reporte. Intente de nuevo.");
      } finally {
        setLoading(false);
      }
    }
  };

  const saveReportToSupabase = async (reportContent: string, category: string, title: string, summary: string, primaryCategory: keyof ConfigurationsType, secondaryCategory: string) => {
    if (user) {
      try {
        const folderName = `reports_user_${user.id}`;
        const date = new Date().toISOString().split("T")[0];
        const sanitizedTitle = generateUniqueFileName(title);
        const fileName = `${category}/${date}_${sanitizedTitle}.json`;

        const { data: folderData, error: folderError } = await supabase.storage.from("reportes.usuarios").list(folderName);

        if (folderError || !folderData || folderData.length === 0) {
          const subfolders = ["conocimiento", "profesion", "para_mi"];
          for (const subfolder of subfolders) {
            const { data: subfolderData, error: subfolderError } = await supabase.storage.from("reportes.usuarios").list(`${folderName}/${subfolder}`);
            if (!subfolderData || subfolderData.length === 0) {
              const { error: createFolderError } = await supabase.storage.from("reportes.usuarios").upload(`${folderName}/${subfolder}/.keep`, new Blob([""]));
              if (createFolderError) {
                console.error('Error creating folder:', createFolderError);
                return;
              }
            }
          }
        }

        const config = getConfigForUser(primaryCategory, secondaryCategory);
        const reportJSON = {
          title,
          summary,
          category,
          date,
          structure: config.structure,
          content: reportContent,
        };

        const { error } = await supabase.storage.from("reportes.usuarios").upload(`${folderName}/${fileName}`, JSON.stringify(reportJSON));
        if (error) {
          console.error("Error saving report:", error);
        } else {
          console.log("Report saved successfully");
        }
      } catch (error) {
        console.error("Error saving report to Supabase:", error);
        setError("Error saving report. Please try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">Generador de Reportes IA</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ingrese su consulta aquí..."
        className="w-full mt-4 p-2 border rounded"
      />
      <button onClick={handleGenerateReport} disabled={loading} className="w-full mt-4 p-2 bg-blue-500 text-white rounded">
        {loading ? "Generando..." : "Generar Reporte"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-4">
        {messages.map((msg, index) => (
          <p key={index} className="text-blue-500">{msg}</p>
        ))}
      </div>

      {articleTitles.length > 0 && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="font-bold mb-2">Artículos Encontrados:</h3>
          <ul className="list-disc pl-6">
            {articleTitles.map((title, index) => (
              <li key={index}>{title}</li>
            ))}
          </ul>
        </div>
      )}

      {streamedContent && (
        <>
          <div className="apa-text mt-4 p-4 bg-white rounded-md">
            <ReactMarkdown
              children={streamedContent}
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="title h1" {...props} />,
                h2: ({ node, ...props }) => <h2 className="title h2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="title h3" {...props} />,
                p: ({ node, ...props }) => <p className="long" {...props} />,
                ul: ({ node, ...props }) => <ul className="apaReferences" {...props} />,
                li: ({ node, ...props }) => <li className="apaReferences" {...props} />,
                table: ({ node, ...props }) => <table className="apaTable" {...props} />,
                th: ({ node, ...props }) => <th className="apaTable" {...props} />,
                td: ({ node, ...props }) => <td className="apaTable" {...props} />,
            }}
            />
          </div>
          <button onClick={() => downloadPDF(streamedContent)} className="download-pdf-button mt-4">
            Descargar PDF
          </button>
        </>
      )}
    </div>
  );
};

export default OpenAIReportGen;