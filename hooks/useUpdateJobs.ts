import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Job, JobStatus } from '@/types';

interface UpdateStatusPayload {
    jobId: string;
    newStatus: JobStatus;
}

export const useUpdateJobStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        // 1. Fungsi yang berjalan ke server (Supabase)
        mutationFn: async ({ jobId, newStatus }: UpdateStatusPayload) => {
            const { data, error } = await supabase
                .from('jobs')
                .update({ status: newStatus })
                .eq('id', jobId)
                .select()
                .single();

            if (error) throw new Error(error.message);
            return data;
        },

        // 2. OPTIMISTIC UPDATE (Bagian Senior-nya di sini)
        // Dijalankan SEBELUM request ke server selesai.
        onMutate: async ({ jobId, newStatus }) => {
            // Batalkan query yang sedang berjalan agar tidak menimpa update kita
            await queryClient.cancelQueries({ queryKey: ['jobs'] });

            // Ambil snapshot data sebelumnya (untuk rollback jika error)
            const previousJobs = queryClient.getQueryData<Job[]>(['jobs']);

            // Update cache lokal secara manual
            queryClient.setQueryData<Job[]>(['jobs'], (old) => {
                if (!old) return [];
                return old.map((job) =>
                    job.id === jobId ? { ...job, status: newStatus } : job
                );
            });

            return { previousJobs };
        },

        // 3. Jika Error, kembalikan ke data sebelumnya
        onError: (err, newJob, context) => {
            if (context?.previousJobs) {
                queryClient.setQueryData(['jobs'], context.previousJobs);
            }
            alert("Gagal memindahkan kartu: " + err.message);
        },

        // 4. Selalu refresh data dari server setelah selesai (sukses/gagal) untuk sinkronisasi
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
};