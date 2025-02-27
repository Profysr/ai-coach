// industry
// subIndustry
// Bio
// experience
// skills

import { z } from "zod";

export const onBoardingSchema = z.object({
  industry: z.string({
    required_error: "Please select an industry",
  }),
  subIndustry: z.string({
    required_error: "Please select a specialization",
  }),
  bio: z.string().max(500).optional(),
  experience: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), {
      message: "Experience must be a number",
    })
    .pipe(
      z
        .number()
        .min(0, "Experience must be zero")
        .max(50, "Experience should never be more than 50 years")
    ),
  skills: z
    .string({
      required_error: "One skill must be required",
    })
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : undefined
    ),
});
