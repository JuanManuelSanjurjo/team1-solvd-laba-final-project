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

export const GeneratedFiltersSchema = z.object({
  brands: z.array(z.string()),
  categories: z.array(z.string()),
  colors: z.array(z.string()),
  sizes: z.array(z.number()),
  genders: z.array(z.string()),
  price_min: z.number(),
  price_max: z.number(),
  searchTerm: z.string().optional(),
  explain_short: z.string().optional(),
});

export type GeneratedFilters = z.infer<typeof GeneratedFiltersSchema>;
