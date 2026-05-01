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

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Format messages for Hugging Face
    const conversation = messages.map((m: { role: string; content: string }) => 
      `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
    ).join('\n');

    const prompt = `${SYSTEM_PROMPT}\n\n${conversation}\nAssistant:`;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `<s>[INST] ${prompt} [/INST]`,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Hugging Face API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from AI' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiResponse = data[0]?.generated_text?.trim() || 
      "I'm here to help you learn about Steve and his work. What would you like to know?";

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
