export const GenerateQuizPrompt = ({
  industry,
  skills,
}: {
  industry: string | null;
  skills: string[];
}) => {
  return `
    Generate 15 technical interview questions for a ${industry} professional${
    skills?.length ? ` with expertise in ${skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
        "questions": [
            {
                "question": "string",
                "options": ["string", "string", "string", "string"],
                "correctAnswer": "string",
                "explanation": "string"
            }
        ]
    }
`;
};

export const ImprovementPrompt = ({
  industry,
  wrongQuestionsText,
}: {
  industry: string | null;
  wrongQuestionsText: string;
}) => `
      The user got the following ${industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;
