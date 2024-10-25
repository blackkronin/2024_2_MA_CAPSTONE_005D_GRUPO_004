// AIReporter/page.tsx
import React from 'react';
import OpenAIChat from '@/components/openai/openai_chat';

const AIChat = () => {
  return (
    <div>
      <h1>AI OpenAI Chat</h1>
      <h2>Aquí podrá generar una conversación entre la IA y usted. <br />Note que la memoria del bot está solamente para esta vista, y no recordará una conversación fuera de su campo</h2>
      <br />
      <hr />
      <br />
      <OpenAIChat />
    </div>
  );
};

export default AIChat;