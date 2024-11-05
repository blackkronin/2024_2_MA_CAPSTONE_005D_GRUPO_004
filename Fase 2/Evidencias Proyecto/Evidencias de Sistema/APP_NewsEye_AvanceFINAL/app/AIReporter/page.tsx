// app/AIReporter/page.tsx
import React from 'react';
import OpenAIReportGen from '@/components/openai/openai_report_gen';

const AIReporterPage = () => {
  return (
    <div>
      <h1>AI Reporter</h1>
      <OpenAIReportGen />
    </div>
  );
};

export default AIReporterPage;