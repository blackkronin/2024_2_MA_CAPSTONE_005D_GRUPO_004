// AIReporter/page.tsx
import React from 'react';
import OpenAIChat from '@/components/openai/openai_chat';
import OpenAIReportGen from '@/components/openai/openai_report_gen';

const AIReporterPage = () => {
  return (
    <div>
      <OpenAIReportGen />
    </div>
  );
};

export default AIReporterPage;