"use server";

import { db } from "@/lib/prisma";
import { validateUser } from "./user";
import { geminiModel } from "@/data/modelKeys";

interface DataProp {
  jobDescription: string;
  companyName: string;
  jobTitle: string;
}
export async function generateCoverLetter(data: DataProp) {
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
    Write a professional cover letter for a ${data.jobTitle} position at ${
    data.companyName
  }.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

  try {
    const result = await geminiModel.generateContent(prompt);
    const content = result.response.text().trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return {
      success: true,
      message: "Cover Letter Generated Successfully",
      coverLetter,
    };
  } catch (error) {
    return {
      success: true,
      message: `Failed to generate cover letter: ${
        error instanceof Error ? error.message : error
      }`,
    };
  }
}

export async function getCoverLetters() {
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

  const coverLetters = await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return {
    success: true,
    message: "Cover Letters Fetched Successfully",
    coverLetters,
  };
}

export async function getCoverLetter(id: string) {
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

  const coverLetter = await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
  return {
    success: true,
    message: `Cover Letter for ${id} Fetched Successfully`,
    coverLetter,
  };
}

export async function deleteCoverLetter(id: string) {
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

  const coverLetter = await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });

  return {
    success: true,
    message: "Cover Letter Deleted Successfully",
    coverLetter,
  };
}
