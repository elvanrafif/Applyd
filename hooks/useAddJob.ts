import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { NewJobInput } from '@/types';
import { toast } from "sonner"; // <--- Import langsung dari sonner

export const useAddJob = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newJob: NewJobInput) => {
            const { data, error } = await supabase
                .from('jobs')
                .insert(newJob)
                .select()
                .single();

            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: () => {
            // 1. Refresh data
            queryClient.invalidateQueries({ queryKey: ['jobs'] });

            // 2. Notifikasi "Rich" dengan Sonner
            toast.success("Job added successfully", {
                description: "Good luck with your application!",
            });

            // 3. Callback
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error) => {
            toast.error("Failed to add job", {
                description: error.message,
            });
        }
    });
};