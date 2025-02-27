"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";
import { OnSubmitValues } from "@/app/(main)/onboarding/_components/onboarding-form";

export const validateUser = async () => {
  const user = await currentUser();
  console.log("Validating User");

  if (!user) return null;

  const loggedUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return loggedUser ? user : null;
};

// Server functions
export const UpdateUser = async (data: OnSubmitValues) => {
  const loggedUser = await validateUser();
  if (!loggedUser) {
    return {
      success: false,
      message: "Unauthorized or user not found in Database",
      data: undefined,
    };
  }

  try {
    const result = await db.$transaction(
      async (tx) => {
        // Find the industry if it exists
        let industryInsight = await tx.industryInsight.findUnique({
          where: { industry: data.industry },
        });

        console.log("Industry present?", industryInsight?.industry);
        // create a new industry if no industry found
        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry);

          industryInsight = await tx.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
          console.log("New Industry created", industryInsight.industry);
        }

        // Update user
        const newUser = await tx.user.update({
          where: {
            clerkUserId: loggedUser.id,
            email: loggedUser.emailAddresses[0].emailAddress,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        console.log("User has been updated", newUser.email);

        return { newUser, industryInsight };
      },
      {
        timeout: 15000,
      }
    );

    console.log("Transaction success:", result.newUser.industry);
    return {
      success: true,
      message: "User updated successfully",
      data: result.newUser,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to update user: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
};

export const getOnBoardingStatus = async () => {
  const loggedUser = await validateUser();

  if (!loggedUser) {
    return {
      success: false,
      message: "Unauthorized or user not found in database",
      isOnBoarded: false,
    };
  }

  try {
    const loggedUserWithIndustry = await db.user.findUnique({
      where: {
        clerkUserId: loggedUser.id,
        email: loggedUser.emailAddresses[0].emailAddress,
      },
      select: {
        industry: true,
      },
    });

    return {
      success: true,
      message: "Onboarding status retrieved successfully",
      isOnBoarded: !!loggedUserWithIndustry?.industry, // Converts `null` or `undefined` to `false`
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to check onboarding status: ${
        error instanceof Error ? error.message : String(error)
      }`,
      isOnBoarded: false,
    };
  }
};
