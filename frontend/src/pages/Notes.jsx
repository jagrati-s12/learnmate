import { FileText } from "lucide-react";
import ResourcePage from "../components/resources/ResourcePage";

export default function Notes() {
  return (
    <ResourcePage
      title="Civil Engineering Notes"
      icon={<FileText />}
      items={[
        "Surveying Formula Sheet",
        "Soil Mechanics Short Notes",
        "RCC Design Formulas",
        "Hydraulics Important Concepts",
        "Highway Engineering Revision Notes"
      ]}
    />
  );
}
