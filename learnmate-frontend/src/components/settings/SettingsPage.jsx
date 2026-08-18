import { ChevronRight } from "lucide-react";
import PageIntro from "../common/PageIntro";

export default function SettingsPage({ section }) {
  const title =
    section === "profile"
      ? "Profile Settings"
      : section === "security"
        ? "Account & Security"
        : "Preferences";

  return (
    <div className="page">
      <PageIntro title={title} subtitle="Manage your account and study experience." />

      <section className="card settings-card">
        {section === "profile" ? (
          <>
            <div className="profile-head">
              <div className="profile-avatar">AS</div>
              <button className="secondary-button">Change Photo</button>
            </div>
            <label>Full Name<input defaultValue="Arav Sharma" /></label>
            <label>Email<input defaultValue="arav.sharma@example.com" /></label>
            <label>Class / Year<input defaultValue="B.Tech / 3rd Year" /></label>
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
                {item}<ChevronRight size={17} />
              </button>
            ))}
          </>
        ) : (
          <>
            <label>
              Appearance
              <select><option>System</option><option>Light</option><option>Dark</option></select>
            </label>
            <label>
              Language
              <select><option>English</option><option>Hindi</option></select>
            </label>
            <label>
              Daily Study Goal
              <select><option>2 hours</option><option>3 hours</option><option>4 hours</option></select>
            </label>
            <label>
              Reminder to Study
              <select><option>Every day</option><option>Weekdays</option></select>
            </label>
          </>
        )}
      </section>
    </div>
  );
}
