'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditJob } from "@/hooks/useEditJob";
import { Job, JobStatus } from "@/types";

// Schema sama persis dengan Add
const formSchema = z.object({
  company_name: z.string().min(2, "Required"),
  position: z.string().min(2, "Required"),
  status: z.enum(['WISHLIST', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED'] as [string, ...string[]]),
  salary: z.string().optional(),
  location: z.string().optional(),
  job_type: z.enum(['Remote', 'Hybrid', 'On-site', '']).optional(),
  tags: z.string().optional(),
});

interface EditJobDialogProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditJobDialog({ job, open, onOpenChange }: EditJobDialogProps) {
  const { mutate, isPending } = useEditJob(() => onOpenChange(false));

  // Mengubah Array ["React", "TS"] menjadi String "React, TS" untuk ditampilkan di input
  const defaultTags = job.tags ? job.tags.join(', ') : '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: job.company_name,
      position: job.position,
      status: job.status,
      salary: job.salary || "",
      location: job.location || "",
      job_type: job.job_type || "",
      tags: defaultTags,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const tagsArray = values.tags 
      ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    mutate({
      ...job, // Copy ID dan created_at dari job lama
      ...values, // Timpa dengan value baru
      status: values.status as JobStatus,
      // @ts-ignore
      job_type: values.job_type === "" ? null : values.job_type,
      tags: tagsArray,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>Edit Job Details</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* COPY PASTE FIELD DARI AddJobDialog DI SINI */}
            {/* Saya singkat agar muat, isinya sama persis dengan AddJobDialog */}
             <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="company_name" render={({ field }) => (
                <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="position" render={({ field }) => (
                <FormItem><FormLabel>Position</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="WISHLIST">Wishlist</SelectItem>
                      <SelectItem value="APPLIED">Applied</SelectItem>
                      <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
                      <SelectItem value="OFFER">Offer</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
              <FormField control={form.control} name="job_type" render={({ field }) => (
                <FormItem><FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="On-site">On-site</SelectItem>
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
              <FormItem><FormLabel>Tags</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isPending}>{isPending ? "Updating..." : "Update Job"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}