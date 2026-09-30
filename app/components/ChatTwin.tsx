"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const prompts = [
  "What is your AI experience?",
  "Why are you a strong technical hire?",
  "Tell me about your cloud background.",
];

export default function ChatTwin() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I’m Okechukwu’s AI digital twin. Ask me about his experience, technical strengths, or career journey.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  useEffect(() => {
    if (open && (messages.length > 1 || loading)) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages, loading]);

  async function sendMessage(content: string) {
    const question = content.trim();
    if (!question || loading) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: question },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data?.error || "Request failed");

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "I couldn’t respond just now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  return (
    <div className={open ? "ai-assistant is-open" : "ai-assistant"}>
      <button
        className="ai-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close AI digital twin" : "Chat with AI digital twin"}
        aria-expanded={open}
      >
        <span className="ai-trigger-copy">
          <small>MEET OI</small>
          Ask my AI twin
        </span>
        <span className="ai-orb" aria-hidden="true">
          <i className="ai-orb-ring" />
          <i className="ai-orb-core">{open ? "×" : "OI"}</i>
        </span>
      </button>

      <aside
        className="ai-window"
        aria-label="AI digital twin chat"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="ai-aurora" aria-hidden="true" />
        <header className="ai-header">
          <div className="ai-identity">
            <span className="ai-mini-orb"><i>OI</i></span>
            <div>
              <strong>Okechukwu <em>/ AI</em></strong>
              <p><i /> Online · Career intelligence</p>
            </div>
          </div>
          <button
            className="ai-close"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
              <path d="M6 6l12 12M18 6 6 18" fill="none" />
            </svg>
          </button>
        </header>

        <div className="ai-intro">
          <span>AI DIGITAL TWIN / 01</span>
          <h2>Ask what a résumé<br />can&apos;t tell you.</h2>
        </div>

        <div className="ai-messages" aria-live="polite">
          {messages.map((message, index) => (
            <article className={`ai-message ${message.role}`} key={index}>
              {message.role === "assistant" && <span className="ai-message-mark">OI</span>}
              <div>
                <small>{message.role === "assistant" ? "OI / AI" : "YOU"}</small>
                <p>{message.content}</p>
              </div>
            </article>
          ))}

          {messages.length === 1 && (
            <div className="ai-suggestions">
              <span>TRY ASKING</span>
              {prompts.map((prompt) => (
                <button key={prompt} onClick={() => void sendMessage(prompt)}>
                  {prompt}<i>→</i>
                </button>
              ))}
            </div>
          )}

          {loading && (
            <article className="ai-message assistant">
              <span className="ai-message-mark">OI</span>
              <div className="ai-thinking" aria-label="Digital twin is thinking">
                <small>THINKING</small>
                <p><i /><i /><i /></p>
              </div>
            </article>
          )}
          <div ref={endRef} />
        </div>

        <div className="ai-composer-wrap">
          <form className="ai-composer" onSubmit={submit}>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about Okechukwu..."
              maxLength={2000}
              disabled={loading}
              aria-label="Your question"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send question"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                <path d="M5 12h14M13 6l6 6-6 6" fill="none" />
              </svg>
            </button>
          </form>
          <p><span /> Powered by AI · Answers grounded in verified career data</p>
        </div>
      </aside>
    </div>
  );
}
