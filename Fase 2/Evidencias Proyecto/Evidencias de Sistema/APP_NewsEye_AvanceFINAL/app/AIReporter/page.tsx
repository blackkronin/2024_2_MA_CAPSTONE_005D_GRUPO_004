// AIReporter/page.tsx
import React from 'react';
import OpenAIChat from '@/components/openai/openai_chat';
import OpenAIReportGen from '@/components/openai/openai_report_gen';
import CarruselInstrucciones from '@/components/home/carrusel-instrucciones';

const AIReporterPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <CarruselInstrucciones />
      <div className="mt-8">
        <OpenAIReportGen />
      </div>
    </div>
  );
};

export default AIReporterPage;