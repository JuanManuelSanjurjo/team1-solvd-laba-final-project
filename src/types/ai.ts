import { z } from "zod";

export const GeneratedProductDescriptionSchema = z.object({
  name: z.string(),
  isBranded: z.boolean(),
  description: z.string().max(300),
  confidence: z.number().min(0).max(1),
});

export type GeneratedProductDescription = z.infer<
  typeof GeneratedProductDescriptionSchema
>;
