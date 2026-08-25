import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

export default function ExamCountdown() {
  const [examDate, setExamDate] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    async function fetchExamDate() {
      try {
        const response = await fetch("http://localhost:8000/api/exam");

        if (!response.ok) {
          throw new Error("Failed to fetch exam date");
        }

        const data = await response.json();
        setExamDate(data.exam_date);
      } catch (error) {
        console.error("Could not load exam date:", error);
      }
    }

    fetchExamDate();
  }, []);

  useEffect(() => {
    if (!examDate) return;

    function calculateDays() {
      const today = new Date();
      const exam = new Date(examDate);
      const difference = exam.getTime() - today.getTime();

      setDaysLeft(
        Math.max(
          Math.ceil(difference / (1000 * 60 * 60 * 24)),
          0
        )
      );
    }

    calculateDays();

    const interval = setInterval(calculateDays, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [examDate]);

  return (
    <div className="exam-card">
      <div className="exam-icon">
        <Clock3 size={20} />
      </div>

      <div>
        <span>SSC JE exam countdown</span>
        <strong>
          {daysLeft === null ? "Loading..." : `${daysLeft} days`}
        </strong>
      </div>
    </div>
  );
}
