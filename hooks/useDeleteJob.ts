import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

export const useDeleteJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (jobId: string) => {
            const { error } = await supabase
                .from('jobs')
                .delete()
                .eq('id', jobId);

            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            toast.success("Job deleted", {
                description: "The application has been removed from your board.",
            });
        },
        onError: (error) => {
            toast.error("Failed to delete", { description: error.message });
        }
    });
};