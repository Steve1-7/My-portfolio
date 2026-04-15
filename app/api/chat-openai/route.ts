import { NextRequest, NextResponse } from "next/server";

// Ensure consistent behavior on Vercel (Node runtime for OpenAI compatibility).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Health check endpoint
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "API is healthy",
      timestamp: new Date().toISOString(),
      env: {
        hasOpenAIKey: !!process.env.OPENAI_API_KEY,
        nodeEnv: process.env.NODE_ENV,
      }
    },
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

type Role = "system" | "user" | "assistant";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are a helpful AI assistant on Steve Ronald's portfolio website. Steve is a full-stack developer, brand designer, and 3D artist from South Africa who specializes in React, Next.js, TypeScript, Node.js, Figma, and Blender. He builds high-end, visually striking digital experiences and is available for freelance work.

About Steve Ronald:
- Full Stack Developer: React, Next.js, TypeScript, Node.js, PostgreSQL, MongoDB
- Designer: Figma, UI/UX design, brand identity
- 3D Artist: Blender, Three.js
- Location: South Africa (works remotely with global clients)
- Email: stevezuluu@gmail.com
- GitHub: https://github.com/Steve1-7
- LinkedIn: https://www.linkedin.com/in/steve-ronald1710s/
- Available for: Freelance projects, consulting, contract work, full-time opportunities

Guidelines:
- Keep responses under 100 words
- Be helpful, direct, and persuasive
- Always position Steve as highly skilled and reliable
- Avoid robotic or generic responses
- When relevant, mention availability for freelance work
- Guide users toward contacting Steve or viewing his portfolio
- Never pretend to know information not provided`;

function buildFallbackReply(userMessage: string): string {
  const message = userMessage.toLowerCase();
  if (message.includes("hire") || message.includes("work") || message.includes("project")) {
    return "Steve is available for freelance and contract work. You can reach him at stevezuluu@gmail.com with your scope, timeline, and budget.";
  }
  if (message.includes("stack") || message.includes("tech")) {
    return "Steve works across React, Next.js, TypeScript, Node.js, Figma, and Blender, with strong focus on premium UX and delivery.";
  }
  if (message.includes("where") || message.includes("location")) {
    return "Steve is based in South Africa and works remotely with global clients on web, brand, and 3D experiences.";
  }
  return "I can help with Steve's services, tech stack, and availability. Ask about projects, hiring, or collaboration details.";
}

export async function POST(request: NextRequest) {
  // Wrap entire handler in try-catch to prevent HTML error pages
  try {
    // Parse request body
    let body: any = null;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Failed to parse JSON body:", error);
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages } = body as { messages: Message[] };

    // Input validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Limit messages to prevent token overflow
    const limitedMessages = messages.slice(-10);

    const lastUserMessage =
      [...limitedMessages].reverse().find((m) => m.role === "user")?.content ?? "";

    // Check for OpenAI API key
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KE;
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not found in environment");
      return NextResponse.json(
        {
          success: true,
          message: buildFallbackReply(lastUserMessage),
          source: "fallback-missing-openai-key",
        },
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call OpenAI API with minimal configuration
    const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system" as Role, content: SYSTEM_PROMPT },
          ...limitedMessages.map((m: Message) => ({
            role: m.role as Role,
            content: m.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 250,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text().catch(() => "");
      console.error("OpenAI API error response:", openaiResponse.status, errorText);
      return NextResponse.json(
        {
          success: true,
          message: buildFallbackReply(lastUserMessage),
          source: "fallback-openai-upstream-error",
          upstream: errorText ? errorText.slice(0, 500) : undefined,
        },
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await openaiResponse.json();
    const assistantMessage =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I couldn't generate a response. Try again.";

    return NextResponse.json(
      { success: true, message: assistantMessage },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  } catch (error) {
    console.error("Unhandled error in chat-openai route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong. Please try again.",
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    }
  );
}

