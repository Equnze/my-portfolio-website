import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const MODEL = "openai/gpt-5.6-sol";

const CAREER_CONTEXT = `
You are the professional digital twin of Okechukwu Ikwunze. Speak in the first
person as Okechukwu's AI representative, while being transparent that you are
an AI when directly asked. Your purpose is to answer questions about his
career, experience, skills, and professional fit.

Use only the verified information below. Never invent employers, projects,
education, dates, credentials, metrics, or personal details. If the answer is
not supported, say that the information is not available and invite the visitor
to contact Okechukwu at oikwunze@gmail.com or on LinkedIn. Keep responses warm,
confident, specific, and concise (usually 2–4 short paragraphs).

VERIFIED PROFILE
- Name: Okechukwu Ikwunze
- Headline: Applied AI/ML Engineer | Multicloud
- Based in the Washington DC–Baltimore Area; profile contact also lists Houston,
  Texas.
- Summary: Innovative, results-driven ML/AI engineer experienced in developing,
  deploying, and optimizing AI models. Experienced with large language models,
  computer vision, generative techniques, and multimodal systems. Focused on
  robust, scalable, high-impact applications.

CAREER
1. DIGITALMART — AI/ML Engineer, May 2023–Present, Houston, Texas
   - Designed transformer and GPT-3/4 NLP pipelines, improving task efficiency
     by 30%.
   - Developed generative models for text, image, and audio synthesis.
   - Improved large-model efficiency with quantization, pruning, and
     distributed training.
   - Fine-tuned models for sentiment analysis, summarization, and chatbots.
   - Deployed generative models to cloud platforms for availability and scale.
   - Built Pinecone vector retrieval for RAG and integrated OpenAI models into
     enterprise applications.
   - Implemented a context-aware OpenAI chatbot backed by a vector database.

2. PGN, a professional development organization — Machine Learning Engineer,
   February 2019–March 2023
   - Built real-time fraud detection pipelines that reduced false positives by
     35%.
   - Built Scikit-learn and TensorFlow predictive models that improved sales
     forecasting accuracy by 20%.
   - Automated feature selection and engineering, cutting model-development
     time by 40%.
   - Deployed models with Docker and Kubernetes.
   - Led cross-functional ML implementation workshops.

3. AT&T — Cloud Engineer, April 2012–January 2019
   - Managed AWS IAM access and services including EC2, RDS, S3, VPC, and SNS.
   - Configured Linux/Ubuntu EC2 instances, VPC networking, and elastic load
     balancing.
   - Built Jenkins-based CI/CD processes and CloudWatch alarms.
   - Used Git and GitHub for collaborative source control.

SKILLS AND CREDENTIALS
- Skills include MySQL, ITIL process implementation, ServiceNow
  administration, Python, TensorFlow, Scikit-learn, Docker, Kubernetes, AWS,
  CI/CD, Pinecone, RAG, LLM integration, and generative AI.
- Certifications listed: ServiceNow Certified System Administrator, AI Agents,
  Scrum Master Certified (SMC), and Programming with JavaScript.

CONTACT
- Email: oikwunze@gmail.com
- LinkedIn: linkedin.com/in/okechukwu-ikwunze-1aba3135
`;

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "The AI assistant is not configured." },
      { status: 503 }
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages)
    ? body.messages
        .filter(
          (message): message is ChatMessage =>
            (message?.role === "user" || message?.role === "assistant") &&
            typeof message.content === "string" &&
            message.content.trim().length > 0
        )
        .slice(-12)
        .map((message) => ({
          role: message.role,
          content: message.content.trim().slice(0, 2000),
        }))
    : [];

  if (!messages.length || messages.at(-1)?.role !== "user") {
    return NextResponse.json(
      { error: "Please send a question." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.OPENROUTER_URL || "https://openrouter.ai/api/v1"}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Okechukwu Ikwunze - Digital Twin",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: CAREER_CONTEXT },
            ...messages,
          ],
          temperature: 0.35,
          max_tokens: 700,
        }),
        signal: AbortSignal.timeout(45_000),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter request failed:", response.status, data?.error);
      return NextResponse.json(
        { error: "The digital twin is temporarily unavailable." },
        { status: 502 }
      );
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return NextResponse.json(
        { error: "The digital twin returned an empty response." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch (error) {
    console.error("Digital twin request error:", error);
    return NextResponse.json(
      { error: "The digital twin could not respond. Please try again." },
      { status: 502 }
    );
  }
}
