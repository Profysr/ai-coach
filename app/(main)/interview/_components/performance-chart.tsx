"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Question {
  question: string;
  answer: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
}
interface Assessment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  quizScore: number;
  questions: Question[];
  category: string;
  improvementTip: string | null;
}

export default function PerformanceChart({
  assessment,
}: {
  assessment: Assessment[] | undefined;
}) {
  const [chartData, setChartData] = useState<{ date: string; score: number }[]>(
    []
  );

  useEffect(() => {
    if (assessment!) {
      const formattedData = assessment.map((curr) => ({
        date: format(new Date(curr.createdAt), "MMM dd"),
        score: curr.quizScore,
      }));
      setChartData(formattedData);
    }
  }, [assessment]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-title text-3xl md:text-4xl">
          Performance Trend
        </CardTitle>
        <CardDescription>Your quiz scores over time</CardDescription>
      </CardHeader>
      <CardContent className="p-2 w-full md:p-4 lg:p-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} tickMargin={10} />
              <YAxis domain={[0, 100]} fontSize={10} tickMargin={10} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-md">
                        <p className="text-sm font-medium">
                          Score: {payload[0].value}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payload[0].payload.date}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
