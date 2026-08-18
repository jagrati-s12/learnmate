import { useState } from "react";
import { Bot } from "lucide-react";
import PageIntro from "../common/PageIntro";

export default function AITutor() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "user", text: "Explain Kadane's Algorithm with an example." },
    {
      role: "ai",
      text: "Sure! Kadane's Algorithm is used to find the maximum sum subarray in an array.\n\n1. Initialize current_sum and max_sum with the first element.\n2. Iterate from the second element.\n3. Update current_sum = max(arr[i], current_sum + arr[i]).\n4. Update max_sum at each step.\n\nExample: [-2, 3, -4, 5, -1, 2, -3] → maximum sum = 6."
    }
  ]);

  function send() {
    if (!input.trim()) return;

    setMessages((m) => [
      ...m,
      { role: "user", text: input },
      {
        role: "ai",
        text: "Great question. I would send this message to your FastAPI AI endpoint and return a personalized answer here."
      }
    ]);

    setInput("");
  }

  return (
    <div className="page">
      <PageIntro title="AI Tutor" subtitle="Your personal AI teacher." />

      <section className="card chat-card">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div className={`chat-row ${m.role}`} key={i}>
              <div className="chat-bubble">{m.text}</div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask anything about your current topic..."
          />
          <button onClick={send}><Bot size={18} /></button>
        </div>
      </section>
    </div>
  );
}
