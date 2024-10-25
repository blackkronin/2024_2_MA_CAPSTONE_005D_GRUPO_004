// components/openai/openai_report_gen.tsx
"use client";

import React, { useState } from 'react';
import { generateFullReport, generateSummary, generateIntroduction, generateConclusion, categorizeContent } from '@/utils/reports_ai/openai_reporter';
import { searchArticles } from '@/utils/reports_ai/tavily_scraper';

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

interface Article {
  title: string;
  url: string;
  content: string;
  images: string[];
}

interface Report {
  introduction: string;
  summary: string;
  conclusion: string;
  references: { title: string; url: string; images: string[] }[];
  category: string;
}

const OpenAIReportGen = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [tone, setTone] = useState('Objective');
  const [prompt, setPrompt] = useState('');

  const handleGenerateReport = async () => {
    const articles: Article[] = await searchArticles(prompt);
    const summaries = await Promise.all(articles.map((article: Article) => generateSummary(article.content, tone)));
    const finalSummary = summaries.join('\n\n');
    const limitedFinalSummary = limitToWords(finalSummary, 1000);
    const introduction = await generateIntroduction(prompt, tone);
    const conclusion = await generateConclusion(limitedFinalSummary, tone);
    const category = await categorizeContent(limitedFinalSummary);

    const report = generateFullReport(introduction, limitedFinalSummary, conclusion, articles, category);
    setReport(report);
  };

  const limitToWords = (text: string, maxWords: number): string => {
    const words = text.split(/\s+/);
    if (words.length <= maxWords) {
      return text;
    }
    return words.slice(0, maxWords).join(' ') + '...';
  };

  return (
    <div>
      <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ingrese su solicitud aqui.." />
      <select value={tone} onChange={(e) => setTone(e.target.value)}>
        {Object.keys(Tone).map((key) => (
          <option key={key} value={key}>{Tone[key]}</option>
        ))}
      </select>
      <button onClick={handleGenerateReport}>Generate Report</button>
      {report && (
        <div>
          <h2>Introducción</h2>
          <hr />
          <p>{report.introduction}</p>
          <h2>Desarrollo</h2>
          <hr />
          <p>{report.summary}</p>
          <h2>Conclusion</h2>
          <hr />
          <p>{report.conclusion}</p>
          <hr />
          <h2>Referencias</h2>
          <ul>
            {report.references.map((ref, index) => (
              <li key={index}>
                <a href={ref.url}>{ref.title}</a>
                {ref.images.map((img, imgIndex) => (
                  <img key={imgIndex} src={img} alt={`Image ${imgIndex}`} />
                ))}
              </li>
            ))}
          </ul>
          <h2>Categoría</h2>
          <p>{report.category}</p>
        </div>
      )}
    </div>
  );
};

export default OpenAIReportGen;