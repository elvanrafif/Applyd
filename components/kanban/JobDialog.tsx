'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { JobFormValues, jobFormSchema } from "@/lib/schemas";
import { JOB_STATUS_LABELS, JOB_TYPES } from "@/lib/constants";
import { useJobMutations } from "@/hooks/useJobMutations";
import { useAIParser } from "@/hooks/useAIParser";
import { Job } from "@/types";

interface JobDialogProps {
  job?: Job;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function JobDialog({ job, open: controlledOpen, onOpenChange: setControlledOpen, trigger }: JobDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [pasteMode, setPasteMode] = useState(false);
  const [rawText, setRawText] = useState("");

  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;
  const isEditMode = !!job;

  const { addJob, editJob } = useJobMutations(() => setOpen(false));
  
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      company_name: "", position: "", status: "WISHLIST", salary: "",
      location: "", job_type: "", tags: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (job) {
        form.reset({
          company_name: job.company_name,
          position: job.position,
          status: job.status,
          salary: job.salary || "",
          location: job.location || "",
          job_type: (job.job_type as any) || "",
          tags: job.tags?.join(", ") || "",
        });
      } else {
        form.reset({
          company_name: "", position: "", status: "WISHLIST", salary: "",
          location: "", job_type: "", tags: "",
        });
      }
      setPasteMode(false);
      setRawText("");
    }
  }, [isOpen, job, form]);

  const { isParsing, parse } = useAIParser(form);

  const onSubmit = (values: JobFormValues) => {
    if (isEditMode && job) {
      editJob.mutate({ ...values, id: job.id });
    } else {
      addJob.mutate(values);
    }
  };

  const togglePasteMode = () => {
    setPasteMode(!pasteMode);
    setRawText("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="pt-8">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">
              {isEditMode ? "Edit Application" : "New Application"}
            </DialogTitle>
            
            {!isEditMode && (
              <Button 
                variant={pasteMode ? "secondary" : "outline"} 
                size="sm" 
                onClick={togglePasteMode} 
                className="text-xs h-7 text-purple-700 hover:bg-purple-50 border-purple-200 ml-4 shrink-0"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {pasteMode ? "Manual Input" : "Magic Paste"}
              </Button>
            )}
          </div>
        </DialogHeader>

        {pasteMode ? (
          <div className="space-y-4 animate-in fade-in zoom-in-95 mt-2">
            <div className="bg-purple-50 p-3 rounded text-xs text-purple-700 border border-purple-100">
              Paste job description below to auto-fill.
            </div>
            <Textarea 
              className="h-48 resize-none text-xs" 
              placeholder="Paste here..." 
              value={rawText} 
              onChange={(e) => setRawText(e.target.value)} 
            />
            <Button 
              onClick={() => parse(rawText, () => { setPasteMode(false); setRawText(""); })}
              disabled={isParsing || !rawText} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Auto-Fill Form"}
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="company_name" render={({ field }) => (
                  <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="position" render={({ field }) => (
                  <FormItem><FormLabel>Position</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem><FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {Object.entries(JOB_STATUS_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="job_type" render={({ field }) => (
                  <FormItem><FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {JOB_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="salary" render={({ field }) => (
                  <FormItem><FormLabel>Salary</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem><FormLabel>Tags</FormLabel><FormControl><Input placeholder="React, TS" {...field} /></FormControl></FormItem>
              )} />

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={addJob.isPending || editJob.isPending}>
                  {addJob.isPending || editJob.isPending ? "Saving..." : isEditMode ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}