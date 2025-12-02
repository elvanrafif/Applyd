import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Job } from '@/types';

const fetchJobs = async (): Promise<Job[]> => {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data as Job[];
};

export const useJobs = () => {
    return useQuery({
        queryKey: ['jobs'], // Key unik untuk cache
        queryFn: fetchJobs,
    });
};