import { getAssessments } from "@/server/interview";
import QuizList from "./_components/quiz-list";
import StatsCards from "./_components/stats-card";
import PerformanceChart from "./_components/performance-chart";

export default async function InterviewPrepPage() {
  const { data } = await getAssessments();

  const assessments = data!.map((assessment) => ({
    ...assessment,
    questions: assessment.questions as {
      question: string;
      isCorrect: boolean;
      userAnswer: string;
      answer: string;
      explanation: string;
    }[],
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
        <StatsCards assessment={assessments} />
        <PerformanceChart assessment={assessments} />
        <QuizList assessment={assessments} />
      </div>
    </div>
  );
}
