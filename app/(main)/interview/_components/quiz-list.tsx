"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./QuizResult";

// import QuizResult from "./QuizResult";

interface Question {
  answer: string;
  question: string;
  isCorrect: boolean;
  userAnswer: string;
  explanation: string;
}

interface Assessment {
  id: string;
  userId: string;
  quizScore: number;
  questions: Question[];
  category: string;
  improvementTip: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function QuizList({ assessment }: { assessment: Assessment[] }) {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState<Assessment | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-title text-3xl md:text-4xl">
                Recent Quizzes
              </CardTitle>
              <CardDescription>
                Review your past quiz performance
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/interview/mock")}>
              Start New Quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessment?.map((curr, i: number) => (
              <Card
                key={curr.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedQuiz(curr)}
              >
                <CardHeader>
                  <CardTitle className="gradient-title text-2xl">
                    Quiz {i + 1}
                  </CardTitle>
                  <CardDescription className="flex justify-between w-full">
                    <div>Score: {curr.quizScore.toFixed(1)}%</div>
                    <div>
                      {format(new Date(curr.createdAt), "MMMM dd, yyyy HH:mm")}
                    </div>
                  </CardDescription>
                </CardHeader>
                {curr.improvementTip && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {curr.improvementTip}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog Box  */}
      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-3xl h-[90vh] overflow-y-auto mx-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <QuizResult
            result={selectedQuiz!}
            hideStartNew
            onStartNew={() => router.push("/interview/mock")}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
