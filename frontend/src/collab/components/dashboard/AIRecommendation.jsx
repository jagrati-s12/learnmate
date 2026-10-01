import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Bot, Sparkles } from "lucide-react";
import api from "../../../api/client";

export default function AIRecommendation() {
  const [rec, setRec] = useState(null);

  useEffect(() => {
    async function fetchRec() {
      try {
        const res = await api.get("/api/v1/recommendations/");
        setRec(res.data);
      } catch (err) {
        console.error("AI Recommendation error:", err);
      }
    }
    fetchRec();
  }, []);

  return (
    <section className="card ai-card relative overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50 border-blue-100">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={100} />
      </div>
      <div className="ai-heading">
        <div className="ai-spark bg-[#C9A66B] text-white shadow-lg shadow-blue-500/30 font-serif mr-3">✦</div>
        <div>
          <h3 className="text-blue-900 font-bold">AI Study Recommendation</h3>
          <p className="text-blue-700/70 text-sm font-medium">Based on your SSC JE Civil activity</p>
        </div>
      </div>

      <div className="ai-message bg-theme-bg-secondary/80 backdrop-blur border border-white p-4 rounded-lg my-4 shadow-sm z-10 relative">
        <strong className="text-theme-text-primary block mb-1">{rec ? rec.title : "Analyzing your performance..."}</strong>
        <p className="text-theme-text-secondary text-sm leading-relaxed">
          {rec ? rec.rationale : "Please wait while we crunch your recent test numbers to build a personalized study vector."}
        </p>
      </div>

      <NavLink to="/learn/ai-tutor" className="primary-button z-10 relative bg-[#C9A66B] hover:bg-[#A8895C] text-white shadow shadow-blue-500/20 border-none transition-all hover:-translate-y-0.5">
        <Bot size={17} /> {rec ? rec.action : "Ask Civil AI Tutor"}
      </NavLink>
    </section>
  );
}
