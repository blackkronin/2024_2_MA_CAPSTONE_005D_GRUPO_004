// AIReporter/page.tsx
import React from 'react';
import OpenAIChat from '@/components/openai/openai_chat';
import OpenAIReportGen from '@/components/openai/openai_report_gen';
import CarruselInstrucciones from '@/components/home/carrusel-instrucciones';

const AIReporterPage = () => {
  return (
    <div>
      <CarruselInstrucciones />
      <br />
      <OpenAIReportGen />
    </div>
  );
};

export default AIReporterPage;