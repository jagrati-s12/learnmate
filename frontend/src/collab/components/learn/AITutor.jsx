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
      <div className="w-full text-center px-4 py-8 bg-[#211C18] rounded-t-2xl border border-gray-800 shadow-sm z-10 relative">
        <div className="relative inline-flex mb-6">
          <div className="absolute inset-0 bg-[#302821] rounded-full blur-xl opacity-60"></div>
          <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center transform rotate-3 shadow-lg">
            <Bot size={36} className="text-white transform -rotate-3" />
          </div>
          <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles size={12} /> BETA
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-[#F3EDE3] mb-4 tracking-tight">
          Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI Civil Engineering</span> Tutor
        </h1>

        <p className="text-[#C8BFB2] text-lg mb-8 max-w-lg mx-auto leading-relaxed">
          Ask questions, get step-by-step solutions for soil mechanics, structural analysis, IS Code provisions, and SSC JE concepts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-[#28211C] border border-gray-800">
            <MessageSquare size={20} className="text-[#C9A66B] mb-3" />
            <h3 className="font-semibold text-[#F3EDE3] mb-1 text-sm">Instant Doubt Solving</h3>
            <p className="text-xs text-[#968C80]">Stuck on a tricky soil mechanics numerical? Get step-by-step guidance instantly.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#28211C] border border-gray-800">
            <BookOpen size={20} className="text-indigo-500 mb-3" />
            <h3 className="font-semibold text-[#F3EDE3] mb-1 text-sm">Concept Simplifier</h3>
            <p className="text-xs text-[#968C80]">Complex IS Code provisions explained with simple, real-world examples.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#28211C] border border-gray-800">
            <Clock size={20} className="text-[#C9A66B] mb-3" />
            <h3 className="font-semibold text-[#F3EDE3] mb-1 text-sm">24/7 Availability</h3>
            <p className="text-xs text-[#968C80]">Your dedicated study partner, ready whenever you sit down to prepare.</p>
          </div>
        </div>
      </div>

      {/* Embedded Working Chat Interface */}
      <section className="card chat-card flex flex-col w-full shadow-sm border border-t-0 border-gray-800 rounded-b-2xl rounded-t-none -mt-3 relative z-0" style={{ backgroundColor: 'var(--bg-card)', height: '500px' }}>
        <div className="chat-messages flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((message, index) => (
            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`} key={index}>
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-[#28211C] text-[#F3EDE3] border border-gray-800 rounded-bl-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 opacity-80 text-xs">
                  {message.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  {message.role === 'user' ? 'You' : 'AI Tutor'}
                </div>
                <div className="text-sm leading-relaxed overflow-x-auto text-[#F3EDE3]">
                  {message.role === 'user' ? (
                    <div className="whitespace-pre-wrap">{message.text}</div>
                  ) : (
                    <div className="markdown-body dark-theme-markdown">
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
               <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-[#28211C] border border-gray-800 text-[#F3EDE3] rounded-bl-none flex items-center gap-2">
                 <Loader2 size={16} className="animate-spin text-[#C9A66B]" />
                 <span className="text-sm text-[#968C80]">Thinking...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input p-4 border-t border-gray-800 flex gap-2 bg-[#211C18] rounded-b-2xl">
          <input
            className="flex-1 px-4 py-3 border border-gray-700 bg-[#28211C] text-[#F3EDE3] placeholder-[#968C80] rounded-full outline-none focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && send()}
            placeholder="Ask a Civil Engineering doubt..."
            disabled={loading}
          />
          <button
            className="!rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-50 bg-[#C9A66B] hover:bg-[#A8895C] text-[#171411] transition-colors"
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
