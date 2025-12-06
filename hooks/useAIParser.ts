import { useState } from "react";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { JobFormValues } from "@/lib/schemas";

export const useAIParser = (form: UseFormReturn<JobFormValues>) => {
    const [isParsing, setIsParsing] = useState(false);

    const parse = async (text: string, callback?: () => void) => {
        if (!text) return;
        setIsParsing(true);
        try {
            const res = await fetch('/api/gemini', {
                method: 'POST',
                body: JSON.stringify({ action: 'extract', prompt: text })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            let cleanJson = data.output.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanJson);

            form.setValue("company_name", parsed.company_name || "");
            form.setValue("position", parsed.position || "");
            form.setValue("location", parsed.location || "");
            form.setValue("salary", parsed.salary || "");

            if (['Remote', 'Hybrid', 'On-site'].includes(parsed.job_type)) {
                form.setValue("job_type", parsed.job_type);
            }

            if (parsed.tags) {
                form.setValue("tags", Array.isArray(parsed.tags) ? parsed.tags.join(", ") : parsed.tags);
            }

            toast.success("Magic Paste applied");
            callback?.();
        } catch (e) {
            toast.error("Failed to parse job description");
        } finally {
            setIsParsing(false);
        }
    };

    return { isParsing, parse };
};