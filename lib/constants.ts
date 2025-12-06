import { JobStatus } from "@/types";

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
    WISHLIST: "Wishlist",
    APPLIED: "Applied",
    INTERVIEWING: "Interviewing",
    OFFER: "Offer",
    REJECTED: "Rejected",
};

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
    WISHLIST: "border-l-slate-400 dark:border-l-slate-600",
    APPLIED: "border-l-blue-500 dark:border-l-blue-600",
    INTERVIEWING: "border-l-amber-500 dark:border-l-amber-600",
    OFFER: "border-l-emerald-500 dark:border-l-emerald-600",
    REJECTED: "border-l-rose-500 dark:border-l-rose-600",
};

export const JOB_TYPES = ["Remote", "Hybrid", "On-site"] as const;

export const DEFAULT_TAGS = ["React", "TypeScript", "Next.js"];