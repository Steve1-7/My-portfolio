import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";

// Ensure consistent behavior on Vercel (avoid Edge runtime differences).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Role = "system" | "user" | "assistant";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are a helpful AI assistant on Steve Ronald's portfolio website. Steve is a full-stack developer, brand designer, and 3D artist from South Africa who specializes in React, Next.js, TypeScript, Node.js, Figma, and Blender. He builds high-end, visually striking digital experiences and is available for freelance work.

Your Primary Role:
- You can answer ANY question - not just portfolio-related ones. You are a general-purpose AI assistant like ChatGPT.
- When users ask about Steve, his work, skills, or hiring, provide detailed, accurate information about him.
- When users ask general questions (coding, technology, creative work, etc.), answer them comprehensively and helpfully.

About Steve Ronald (use this when relevant):
- Full Stack Developer: React, Next.js, TypeScript, Node.js, PostgreSQL, MongoDB
- Designer: Figma, UI/UX design, brand identity
- 3D Artist: Blender, Three.js
- Location: South Africa (works remotely with global clients)
- Email: stevezuluu@gmail.com
- GitHub: https://github.com/Steve1-7
- LinkedIn: https://www.linkedin.com/in/steve-ronald1710s/
- Available for: Freelance projects, consulting, contract work, full-time opportunities

Communication Style:
- Be conversational, friendly, and professional
- Provide detailed, well-structured responses
- Use formatting (bullet points, numbered lists, code blocks) when appropriate
- Be helpful and encourage follow-up questions
- When discussing Steve, mention his availability for work naturally
- For general questions, be thorough and educational

Guidelines:
- Answer questions comprehensively - don't limit to 100 words
- If you don't know something, admit it honestly
- When relevant to the conversation, suggest reaching out to Steve
- Format code blocks with proper syntax highlighting
- Use markdown for better readability
- Be encouraging and helpful`;

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
  try {
    // Rate limiting
    let identifier: string;
    try {
      identifier = getClientIdentifier(request)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error getting client identifier:", error);
      }
      identifier = 'unknown';
    }

    let rateLimitResult;
    try {
      rateLimitResult = rateLimit(identifier, 20, 60000) // 20 requests per minute
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error in rate limiting:", error);
      }
      rateLimitResult = { success: true, remaining: 20, resetTime: Date.now() + 60000 };
    }
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    // Parse request body
    let body: any = null;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const { messages } = body as { messages: Message[] };

    // Input validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
    }

    // Sanitize messages
    const sanitizedMessages = messages.filter((msg: Message) => {
      if (!msg || typeof msg !== 'object') return false
      if (!msg.role || !msg.content) return false
      if (typeof msg.content !== 'string') return false
      if (msg.content.length > 10000) return false // Max 10k characters per message
      if (!['user', 'assistant'].includes(msg.role)) return false
      return true
    }).map((msg: Message) => ({
      role: msg.role,
      content: msg.content.trim().slice(0, 10000)
    }))

    if (sanitizedMessages.length === 0) {
      return NextResponse.json({ success: false, error: "No valid messages provided" }, { status: 400 });
    }

    const limitedMessages = sanitizedMessages.slice(-20);

    const lastUserMessage =
      [...limitedMessages].reverse().find((m) => m.role === "user")?.content ?? "";

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      if (process.env.NODE_ENV === 'development') {
        console.error("OPENAI_API_KEY not found in environment");
      }
      return NextResponse.json(
        {
          success: true,
          message: buildFallbackReply(lastUserMessage),
          source: "fallback-missing-openai-key",
        },
        { status: 200 }
      );
    }

    const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system" as Role, content: SYSTEM_PROMPT },
          ...limitedMessages.map((m) => ({
            role: m.role as Role,
            content: m.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      // Try to return upstream error text, but still keep JSON output.
      const errorText = await response.text().catch(() => "");
      return NextResponse.json(
        {
          success: true,
          message: buildFallbackReply(lastUserMessage),
          source: "fallback-openai-upstream-error",
          upstream: errorText ? errorText.slice(0, 500) : undefined,
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const assistantMessage =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I couldn't generate a response. Try again.";

    return NextResponse.json({ success: true, message: assistantMessage }, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("OpenAI Chat API Error:", error);
    }
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Debug helper for deployments: prevents confusing HTML 404 pages.
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Use POST /api/chat-openai with JSON body: { messages: [{ role: 'user'|'assistant', content: string }] }",
    },
    { status: 405 }
  );
}

