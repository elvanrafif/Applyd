import * as z from "zod";

export const jobFormSchema = z.object({
    company_name: z.string().min(1, "Company name is required"),
    position: z.string().min(1, "Position is required"),
    status: z.enum(['WISHLIST', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED']),
    salary: z.string().optional(),
    location: z.string().optional(),
    job_type: z.enum(['Remote', 'Hybrid', 'On-site', '']).optional(),
    tags: z.string().optional(),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;