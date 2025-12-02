import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Job } from '@/types';
import { toast } from "sonner";

export const useEditJob = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedJob: Job) => {
            // Kita kirim seluruh object Job yang sudah diedit
            const { data, error } = await supabase
                .from('jobs')
                .update({
                    company_name: updatedJob.company_name,
                    position: updatedJob.position,
                    salary: updatedJob.salary,
                    location: updatedJob.location,
                    job_type: updatedJob.job_type,
                    tags: updatedJob.tags,
                    status: updatedJob.status, // Opsional jika ingin ganti status lewat edit form
                })
                .eq('id', updatedJob.id)
                .select()
                .single();

            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            toast.success("Job updated successfully");
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error) => {
            toast.error("Failed to update job", { description: error.message });
        }
    });
};