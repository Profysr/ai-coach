import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(geminiApiKey);
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});
