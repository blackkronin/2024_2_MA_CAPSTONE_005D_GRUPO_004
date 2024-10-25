// AIReporter/page.tsx
import React from 'react';
import OpenAIReportGen from '@/components/openai/openai_report_gen';

const AIReporterPage = () => {
  return (
    <div>
      <h1>AI Reporter</h1>
      <h2>Para Generar su reporte, debe de seleccionar el tono que ocupará, luego esperar pacientemente.</h2>
      <hr />
      <br />
      <OpenAIReportGen />
    </div>
  );
};

export default AIReporterPage;