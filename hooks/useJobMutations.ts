import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Job } from "@/types";
import { toast } from "sonner";
import { JobFormValues } from "@/lib/schemas";

export const useJobMutations = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['jobs'] });

    const addJob = useMutation({
        mutationFn: async (values: JobFormValues) => {
            const tagsArray = values.tags?.split(',').map(t => t.trim()).filter(Boolean) || [];
            const payload = { ...values, job_type: values.job_type || null, tags: tagsArray };
            const { error } = await supabase.from('jobs').insert(payload);
            if (error) throw error;
        },
        onSuccess: () => {
            invalidate();
            toast.success("Job created successfully");
            onSuccess?.();
        },
        onError: (err: Error) => toast.error(err.message),
    });

    const editJob = useMutation({
        mutationFn: async ({ id, ...values }: JobFormValues & { id: string }) => {
            const tagsArray = values.tags?.split(',').map(t => t.trim()).filter(Boolean) || [];
            const payload = { ...values, job_type: values.job_type || null, tags: tagsArray };
            const { error } = await supabase.from('jobs').update(payload).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            invalidate();
            toast.success("Job updated successfully");
            onSuccess?.();
        },
        onError: (err: Error) => toast.error(err.message),
    });

    const deleteJob = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('jobs').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            invalidate();
            toast.success("Job deleted");
        },
        onError: (err: Error) => toast.error(err.message),
    });

    return { addJob, editJob, deleteJob };
};