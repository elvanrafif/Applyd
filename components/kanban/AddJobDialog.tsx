'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Sparkles, Loader2 } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; 
import { useAddJob } from "@/hooks/useAddJob";
import { JobStatus } from "@/types";
import { toast } from "sonner";

// Schema Validasi
const formSchema = z.object({
  company_name: z.string().min(2, "Company name is required"),
  position: z.string().min(2, "Position is required"),
  status: z.enum(['WISHLIST', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED'] as [string, ...string[]]),
  salary: z.string().optional(),
  location: z.string().optional(),
  job_type: z.enum(['Remote', 'Hybrid', 'On-site', '']).optional(),
  tags: z.string().optional(),
});

export function AddJobDialog() {
  const [open, setOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false); 
  const [pasteMode, setPasteMode] = useState(false); 
  const [rawJobDesc, setRawJobDesc] = useState("");  

  const { mutate, isPending } = useAddJob(() => setOpen(false));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "", position: "", status: "WISHLIST", salary: "",
      location: "", job_type: "", tags: "",
    },
  });

  // --- LOGIC: Toggle Mode & Reset Textarea ---
  // Ini menangani reset saat user klik tombol "Manual Input / Magic Paste"
  const togglePasteMode = () => {
    setPasteMode(!pasteMode);
    setRawJobDesc(""); // Reset textarea jadi 0 lagi
  };

  // --- LOGIC AI EXTRACT (Sesuai Logic Anda) ---
  const handleSmartExtract = async () => {
    if (!rawJobDesc) return;
    setIsParsing(true);

    try {
      // 1. Kirim Request
      const response = await fetch('/api/gemini', {
        method: 'POST',
        body: JSON.stringify({
          action: 'extract',
          prompt: rawJobDesc
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch AI");
      }

      // 2. Ambil text hasil AI
      let jsonStr = data.output;

      // 3. Bersihkan Markdown (Jaga-jaga jika AI masih bandel kasih ```json)
      jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

      // 4. Parse JSON
      const parsedData = JSON.parse(jsonStr);

      // 5. Isi Form
      form.setValue("company_name", parsedData.company_name || "");
      form.setValue("position", parsedData.position || "");
      form.setValue("location", parsedData.location || "");
      form.setValue("salary", parsedData.salary || "");
      
      if (['Remote', 'Hybrid', 'On-site'].includes(parsedData.job_type)) {
        form.setValue("job_type", parsedData.job_type);
      }
      
      if (parsedData.tags) {
        // Handle jika tags array atau string
        const tagsVal = Array.isArray(parsedData.tags) ? parsedData.tags.join(", ") : parsedData.tags;
        form.setValue("tags", tagsVal);
      }

      toast.success("Magic Paste Success!");
      
      // RESET STATE SETELAH SUKSES
      setPasteMode(false);
      setRawJobDesc(""); // Reset textarea jadi 0 lagi

    } catch (error: any) {
      console.error("Extract Error:", error);
      toast.error("Failed to parse", { description: "Try pasting a cleaner description." });
    } finally {
      setIsParsing(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const tagsArray = values.tags 
      ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    mutate({
      ...values,
      status: values.status as JobStatus,
      // @ts-ignore
      job_type: values.job_type === "" ? null : values.job_type,
      tags: tagsArray,
    });
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
          <Plus className="w-4 h-4 mr-2" />Add Job
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="pr-0 pt-4">
          <DialogTitle className="flex justify-between items-center">
            <span>Add New Application</span>
            
            <Button 
              variant={pasteMode ? "secondary" : "outline"}
              size="sm"
              onClick={togglePasteMode} // Panggil fungsi toggle yang sudah ada resetnya
              className="text-xs h-7 border-purple-200 hover:bg-purple-50 text-purple-700 ml-2"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {pasteMode ? "Manual Input" : "Magic Paste"}
            </Button>
          </DialogTitle>
        </DialogHeader>

        {pasteMode ? (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-purple-50 p-3 rounded-md text-xs text-purple-700 border border-purple-100">
              Paste the entire job description below. AI will fill the form for you.
            </div>
            <Textarea 
              placeholder="Paste Job Description here..." 
              className="h-48 resize-none text-xs"
              value={rawJobDesc}
              onChange={(e) => setRawJobDesc(e.target.value)}
            />
            <Button 
              onClick={handleSmartExtract} 
              disabled={isParsing || !rawJobDesc}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isParsing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Extracting...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Auto-Fill Form</>
              )}
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="company_name" render={({ field }) => (
                  <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="Google" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="position" render={({ field }) => (
                  <FormItem><FormLabel>Position</FormLabel><FormControl><Input placeholder="Frontend Dev" {...field} /></FormControl><FormMessage /></FormItem>
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
                      <FormControl><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger></FormControl>
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
                <FormItem>
                  <FormLabel>Tags (Comma separated)</FormLabel>
                  <FormControl><Input placeholder="React, TypeScript, Next.js" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Job"}</Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}