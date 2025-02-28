import { db } from "@/lib/prisma";
import { validateUser } from "./user";
import { revalidatePath } from "next/cache";
import { geminiModel } from "@/data/modelKeys";

export const saveResume = async (content) => {
  const loggedUser = await validateUser();

  if (!loggedUser)
    return {
      success: false,
      message: "User not logged in",
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
      message: "User not found in database",
    };

  try {
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return {
      success: true,
      message: "Resume saved successfully",
      data: resume,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error while saving resume ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
};

export const getResume = async () => {
  const loggedUser = await validateUser();

  if (!loggedUser)
    return {
      success: false,
      message: "User not logged in",
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
      message: "User not found in database",
    };

  try {
    const resume = await db.resume.findUnique({
      where: {
        userId: user.id,
      },
    });

    return {
      success: true,
      message: "Resume fetched successfully",
      data: resume,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error while getting resume ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
};

export const improveWithAi = async ({ current, type }) => {
  const loggedUser = await validateUser();

  if (!loggedUser)
    return {
      success: false,
      message: "User not logged in",
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
      message: "User not found in database",
    };

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text().trim();
    return {
      success: true,
      message: "AI improved the content successfully",
      data: text,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error while improving with AI ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
};
