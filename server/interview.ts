"use server";

import { db } from "@/lib/prisma";
import { validateUser } from "./user";
import { GenerateQuizPrompt, ImprovementPrompt } from "../data/prompts";
import { geminiModel } from "@/data/modelKeys";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Quiz {
  questions: QuizQuestion[];
}

export const generateQuiz = async (): Promise<{
  success: boolean;
  message: string;
  data?: QuizQuestion[];
}> => {
  const loggedUser = await validateUser();

  if (!loggedUser)
    return {
      success: false,
      message: "Unauthenticated User",
    };

  const user = await db.user.findUnique({
    where: {
      clerkUserId: loggedUser.id,
      email: loggedUser.emailAddresses[0].emailAddress,
    },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user)
    return {
      success: false,
      message: "User not found in database",
    };

  const prompt = GenerateQuizPrompt({
    industry: user.industry,
    skills: user.skills,
  });

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz: Quiz = JSON.parse(cleanedText);
    return {
      success: true,
      message: "Quiz Generated Successfully",
      data: quiz?.questions,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to generate quiz: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
};

interface QuizResult {
  question: string;
  answer: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export const saveQuizResults = async (
  questions: QuizQuestion[],
  answers: string[],
  score: number
) => {
  const loggedUser = await validateUser();

  if (!loggedUser) {
    return {
      success: false,
      message: "Unauthenticated User",
    };
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: loggedUser.id,
      email: loggedUser.emailAddresses[0].emailAddress,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "User is not found in the database",
    };
  }

  const quizResults: QuizResult[] = questions.map(
    (q: QuizQuestion, idx: number) => ({
      question: q.question,
      answer: q.correctAnswer,
      userAnswer: answers[idx],
      isCorrect: q.correctAnswer === answers[idx],
      explanation: q.explanation,
    })
  );

  const wrongAnswers = quizResults.filter((q) => !q.isCorrect);
  let improvementTip: string | null = null;

  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = ImprovementPrompt({
      industry: user?.industry,
      wrongQuestionsText,
    });

    try {
      const result = await geminiModel.generateContent(improvementPrompt);
      improvementTip = result.response.text().trim();
    } catch (error) {
      return {
        success: false,
        message: `Failed to generate improvement tip: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: quizResults.map((result) => ({
          question: result.question,
          answer: result.answer,
          userAnswer: result.userAnswer,
          isCorrect: result.isCorrect,
          explanation: result.explanation,
        })),
        category: "Technical",
        improvementTip,
      },
    });

    return {
      success: true,
      message: "Assessment saved successfully",
      data: assessment,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to save assessment: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
};

export async function getAssessments() {
  const loggedUser = await validateUser();
  if (!loggedUser)
    return {
      success: false,
      message: "User is not authenticated",
    };

  const user = await db.user.findUnique({
    where: {
      clerkUserId: loggedUser.id,
      email: loggedUser.emailAddresses[0].emailAddress,
    },
  });

  if (!user)
    return {
      success: false,
      message: "User is not found in the database",
    };

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      success: true,
      message: "Fetched Assessments Successfully",
      data: assessments,
    };
  } catch (error) {
    return {
      success: false,
      message: `unable to fetch assessments: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
