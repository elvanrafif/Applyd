export type JobStatus = 'WISHLIST' | 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED';

export interface Job {
    id: string;
    created_at: string;
    company_name: string;
    position: string;
    status: JobStatus;
    salary?: string | null;
    url?: string | null;
    notes?: string | null;
    // Field baru
    location?: string | null;
    job_type?: 'Remote' | 'Hybrid' | 'On-site' | null;
    tags?: string[] | null;
}


export type NewJobInput = Omit<Job, 'id' | 'created_at'>;