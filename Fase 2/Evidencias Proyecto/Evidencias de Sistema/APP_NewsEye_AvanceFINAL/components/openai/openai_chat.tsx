// components/openai/openai_chat.tsx
"use client";

import React, { useState } from 'react';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const OpenAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    const newMessage: Message = { role: 'user', content: input };
    setMessages([...messages, newMessage]);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [...messages, newMessage],
    });

    const botMessage: Message = response.choices[0].message as Message;
    setMessages([...messages, newMessage, botMessage]);
    setInput('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === 'user' ? 'user-message' : 'bot-message'}>
            {msg.content}
          </div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default OpenAIChat;