import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'ai-assistant-api',
        configureServer(server) {
          server.middlewares.use('/api/ai-assistant', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });

            req.on('end', async () => {
              res.setHeader('Content-Type', 'application/json');
              try {
                const parsed = JSON.parse(body || '{}');
                const userPrompt = parsed.message || '';
                const taskType = parsed.taskType || 'chat'; // 'chat' | 'poem' | 'analysis' | 'quote'

                const apiKey = process.env.GEMINI_API_KEY;
                if (!apiKey) {
                  res.statusCode = 200;
                  res.end(
                    JSON.stringify({
                      reply:
                        'বৃষ্টির রাতে শব্দেরা যখন কথা বলতে চায়, তখন প্রতিটি অনুভূতিই এক একটি না-বলা প্রেমের গল্প হয়ে ওঠে। (এআই সেবা চালু করতে অনুগ্রহ করে সেটিংসে আপনার এপিআই কি যাচাই করুন)।'
                    })
                  );
                  return;
                }

                const ai = new GoogleGenAI({
                  apiKey: apiKey,
                  httpOptions: {
                    headers: {
                      'User-Agent': 'aistudio-build'
                    }
                  }
                });

                const systemInstruction = `You are "সাহিত্য সহকারী (Nishat AI)" — the warm, poetic, and intimate literary companion of the Bengali author website "নিশাত আহমেদ — The Writer" (ভালোবাসার অন্য ভাষা).
Your tone is deeply poetic, gentle, respectful, slightly melancholic, like a conversation by lamplight on a quiet rainy night.
Always reply in pure, elegant Bengali script (বাংলা লিপি).
You are knowledgeable about Nishat Ahmed's themes: emotional romance, LGBTQ+ love stories, rain-drenched evenings in Dhaka/Sylhet, heartbreak (বিরহ), yearning (অপেক্ষা), solitude, and empathy.
Never reveal any real names or identities for Nishat Ahmed, keeping the pen-named literary mysticism intact.
Keep answers concise, lyrical, and evocative.`;

                const response = await ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents: userPrompt,
                  config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.85
                  }
                });

                res.statusCode = 200;
                res.end(JSON.stringify({ reply: response.text || 'কিছু অনুভূতি ভাষায় প্রকাশ করা যায় না।' }));
              } catch (err: any) {
                console.error('Error generating AI response:', err);
                res.statusCode = 200;
                res.end(
                  JSON.stringify({
                    reply:
                      'মাঝে মাঝে শব্দেরাও ক্লান্ত হয়ে পড়ে। তবে ভালোবাসার মৌনতা চিরন্তন। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।'
                  })
                );
              }
            });
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
