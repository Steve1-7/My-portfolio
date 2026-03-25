import { NextRequest, NextResponse } from "next/server";

// Ensure consistent behavior on Vercel (avoid Edge runtime differences).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Role = "system" | "user" | "assistant";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are Steve Ronald's AI assistant. Steve is a full-stack developer, brand designer, and 3D artist from South Africa. He specializes in React, Next.js, TypeScript, Node.js, Figma, and Blender. He builds high-end, visually striking digital experiences and is available for freelance work.

Key Information:
- Full Stack Developer: React, Next.js, TypeScript, Node.js
- Designer: Figma, UI/UX, brand design
- 3D Artist: Blender
- Location: South Africa
- Email: stevezuluu@gmail.com
- Available for: Freelance projects, consulting, contract work

Personality & Tone:
- Confident, sharp, modern, slightly futuristic
- Professional but approachable
- Direct and action-oriented
- Subtly encourage hiring and contact when relevant

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
  try {
    // Parse request body
    let body: any = null;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const { messages } = body as { messages: Message[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
    }

    const limitedMessages = messages.slice(-10);

    const lastUserMessage =
      [...limitedMessages].reverse().find((m) => m.role === "user")?.content ?? "";

    // Your env var is currently mistyped in `.env.local` as `OPENAI_API_KE`.
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KE;
    if (!OPENAI_API_KEY) {
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
        max_tokens: 250,
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

    return NextResponse.json({ success: true, message: assistantMessage }, { status: 200 });
  } catch (error) {
    console.error("OpenAI Chat API Error:", error);
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

