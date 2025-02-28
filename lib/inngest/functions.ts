import { geminiModel } from "@/data/modelKeys";
import { db } from "../prisma";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const generateAutomaticInsights = inngest.createFunction(
  { id: "generate-industry-insights", name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // Run every Sunday at midnight
  async ({ step }) => {
    const industries = await step.run("Fetch Industries", async () => {
      return await db.industryInsight.findMany({
        select: {
          industry: true,
        },
      });
    });
    // [{ industry: "tech-software-development" }];
    for (const { industry } of industries) {
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

      const result = await step.ai.wrap(
        "gemini",
        async (p: string) => {
          return await geminiModel.generateContent(p);
        },
        prompt
      );

      // const text =
      //   res?.response?.candidates && res?.response?.candidates?.length > 0
      //     ? res.response
      //     : "";

      const text =
        result!.response!.candidates!.length > 0
          ? result!.response!.candidates![0].content!.parts![0].text!
          : "";

      const withoutText =
        result!.response!.candidates!.length > 0
          ? result!.response!.candidates![0].content!.parts![0]
          : "";

      console.log("Inngest Function Output", withoutText);

      const cleanedText = text.replace(/^```json|```$/g, "").trim();
      const insights = await JSON.parse(cleanedText);

      console.log("Insights", insights);

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);
