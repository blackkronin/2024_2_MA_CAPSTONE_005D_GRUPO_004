// utils/reports_ai/openai_reporter.ts
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface Article {
  title: string;
  url: string;
  content: string;
}

export async function generateReportStream(articles: Article[], prompt: string, tone: string): Promise<ReadableStream> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'user',
        content: `Genera un informe en formato Markdown con estilo APA basado en los siguientes artículos. Incluye introducción, desarrollo, conclusión, referencias. Tono: ${tone}. Artículos: ${JSON.stringify(articles)}`,
      },
    ],
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        controller.enqueue(new TextEncoder().encode(chunk.choices[0]?.delta?.content || ""));
      }
      controller.close();
    },
  });

  return stream;
}