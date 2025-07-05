// lib/gemini.ts
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function formatPrompt(input: string) {
  return `You're an AI Marketing Assistant. Respond concisely and clearly. Avoid using markdown (*, -, etc), no bullet points, no headings. Just give a brief and direct answer:\n\n${input}`;
}

export async function getGeminiResponse(prompt: string): Promise<string> {
  const controlledPrompt = formatPrompt(prompt);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: controlledPrompt }]
      }
    ]
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Gemini API Error:", error);
      throw new Error(error);
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response';

    // Optional cleanup to remove *, •, -, etc.
    const cleaned = rawText.replace(/^[\*\-•]\s*/gm, '').trim();
    return cleaned;
  } catch (err: any) {
    console.error('Gemini API error:', err.message);
    throw err;
  }
}
