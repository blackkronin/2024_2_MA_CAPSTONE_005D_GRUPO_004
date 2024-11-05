"use client";

import React, { useState, useEffect } from 'react';
import { generateReportStream } from '@/utils/reports_ai/openai_reporter';
import { searchArticles } from '@/utils/reports_ai/tavily_scraper';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OpenAI } from 'openai';
import { supabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const Tone = {
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

const OpenAIReportGen: React.FC = () => {
  const [report, setReport] = useState<string>('');
  const [tone, setTone] = useState('Objective');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [streamedContent, setStreamedContent] = useState('');
  const [category, setCategory] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
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
      setTitle(title);

      await handleNewReport(reportContent, category, title);
    } catch (error) {
      console.error("Error generating report:", error);
      setError("Error generating report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewReport = async (reportContent: string, category: string, title: string) => {
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

  const downloadReport = ({ report }: { report: string }) => {
    const doc = new jsPDF();
    const lines = report.split('\n');
    let y = 10;
    const index: { title: string; page: number }[] = [];
    let title = "Reporte Generado";

    // Extract title from the first heading
    if (lines.length > 0 && lines[0].startsWith('# ')) {
      title = lines[0].substring(2);
      lines.shift(); // Remove the title line from the content
    }

    // Add title
    doc.setFontSize(20);
    doc.text(title, 10, y);
    y += 20;

    // Add index placeholder
    doc.addPage();
    const indexStartY = 10;
    y = indexStartY + 20;

    lines.forEach((line) => {
      if (line.startsWith('# ')) {
        doc.setFontSize(16);
        doc.text(line.substring(2), 10, y);
        index.push({ title: line.substring(2), page: doc.getNumberOfPages() });
        y += 10;
      } else if (line.startsWith('## ')) {
        doc.setFontSize(14);
        doc.text(line.substring(3), 10, y);
        index.push({ title: line.substring(3), page: doc.getNumberOfPages() });
        y += 10;
      } else if (line.startsWith('### ')) {
        doc.setFontSize(12);
        doc.text(line.substring(4), 10, y);
        y += 10;
      } else {
        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(line, 180);
        splitText.forEach((textLine: string) => {
          doc.text(textLine, 10, y);
          y += 10;
          if (y > 280) {
            doc.addPage();
            y = 10;
          }
        });
      }

      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });

    // Add index
    doc.setPage(2);
    doc.setFontSize(16);
    doc.text("Índice", 10, indexStartY);
    let indexY = indexStartY + 10;
    index.forEach((item) => {
      doc.setFontSize(12);
      doc.text(`${item.title} ................................ ${item.page}`, 10, indexY);
      indexY += 10;
    });

    doc.save('report.pdf');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Generador de Reportes IA</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ingrese su solicitud aquí..."
          className="w-full"
        />
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione el tono" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(Tone).map(([key, value]) => (
              <SelectItem key={key} value={key}>{value}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleGenerateReport} disabled={loading} className="w-full">
          {loading ? "Generando..." : "Generar Reporte"}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <Card key={index}>
              <CardContent>
                <pre className="whitespace-pre-wrap break-words text-blue-500">{msg}</pre>
              </CardContent>
            </Card>
          ))}
        </div>
        {streamedContent && (
          <Card>
            <CardContent>
              <ReactMarkdown>{streamedContent}</ReactMarkdown>
            </CardContent>
          </Card>
        )}
        {report && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Reporte Generado</h2>
            <ReactMarkdown>{report}</ReactMarkdown>
            <div className="flex justify-between">
              <Button onClick={() => downloadReport({ report })}>Descargar Reporte</Button>
              {category && <p className="text-sm text-gray-500">Categoría: {category}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OpenAIReportGen;