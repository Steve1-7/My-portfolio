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

// Determine query complexity based on message content
function getQueryComplexity(messages: { role: string; content: string }[]): 'simple' | 'normal' | 'complex' {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
  const conversationLength = messages.length;
  
  // Simple queries: greetings, short questions, basic info requests
  const simplePatterns = ['hi', 'hello', 'hey', 'how are you', 'what\'s up', 'who are you', 'help'];
  const isSimple = simplePatterns.some(p => lastMessage.includes(p)) || lastMessage.length < 20;
  
  // Complex queries: multi-part questions, technical deep dives, comparisons
  const complexPatterns = [
    'compare', 'difference between', 'vs', 'versus',
    'explain in detail', 'how does', 'technical', 'architecture',
    'experience with', 'portfolio', 'multiple', 'and', 'also'
  ];
  const isComplex = complexPatterns.some(p => lastMessage.includes(p)) || 
                    lastMessage.length > 100 ||
                    conversationLength > 6;
  
  if (isSimple) return 'simple';
  if (isComplex) return 'complex';
  return 'normal';
}

// Select model based on query complexity
function getModel(complexity: 'simple' | 'normal' | 'complex'): string {
  switch (complexity) {
    case 'simple':
      return 'gemini-1.5-flash'; // Fast, cost-effective for simple queries
    case 'normal':
      return 'gemini-1.5-flash-latest'; // Latest flash for normal queries
    case 'complex':
      return 'gemini-1.5-pro'; // Pro model for complex queries
    default:
      return 'gemini-1.5-flash';
  }
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

    // Determine query complexity and select appropriate model
    const complexity = getQueryComplexity(messages);
    const model = getModel(complexity);
    
    console.log(`Using ${model} for ${complexity} query`);

    // Format conversation history
    const conversation = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: conversation,
          generationConfig: {
            maxOutputTokens: complexity === 'complex' ? 500 : 250,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from AI' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I'm here to help you learn about Steve and his work. What would you like to know?";

    return NextResponse.json({ message: aiResponse, modelUsed: model });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
