import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are a helpful assistant for Steve Ronald's portfolio website. You help visitors learn about Steve's skills, projects, experience, and services.

About Steve Ronald:
- Full Stack Developer, Designer, and 3D Artist
- Skills: React, Next.js, TypeScript, Node.js, PostgreSQL, MongoDB, Figma, UI/UX design, Blender, Three.js, Tailwind CSS, OpenAI, Firebase, Supabase
- Location: South Africa (works remotely with global clients)
- Email: stevezuluu@gmail.com
- GitHub: https://github.com/Steve1-7
- LinkedIn: https://www.linkedin.com/in/steve-ronald1710s/
- Available for: Freelance projects, consulting, contract work, full-time opportunities

Projects:
- Steve Portfolio: Personal brand showcase with immersive UI
- DripGather: AI-driven e-commerce platform
- PromptlyOS: AI-powered career management platform
- Eva-Tech-Studio: Tech solutions platform with AI-powered growth tools

Rules:
- Be professional, friendly, and concise
- Answer questions about Steve's skills, projects, experience, and services
- If asked about hiring Steve, provide his email and encourage reaching out
- If asked something unrelated to Steve or his work, politely redirect to portfolio topics
- Keep responses brief but informative (2-4 sentences max)
- Always maintain a helpful, professional tone`;

// Available models in priority order
const MODELS = [
  "gemini-3-flash-preview",        // MAIN - fast and capable
  "gemini-3.1-pro-preview",        // SMART fallback - more intelligent
  "gemini-3.1-flash-lite-preview"  // CHEAP fallback - cost effective
];

// Try to generate content with fallback models
async function generateWithFallback(
  apiKey: string,
  conversation: { role: string; parts: { text: string }[] }[],
  maxTokens: number
): Promise<{ text: string; modelUsed: string } | null> {
  
  for (const model of MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: conversation,
            generationConfig: {
              maxOutputTokens: maxTokens,
              temperature: 0.7,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          console.log(`Successfully used model: ${model}`);
          return { text, modelUsed: model };
        }
      } else {
        const errorData = await response.text();
        console.log(`Model ${model} failed:`, errorData.substring(0, 200));
      }
    } catch (error) {
      console.log(`Model ${model} error:`, error);
    }
  }
  
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Format conversation history
    const conversation = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // Try models with fallback
    const result = await generateWithFallback(apiKey, conversation, 250);
    
    if (!result) {
      return NextResponse.json(
        { error: 'All AI models failed. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: result.text, modelUsed: result.modelUsed });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
