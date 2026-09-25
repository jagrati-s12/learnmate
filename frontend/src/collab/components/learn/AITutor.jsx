import { useState, useRef, useEffect } from "react";
import { Bot, User, Loader2, Sparkles, MessageSquare, BookOpen, Clock } from "lucide-react";
import { aiTutorAPI } from "../../../api/aiTutor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function AITutor() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const defaultMessage = {
    role: "ai",
    text: "Hi! I'm your LearnMate Civil AI Tutor. Ask me any doubts regarding SSC JE Civil Engineering concepts!"
  };

  const [messages, setMessages] = useState([defaultMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Load existing chat history from Supabase via backend on mount
    async function fetchHistory() {
      try {
        const data = await aiTutorAPI.getHistory();
        if (data.history && data.history.length > 0) {
          const loadedMessages = data.history.map((msg) => ({
            role: msg.role === "model" ? "ai" : "user",
            text: msg.parts ? msg.parts.join("\n") : ""
          }));
          setMessages(loadedMessages);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    }
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await aiTutorAPI.solveDoubt(userMessage.text);
      setMessages((current) => [
        ...current,
        {
          role: "ai",
          text: data.answer
        }
      ]);
    } catch (err) {
      const errorMessage = err?.response?.data?.detail || "Sorry, I am having trouble connecting to the AI service right now.";
      setMessages((current) => [
        ...current,
        {
          role: "ai",
          text: errorMessage
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page flex flex-col items-center max-w-5xl mx-auto min-h-[80vh] py-6 px-4">
      {/* Header UI */}
      <div className="w-full text-center px-4 py-8 bg-theme-bg-secondary rounded-t-2xl border border-[rgba(243,237,227,0.08)] shadow-sm z-10 relative">
        <div className="relative inline-flex mb-6">
          <div className="absolute inset-0 bg-theme-bg-elevated rounded-full blur-xl opacity-60"></div>
          <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center transform rotate-3 shadow-lg">
            <Bot size={36} className="text-white transform -rotate-3" />
          </div>
          <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles size={12} /> BETA
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-theme-text-primary mb-4 tracking-tight">
          Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI Civil Engineering</span> Tutor
        </h1>

        <p className="text-theme-text-secondary text-lg mb-8 max-w-lg mx-auto leading-relaxed">
          Ask questions, get step-by-step solutions for soil mechanics, structural analysis, IS Code provisions, and SSC JE concepts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-theme-bg-surface border border-[rgba(243,237,227,0.08)]">
            <MessageSquare size={20} className="text-theme-accent-primary mb-3" />
            <h3 className="font-semibold text-theme-text-primary mb-1 text-sm">Instant Doubt Solving</h3>
            <p className="text-xs text-theme-text-muted">Stuck on a tricky soil mechanics numerical? Get step-by-step guidance instantly.</p>
          </div>
          <div className="p-4 rounded-xl bg-theme-bg-surface border border-[rgba(243,237,227,0.08)]">
            <BookOpen size={20} className="text-indigo-500 mb-3" />
            <h3 className="font-semibold text-theme-text-primary mb-1 text-sm">Concept Simplifier</h3>
            <p className="text-xs text-theme-text-muted">Complex IS Code provisions explained with simple, real-world examples.</p>
          </div>
          <div className="p-4 rounded-xl bg-theme-bg-surface border border-[rgba(243,237,227,0.08)]">
            <Clock size={20} className="text-theme-accent-primary mb-3" />
            <h3 className="font-semibold text-theme-text-primary mb-1 text-sm">24/7 Availability</h3>
            <p className="text-xs text-theme-text-muted">Your dedicated study partner, ready whenever you sit down to prepare.</p>
          </div>
        </div>
      </div>

      {/* Embedded Working Chat Interface */}
      <section className="flex flex-col w-full shadow-sm border border-t-0 border-[rgba(243,237,227,0.08)] rounded-b-2xl rounded-t-none -mt-3 relative z-0" style={{ backgroundColor: 'var(--bg-card)', height: '500px' }}>
        <div className="chat-messages flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((message, index) => (
            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`} key={index}>
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-theme-bg-surface text-theme-text-primary border border-[rgba(243,237,227,0.08)] rounded-bl-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 opacity-80 text-xs">
                  {message.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  {message.role === 'user' ? 'You' : 'AI Tutor'}
                </div>
                <div className="text-sm leading-relaxed overflow-x-auto">
                  {message.role === 'user' ? (
                    <div className="whitespace-pre-wrap">{message.text}</div>
                  ) : (
                    <div className="markdown-body custom-markdown">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
               <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-theme-bg-surface border border-[rgba(243,237,227,0.08)] text-theme-text-primary rounded-bl-none flex items-center gap-2">
                 <Loader2 size={16} className="animate-spin text-theme-accent-primary" />
                 <span className="text-sm text-theme-text-muted">Thinking...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input p-4 border-t border-[rgba(243,237,227,0.08)] flex gap-2 bg-theme-bg-secondary rounded-b-2xl">
          <input
            className="flex-1 px-4 py-3 border border-[rgba(243,237,227,0.08)] bg-theme-bg-surface text-theme-text-primary placeholder-theme-text-muted rounded-full outline-none focus:border-theme-accent-primary focus:ring-1 focus:ring-theme-accent-primary transition-all"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && send()}
            placeholder="Ask a Civil Engineering doubt..."
            disabled={loading}
          />
          <button
            className="!rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-50 bg-theme-accent-primary hover:opacity-90 text-white transition-opacity shadow-sm"
            onClick={send}
            disabled={!input.trim() || loading}
          >
            <Bot size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}
