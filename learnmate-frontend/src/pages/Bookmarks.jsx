import { Bookmark } from "lucide-react";
import ResourcePage from "../components/resources/ResourcePage";

export default function Bookmarks() {
  return (
    <ResourcePage
      title="Bookmarks"
      icon={<Bookmark />}
      items={[
        "Top 50 DSA Questions",
        "Dynamic Programming Patterns",
        "DBMS Interview Questions",
        "Operating System Notes",
        "Computer Networking Cheatsheet"
      ]}
    />
  );
}
