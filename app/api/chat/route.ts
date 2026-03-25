import { NextRequest, NextResponse } from "next/server";

// Avoid any Edge/runtime differences on Vercel.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Hugging Face Router API Configuration (OpenAI-compatible chat completions)
const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;

// Steve Ronald's system prompt
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
- Never pretend to know information not provided

When users ask about services, pricing, projects, hiring, or technologies - answer with confidence and modern perspective.`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

function buildFallbackReply(userMessage: string): string {
  const message = userMessage.toLowerCase();

  if (message.includes("hire") || message.includes("work") || message.includes("project")) {
    return "Steve is available for freelance and contract work. You can reach him at stevezuluu@gmail.com with your scope, timeline, and budget for a fast response.";
  }

  if (message.includes("stack") || message.includes("tech")) {
    return "Steve works across React, Next.js, TypeScript, Node.js, Figma, and Blender, with strong focus on premium UX and modern full-stack delivery.";
  }

  if (message.includes("where") || message.includes("location")) {
    return "Steve is based in South Africa and works remotely with global clients on web, brand, and 3D experiences.";
  }

  return "I can help with Steve's services, tech stack, and availability. Ask about projects, hiring, or collaboration details and I will point you in the right direction.";
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: any = null;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }
    const { messages } = body as { messages: Message[] };

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Security: limit message history to prevent abuse
    const limitedMessages = messages.slice(-10);
    const lastUserMessage =
      [...limitedMessages].reverse().find((m) => m.role === "user")?.content ?? "";

    // Graceful fallback when API key is not configured
    if (!HF_API_KEY) {
      console.error("Missing HUGGING_FACE_API_KEY environment variable");
      return NextResponse.json(
        {
          success: true,
          message: buildFallbackReply(lastUserMessage),
          source: "fallback",
        },
        { status: 200 }
      );
    }

    // Call Hugging Face Inference API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...limitedMessages,
        ],
        max_tokens: 150,
        temperature: 0.7,
        top_p: 0.9,
      }),
      signal: controller.signal,
    }).finally(() => {
      clearTimeout(timeout);
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API Error:", errorText);

      const isLoadingError =
        response.status === 503 || errorText.toLowerCase().includes("loading");

      if (isLoadingError) {
        return NextResponse.json(
          {
            success: true,
            message: "The AI model is warming up right now. Please retry in a few seconds.",
            source: "hf-warmup",
          },
          { status: 200 }
        );
      }

      // Graceful fallback for any upstream provider failure
      return NextResponse.json(
        {
          success: true,
          message: buildFallbackReply(lastUserMessage),
          source: "fallback-upstream",
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const assistantMessage =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I couldn't generate a response. Try again.";

    // Return structured response
    return NextResponse.json(
      {
        success: true,
        message: assistantMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (server-side only)
    console.error("Chat API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Helpful for deployment debugging: if this route isn't deployed,
// Vercel will return an HTML 404 page instead of JSON.
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Use POST /api/chat with a JSON body: { messages: [...] }",
    },
    { status: 405 }
  );
}
