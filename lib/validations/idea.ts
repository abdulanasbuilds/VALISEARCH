import { z } from "zod"
import { IDEA_MIN_LENGTH, IDEA_MAX_LENGTH } from "@/lib/constants"

export const ideaSchema = z.object({
  ideaText: z
    .string()
    .min(1, "Please describe your startup idea")
    .min(
      IDEA_MIN_LENGTH,
      `Your idea needs at least ${IDEA_MIN_LENGTH} characters to analyze`
    )
    .max(
      IDEA_MAX_LENGTH,
      `Please keep your idea under ${IDEA_MAX_LENGTH} characters`
    ),
  analysisType: z.enum(["quick", "full", "deep"]).default("full"),
})

export type IdeaInput = z.infer<typeof ideaSchema>
