import { ChevronRight } from "lucide-react";
import PageIntro from "../common/PageIntro";

export default function ResourcePage({ title, icon, items }) {
  return (
    <div className="page">
      <PageIntro
        title={title}
        subtitle="Your saved SSC JE Civil preparation resources."
        action="+ New"
      />

      <div className="resource-list card">
        {items.map((item) => (
          <div className="resource-row" key={item}>
            <div className="resource-icon">{icon}</div>

            <div>
              <strong>{item}</strong>
              <span>SSC JE Civil · Saved recently</span>
            </div>

            <ChevronRight size={17} />
          </div>
        ))}
      </div>
    </div>
  );
}
