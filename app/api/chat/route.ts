import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const PORTFOLIO_INFO = {
  name: "Steve Ronald",
  role: "Full Stack Developer, Designer, and 3D Artist",
  location: "South Africa (works remotely with global clients)",
  email: "stevezuluu@gmail.com",
  github: "https://github.com/Steve1-7",
  linkedin: "https://www.linkedin.com/in/steve-ronald1710s/",
  skills: "React, Next.js, TypeScript, Node.js, PostgreSQL, MongoDB, Figma, UI/UX design, brand identity, Blender, Three.js",
  availability: "Freelance projects, consulting, contract work, full-time opportunities",
  sections: {
    hero: "Introduction and overview",
    about: "Detailed bio and background",
    skills: "Technical skills and technologies",
    projects: "Portfolio projects and case studies",
    services: "Services offered",
    testimonials: "Client testimonials",
    gallery: "Visual gallery",
    contact: "Contact form and information"
  }
};

function getResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Greeting
  if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
    return `Hello! I'm Steve Ronald's portfolio assistant. Steve is a ${PORTFOLIO_INFO.role} from ${PORTFOLIO_INFO.location}. How can I help you learn more about Steve's work?`;
  }

  // Who is Steve / About
  if (lowerMessage.match(/(who|what|about|steve)/)) {
    return `Steve Ronald is a ${PORTFOLIO_INFO.role} based in ${PORTFOLIO_INFO.location}. He specializes in ${PORTFOLIO_INFO.skills} and is available for ${PORTFOLIO_INFO.availability}. You can check out his work in the Projects section of this portfolio.`;
  }

  // Skills
  if (lowerMessage.match(/(skill|technology|tech|stack|can you do)/)) {
    return `Steve's technical skills include: ${PORTFOLIO_INFO.skills}. He's particularly skilled in React, Next.js, and TypeScript for web development, and uses Figma for design work.`;
  }

  // Contact
  if (lowerMessage.match(/(contact|email|reach|hire|work with)/)) {
    return `You can contact Steve at ${PORTFOLIO_INFO.email}. He's available for ${PORTFOLIO_INFO.availability}. You can also connect with him on LinkedIn: ${PORTFOLIO_INFO.linkedin} or check his GitHub: ${PORTFOLIO_INFO.github}`;
  }

  // Location
  if (lowerMessage.match(/(where|location|country|based)/)) {
    return `Steve is based in South Africa and works remotely with global clients. He's available for international projects.`;
  }

  // Projects
  if (lowerMessage.match(/(project|work|portfolio|case study)/)) {
    return `Steve has worked on various full-stack development projects, UI/UX design projects, and 3D art projects. You can view his detailed portfolio projects in the Projects section of this website.`;
  }

  // Services
  if (lowerMessage.match(/(service|offer|help|what do you do)/)) {
    return `Steve offers freelance development, consulting, contract work, and is open to full-time opportunities. His services include full-stack web development, UI/UX design, and 3D art using Blender and Three.js.`;
  }

  // Navigation help
  if (lowerMessage.match(/(navigate|find|where is|show me|scroll to|go to)/)) {
    const sectionMatch = lowerMessage.match(/(hero|about|skills|projects|services|testimonials|gallery|contact)/);
    if (sectionMatch) {
      const section = sectionMatch[1] as keyof typeof PORTFOLIO_INFO.sections;
      return `The ${section} section contains ${PORTFOLIO_INFO.sections[section]}. Scroll down to find it, or let me know if you need help navigating to a specific section.`;
    }
    return `You can navigate to different sections: Hero, About, Skills, Projects, Services, Testimonials, Gallery, and Contact. Which section would you like to explore?`;
  }

  // Default response
  return `I'm here to help you learn about Steve Ronald and navigate his portfolio. Feel free to ask about Steve's skills, projects, services, or how to contact him. You can reach Steve at ${PORTFOLIO_INFO.email}.`;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid request: messages array required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get the last user message
    const lastUserMessage = messages.filter(m => m.role === "user").pop();
    const userContent = lastUserMessage?.content || "";

    // Generate response based on user input
    const assistantMessage = getResponse(userContent);

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
