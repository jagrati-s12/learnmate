import { useState } from "react";
import { Bot } from "lucide-react";
import PageIntro from "../common/PageIntro";

export default function AITutor() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "user",
      text: "Explain the difference between permeability and seepage velocity."
    },
    {
      role: "ai",
      text:
        "Permeability describes how easily water can flow through soil, while seepage velocity is the average velocity of water through the voids. I can explain the formula, assumptions and solve a numerical SSC JE Civil example."
    }
  ]);

  function send() {
    if (!input.trim()) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: input },
      {
        role: "ai",
        text:
          "Your question is ready to be sent to the LearnMate Civil AI backend. The production version can return an SSC JE-focused explanation, formula, solved example and related PYQs."
      }
    ]);

    setInput("");
  }

  return (
    <div className="page">
      <PageIntro
        title="Civil AI Tutor"
        subtitle="Ask doubts from SSC JE Civil, reasoning or general awareness."
      />

      <section className="card chat-card">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div className={`chat-row ${message.role}`} key={index}>
              <div className="chat-bubble">{message.text}</div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && send()}
            placeholder="Ask a Civil Engineering doubt..."
          />
          <button onClick={send}>
            <Bot size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
