// components/openai/openai_report_gen.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { generateReportStream } from '@/utils/reports_ai/openai_reporter';
import { searchArticles } from '@/utils/reports_ai/tavily_scraper';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Image from 'next/image';
//import { saveReportToSupabase } from '@/utils/supabase_client';

const Tone: { [key: string]: string } = {
  Objective: "Objetivo (presentación imparcial y sin sesgos de hechos y hallazgos)",
  Formal: "Formal (se ajusta a los estándares académicos con un lenguaje y estructura sofisticados)",
  Analytical: "Analítico (evaluación crítica y examen detallado de datos y teorías)",
  Persuasive: "Persuasivo (convenciendo a la audiencia de un punto de vista o argumento particular)",
  Informative: "Informativo (proporcionando información clara y completa sobre un tema)",
  Explanatory: "Explicativo (aclaración de conceptos y procesos complejos)",
  Descriptive: "Descriptivo (representación detallada de fenómenos, experimentos o estudios de caso)",
  Critical: "Crítico (juzgando la validez y relevancia de la investigación y sus conclusiones)",
  Comparative: "Comparativo (contrastando diferentes teorías, datos o métodos para resaltar diferencias y similitudes)",
  Speculative: "Especulativo (explorando hipótesis y posibles implicaciones o direcciones de investigación futura)",
  Reflective: "Reflexivo (considerando el proceso de investigación y las perspectivas o experiencias personales)",
  Narrative: "Narrativo (contando una historia para ilustrar hallazgos o metodologías de investigación)",
  Humorous: "Humorístico (ligero y entretenido, generalmente para hacer el contenido más relatable)",
  Optimistic: "Optimista (resaltando hallazgos positivos y posibles beneficios)",
  Pessimistic: "Pesimista (enfocándose en limitaciones, desafíos o resultados negativos)",
};

const OpenAIReportGen = () => {
  const [report, setReport] = useState<string | null>(null);
  const [tone, setTone] = useState('Objective');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [streamedContent, setStreamedContent] = useState<string>('');
  const [category, setCategory] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  useEffect(() => {
    if (report) {
      setStreamedContent('');
    }
  }, [report]);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    setMessages([]);
    setStreamedContent('');
    try {
      setMessages(prev => [...prev, "Iniciando la búsqueda de artículos..."]);
      const articles = await searchArticles(prompt);
      setMessages(prev => [...prev, `Búsqueda completada. Artículos encontrados: ${articles.length}`]);
      articles.forEach(article => {
        setMessages(prev => [...prev, `Título del artículo: ${article.title}`]);
      });
      const stream = await generateReportStream(articles, prompt, tone);

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setStreamedContent(prev => prev + chunkValue);
      }

      const reportContent = streamedContent;
      setReport(reportContent);

      // Categorizar el contenido
      const categoryResponse = await fetch('/api/categorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: reportContent }),
      });

      if (!categoryResponse.ok) {
        throw new Error('Error categorizing content');
      }

      const categoryData = await categoryResponse.json();
      setCategory(categoryData.category);

      //await saveReportToSupabase(reportContent);
    } catch (error) {
      console.error("Error generating report:", error);
      setError("Error generating report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedImages(Array.from(event.target.files));
    }
  };

  const downloadReport = (report: string) => {
    const doc = new jsPDF();
    doc.text(report, 10, 10);
    uploadedImages.forEach((image, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target?.result) {
          const img = new Image();
          img.src = e.target.result as string;
          doc.addImage(img, 'JPEG', 10, 10 + (index + 1) * 50, 180, 160);
          if (index < uploadedImages.length - 1) {
            doc.addPage();
          }
        }
      };
      reader.readAsDataURL(image);
    });
    doc.save('report.pdf');
  };

  return (
    <div>
      <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ingrese su solicitud aqui.." />
      <select value={tone} onChange={(e) => setTone(e.target.value)}>
        {Object.keys(Tone).map((key) => (
          <option key={key} value={key}>{Tone[key]}</option>
        ))}
      </select>
      <input type="file" multiple onChange={handleImageUpload} />
      <button onClick={handleGenerateReport} disabled={loading}>
        {loading ? "Generating..." : "Generate Report"}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {messages.map((msg, index) => (
          <Card key={index} className="mb-2">
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', color: 'blue' }}>{msg}</pre>
          </Card>
        ))}
      </div>
      {streamedContent && (
        <Card className="mb-2">
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', color: 'green' }}>{streamedContent}</pre>
        </Card>
      )}
      {report && (
        <div>
          <h2>Generated Report</h2>
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                <Image
                  {...props}
                  alt={props.alt || 'Image'}
                  width={600}
                  height={400}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              ),
            }}
          >
            {report}
          </ReactMarkdown>
          <button onClick={() => downloadReport(report)}>Download Report</button>
          {category && <p>Categoría: {category}</p>}
        </div>
      )}
    </div>
  );
};

export default OpenAIReportGen;