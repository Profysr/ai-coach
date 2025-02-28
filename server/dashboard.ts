"use server";

import { db } from "@/lib/prisma";
import { validateUser } from "./user";
import { geminiModel } from "@/data/modelKeys";

export async function generateAIInsights(industry: string | null) {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  const result = await geminiModel.generateContent(prompt);
  const text = result?.response?.text?.();
  const cleanedText = text.replace(/^```json|```$/g, "").trim();

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    return {
      success: false,
      message: `Failed to parse the generated JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function generateInsights() {
  const loggedUser = await validateUser();
  if (!loggedUser) {
    return {
      success: false,
      message: "Unauthorized or user not found in database",
    };
  }

  const loggedUserWithIndustry = await db.user.findUnique({
    where: {
      clerkUserId: loggedUser.id,
      email: loggedUser.emailAddresses[0].emailAddress,
    },
    include: {
      industryInsight: true,
    },
  });

  if (!loggedUserWithIndustry)
    return {
      success: false,
      message: "Failed to check user industry insights",
    };

  if (!loggedUserWithIndustry.industryInsight) {
    console.log("In the Dashboard Actions", loggedUserWithIndustry.industry);
    const insights = await generateAIInsights(loggedUserWithIndustry.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: loggedUserWithIndustry.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      success: true,
      message: "New Insights Generated Successfully",
      data: industryInsight,
    };
  }

  return {
    success: true,
    message: "Found Insights Successfully",
    data: loggedUserWithIndustry.industryInsight,
  };
}
