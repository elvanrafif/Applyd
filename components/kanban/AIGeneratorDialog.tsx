'use client';

// Ganti useCompletion (Vercel) dengan fetch biasa agar lebih mudah kontrol body ke Gemini
// ATAU gunakan useCompletion tapi sesuaikan endpoint.
// Cara paling mudah dengan setup API route kita tadi adalah manual fetch streaming.

import { useState } from 'react';
import { Copy, Sparkles, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Job } from '@/types';
import { toast } from "sonner";

interface AIGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
}

export function AIGeneratorDialog({ open, onOpenChange, job }: AIGeneratorDialogProps) {
  const [messageType, setMessageType] = useState('linkedin');
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setCompletion(""); // Reset text

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        body: JSON.stringify({
          action: 'message',
          prompt: {
            type: messageType,
            company: job.company_name,
            position: job.position,
            tags: job.tags ? job.tags.join(', ') : 'Tech Enthusiast'
          }
        })
      });

      if (!response.ok) throw new Error("AI Error");

      // Handle Streaming Response manual agar smooth
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setCompletion((prev) => prev + chunk);
      }

    } catch (error) {
      toast.error("Failed to generate message");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(completion);
    toast.success("Copied to clipboard!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Bot className="w-5 h-5" />
            Gemini Assistant
          </DialogTitle>
          <DialogDescription>
            Draft a {messageType} message for <strong>{job.company_name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex gap-2">
            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linkedin">LinkedIn Connection</SelectItem>
                <SelectItem value="cover_letter">Cover Letter Intro</SelectItem>
                <SelectItem value="email">Cold Email</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleGenerate} 
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white min-w-[100px]"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>

          <div className="relative">
            <Textarea 
              value={completion} 
              readOnly 
              placeholder="Result will appear here..."
              className="h-48 resize-none bg-muted font-mono text-xs sm:text-sm leading-relaxed p-4 border-border focus-visible:ring-purple-500"
            />
            
            {completion && !isLoading && (
              <Button 
                size="sm" variant="secondary" className="absolute bottom-2 right-2 shadow-sm h-8 gap-1 text-xs"
                onClick={copyToClipboard}
              >
                <Copy className="w-3 h-3" /> Copy
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}