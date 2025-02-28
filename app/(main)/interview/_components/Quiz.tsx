"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarLoader } from "react-spinners";
import { useFetch } from "@/hooks/useFetch";
import { generateQuiz, saveQuizResults } from "@/server/interview";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import QuizResult from "./QuizResult";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const {
    loading: loadingQuiz,
    fetchData: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: saveLoading,
    fetchData: saveQuizResultsFn,
    data: resultData,
    setState: setResultData,
  } = useFetch(saveQuizResults);

  useEffect(() => {
    if (quizData?.success) {
      setAnswers(new Array(quizData?.data?.length).fill(""));
    }
  }, [quizData]);

  const handleChange = (answer: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answer;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (quizData?.data && currentQuestion < quizData.data.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;

    answers.forEach((answer, index) => {
      if (quizData?.data && answer === quizData?.data[index].correctAnswer) {
        correct++;
      }
    });

    return (correct / quizData!.data!.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultsFn(quizData!.data!, answers, score);
      toast.success("Quiz results saved successfully.");
    } catch (err) {
      console.warn("Getting err while finishing quiz", err);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    setResultData({ data: null, error: null, loading: false });

    // Rerun the quiz function to generate a new quiz
    generateQuizFn();
  };
  // Loading Quiz
  if (loadingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  // Show results if quiz is completed
  if (resultData) {
    console.log("Result Data on the Quiz Component", resultData);

    const strictResult = {
      ...resultData.data!,
      questions: resultData.data!.questions as {
        question: string;
        isCorrect: boolean;
        userAnswer: string;
        answer: string;
        explanation: string;
      }[],
    };
    return (
      <div className="mx-2">
        <QuizResult result={strictResult} onStartNew={startNewQuiz} />
      </div>
    );
  }

  // if data is not fetched
  if (!quizData?.data) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 15 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={generateQuizFn} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const qst = quizData.data[currentQuestion];
  // if quizdata is fetched
  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.data.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-md font-medium">{qst.question}</p>

        <RadioGroup
          onValueChange={handleChange}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {qst.options.map((option, index) => (
            <div className="flex items-center space-x-2" key={index}>
              <Label
                htmlFor={`option-${index}`}
                className="flex gap-2 items-center cursor-pointer"
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{qst.explanation}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
          >
            Show Explanation
          </Button>
        )}
        <Button
          onClick={handleNext}
          className="ml-4"
          disabled={!answers[currentQuestion] || saveLoading}
        >
          {saveLoading && (
            <Loader2 className="animate-spin" width={20} height={20} />
          )}
          {currentQuestion < quizData.data.length - 1 ? "Next" : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}
