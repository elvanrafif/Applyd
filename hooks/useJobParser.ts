import { useState } from "react";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { JobFormValues } from "@/lib/schemas";

export const useJobParser = (form: UseFormReturn<JobFormValues>) => {
    const [isParsing, setIsParsing] = useState(false);

    const parseJobDescription = async (text: string, onSuccess?: () => void) => {
        if (!text) return;
        setIsParsing(true);

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                body: JSON.stringify({ action: 'extract', prompt: text })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "AI Error");

            let jsonStr = data.output.trim();
            if (jsonStr.startsWith('```json')) {
                jsonStr = jsonStr.replace(/```json|```/g, '');
            }

            const parsedData = JSON.parse(jsonStr);

            form.setValue("company_name", parsedData.company_name || "");
            form.setValue("position", parsedData.position || "");
            form.setValue("location", parsedData.location || "");
            form.setValue("salary", parsedData.salary || "");

            if (['Remote', 'Hybrid', 'On-site'].includes(parsedData.job_type)) {
                form.setValue("job_type", parsedData.job_type as any);
            }

            if (parsedData.tags) {
                const tagsVal = Array.isArray(parsedData.tags) ? parsedData.tags.join(", ") : parsedData.tags;
                form.setValue("tags", tagsVal);
            }

            toast.success("Magic Paste Success!");
            if (onSuccess) onSuccess();

        } catch (error) {
            console.error(error);
            toast.error("Failed to parse", { description: "Try manual input" });
        } finally {
            setIsParsing(false);
        }
    };

    return { isParsing, parseJobDescription };
};