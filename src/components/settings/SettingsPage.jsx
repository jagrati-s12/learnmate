import { ChevronRight } from "lucide-react";
import PageIntro from "../common/PageIntro";

export default function SettingsPage({ section }) {
  const title =
    section === "profile"
      ? "Profile Settings"
      : section === "security"
        ? "Account & Security"
        : "Study Preferences";

  return (
    <div className="page">
      <PageIntro
        title={title}
        subtitle="Customize your SSC JE Civil preparation experience."
      />

      <section className="card settings-card">
        {section === "profile" ? (
          <>
            <div className="profile-head">
              <div className="profile-avatar">AS</div>
              <button className="secondary-button">Change Photo</button>
            </div>

            <label>Full Name<input defaultValue="Arav Sharma" /></label>
            <label>Exam<input defaultValue="SSC JE" /></label>
            <label>Branch<input defaultValue="Civil Engineering" /></label>

            <button className="primary-button">Save Changes</button>
          </>
        ) : section === "security" ? (
          <>
            {[
              "Change Password",
              "Two-Factor Authentication",
              "Connected Accounts",
              "Login History",
              "Delete Account"
            ].map((item) => (
              <button className="setting-row" key={item}>
                {item}
                <ChevronRight size={17} />
              </button>
            ))}
          </>
        ) : (
          <>
            <label>
              Target Exam
              <select><option>SSC JE Civil</option></select>
            </label>

            <label>
              Daily Study Goal
              <select>
                <option>2 hours</option>
                <option>3 hours</option>
                <option>4 hours</option>
                <option>6 hours</option>
              </select>
            </label>

            <label>
              Primary Focus
              <select>
                <option>General Engineering - Civil</option>
                <option>Reasoning</option>
                <option>General Awareness</option>
              </select>
            </label>

            <label>
              Study Mode
              <select>
                <option>Balanced</option>
                <option>Weak Topics First</option>
                <option>Mock Test Focus</option>
                <option>Revision Focus</option>
              </select>
            </label>
          </>
        )}
      </section>
    </div>
  );
}
