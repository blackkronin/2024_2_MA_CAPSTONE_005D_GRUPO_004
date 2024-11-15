"use client";

import React, { useState, useEffect} from 'react';
import { generateDetailedReport } from '@/utils/reports_ai/openai_reporter'; // Prompt detallado
import { searchArticles } from '@/utils/reports_ai/tavily_scraper';
import { downloadPDF } from '@/utils/reports_ai/PDFConverter'; 
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/utils/supabase/client';
import remarkGfm from 'remark-gfm'; // Para compatibilidad con tablas y otros elementos de Markdown extendido
import '@/app/globals.css' // Importa los estilos globales o específicos del componente
import { User } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const OpenAIReportGen: React.FC = () => {
  const [report, setReport] = useState<string>('');
  const [tone, setTone] = useState('Objective');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [streamedContent, setStreamedContent] = useState('');
  const [articleTitles, setArticleTitles] = useState<string[]>([]); // Para almacenar títulos de artículos
  const [user, setUser] = useState<User | null>(null); // Datos del usuario actual
  const [category, setCategory] = useState<string>('');
  const [reportTitle, setReportTitle] = useState(''); // Título del informe


  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      console.log(user);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (report) {
      setStreamedContent('');
    }
  }, [report]);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    setMessages([]);
    setArticleTitles([]);
    setStreamedContent('');

    try {
      setMessages((prev) => [...prev, "Iniciando la búsqueda de artículos..."]);
      const articles = await searchArticles(prompt);
      
      if (articles.length === 0) {
        setMessages((prev) => [...prev, "No se encontraron artículos."]);
        return;
      }

      setMessages((prev) => [...prev, `Artículos encontrados: ${articles.length}`]);
      setArticleTitles(articles.map(article => article.title)); // Guarda los títulos de los artículos

      const stream = await generateDetailedReport(articles, prompt, tone);

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setStreamedContent((prev) => prev + chunkValue);
      }

      const reportContent = streamedContent;
      setReport(reportContent);
      
      const categoryResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Categoriza el siguiente contenido en una de las siguientes categorías, debes procurar utilizar UNA sola palabra: Salud, Humor, Historia, Noticia, etc.:\n\n${reportContent}`,
          },
        ],
        max_tokens: 50,
      });

      const category = categoryResponse.choices[0]?.message?.content?.trim() || 'Uncategorized';
      setCategory(category);
      // Genera el título del informe usando el prompt original
      const titleResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Genera un título corto y descriptivo para el siguiente reporte:\n\n${reportContent}`,
          },
        ],
        max_tokens: 50,
      });

      const title = titleResponse.choices[0]?.message?.content?.trim() || 'Untitled Report';
      setReportTitle(title);

      await saveReportToSupabase(reportContent, category, title);
    } catch (error) {
      console.error("Error generando el reporte:", error);
      setError("Error generando el reporte. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };




  const saveReportToSupabase = async (reportContent: string, category: string, title: string) => {
    if (user) {
      const folderName = `reports_user_${user.id}`;
      const date = new Date().toISOString().split('T')[0];
      const fileName = `${category}/${date}_${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;

      const { error } = await supabase.storage
        .from('AllReports')
        .upload(`${folderName}/${fileName}`, reportContent);

      if (error) {
        console.error('Error saving report:', error);
      } else {
        console.log('Report saved successfully');
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
      <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full mt-4 p-2 border rounded">
        <option value="Objective">Objetivo</option>
        <option value="Formal">Formal</option>
        <option value="Analytical">Analítico</option>
        <option value="Informative">Informativo</option>
        {/* Más opciones de tono */}
      </select>
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
          <div  className="report-container mt-4 p-4 bg-white rounded-md">
            <ReactMarkdown
              children={streamedContent}
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="report-title" {...props} />,
                h2: ({ node, ...props }) => <h2 className="report-heading" {...props} />,
                h3: ({ node, ...props }) => <h3 className="report-subheading" {...props} />,
                p: ({ node, ...props }) => <p className="report-paragraph" {...props} />,
                a: ({ node, ...props }) => <a className="report-citation" {...props} />,
                ul: ({ node, ...props }) => <ul className="report-references" {...props} />,
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
