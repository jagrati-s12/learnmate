import { FileText } from "lucide-react";
import ResourcePage from "../components/resources/ResourcePage";

export default function Notes() {
  return (
    <ResourcePage
      title="My Notes"
      icon={<FileText />}
      items={[
        "Arrays Important Points",
        "DP Formulas Summary",
        "SQL Joins Explained",
        "Process States in OS",
        "Computer Networks Laws"
      ]}
    />
  );
}
