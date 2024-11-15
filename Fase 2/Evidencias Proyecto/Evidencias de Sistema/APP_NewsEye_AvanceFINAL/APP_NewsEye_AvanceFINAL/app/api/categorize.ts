// pages/api/categorize.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { content } = req.body;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'user',
            content: `Categoriza el siguiente contenido en una de las siguientes categorías: Salud, Humor, Historia, Noticia, etc.:\n\n${content}`,
          },
        ],
        max_tokens: 50,
      });

      const category = response.choices[0].message.content.trim();
      res.status(200).json({ category });
    } catch (error) {
      res.status(500).json({ error: 'Error categorizing content' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}