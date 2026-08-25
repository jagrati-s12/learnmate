import { Bookmark } from "lucide-react";
import ResourcePage from "../components/resources/ResourcePage";

export default function Bookmarks() {
  return (
    <ResourcePage
      title="Saved Resources"
      icon={<Bookmark />}
      items={[
        "SSC JE Civil Previous Year Questions",
        "Civil Engineering Formula Sheet",
        "Surveying Numerical Practice",
        "RCC Design Questions",
        "Transportation Engineering Revision"
      ]}
    />
  );
}
