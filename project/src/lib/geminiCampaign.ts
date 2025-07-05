// lib/geminiCampaign.ts
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateCampaignContent(type: string, details: {
  title: string;
  description: string;
  targetAudience: string;
  budget: string;
  duration: string;
}): Promise<string> {
  const prompt = `
You're an expert marketing AI. Generate a concise, creative ${type} based on the following campaign details.
Avoid markdown formatting, bullet points, or emojis. Write in plain, professional English.

Campaign Title: ${details.title}
Description: ${details.description}
Target Audience: ${details.targetAudience}
Budget: ${details.budget}
Duration: ${details.duration}

Keep it direct and structured, not list-based.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content returned';

    // Optional: clean bullet characters
    return raw.replace(/^[\*\-•]+\s*/gm, '').trim();
  } catch (err: any) {
    console.error("Campaign Gemini Error:", err.message);
    throw new Error("Failed to generate campaign content.");
  }
}
