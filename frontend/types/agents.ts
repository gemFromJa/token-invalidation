import z from "zod";

export const schema = z.object({
  id: z.number(),
  average_ratings: z.number(),
  calls: z.number(),
  email: z.email(),
  first_name: z.string(),

  last_name: z.string(),
});

export type Agent = z.infer<typeof schema>;
