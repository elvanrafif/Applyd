'use client';

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Job, JobStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, cn } from "@/lib/utils";
import { 
  CalendarIcon, 
  BanknoteIcon, 
  MapPinIcon, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Sparkles 
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { EditJobDialog } from "./EditJobDialog";
import { AIGeneratorDialog } from "./AIGeneratorDialog"; 
import { useDeleteJob } from "@/hooks/useDeleteJob";

interface JobCardProps {
  job: Job;
}

const STATUS_COLORS: Record<JobStatus, string> = {
  WISHLIST: "border-l-slate-400 dark:border-l-slate-600",
  APPLIED: "border-l-blue-500 dark:border-l-blue-600",
  INTERVIEWING: "border-l-amber-500 dark:border-l-amber-600",
  OFFER: "border-l-emerald-500 dark:border-l-emerald-600",
  REJECTED: "border-l-rose-500 dark:border-l-rose-600",
};

export function JobCard({ job }: JobCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false); 

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: job.id,
    data: { job },
  });

  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999,
  } : undefined;

  const borderClass = STATUS_COLORS[job.status] || "border-l-slate-200";

  return (
    <>
      <div 
        ref={setNodeRef} 
        style={style} 
        {...listeners} 
        {...attributes}
        className="touch-none mb-2 relative group/card"
      >
        <Card className={cn(
          "cursor-grab transition-all duration-200 border-l-[3px] shadow-sm hover:shadow-md active:cursor-grabbing bg-card hover:bg-accent/50",
          borderClass
        )}>
          <CardContent className="p-3 space-y-2 relative">
            
            {/* DROPDOWN MENU */}
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity z-10"
              onPointerDown={(e) => e.stopPropagation()} 
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => setIsAIOpen(true)}
                    className="text-purple-600 focus:text-purple-700 focus:bg-purple-50 dark:focus:bg-purple-900/20 font-medium"
                  >
                    <Sparkles className="mr-2 h-4 w-4" /> AI Assistant
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* CARD CONTENT */}
            
            {/* Position & Type */}
            <div className="flex justify-between items-start gap-6">
              <h4 className="text-sm font-bold text-foreground leading-tight line-clamp-2">
                {job.position}
              </h4>
              {job.job_type && (
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex-shrink-0 border border-border">
                  {job.job_type === 'Remote' ? 'Rem' : job.job_type}
                </span>
              )}
            </div>

            {/* Company */}
            <p className="text-xs font-semibold text-muted-foreground truncate pr-4">
              {job.company_name}
            </p>

            {/* Tags (PERBAIKAN: .slice(0,3) SUDAHDIHAPUS) */}
            <div className="flex flex-wrap gap-1">
              {(job.tags && job.tags.length > 0 ? job.tags : []).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-[9px] px-1.5 h-4 font-normal text-muted-foreground bg-muted border border-border"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-2 border-t border-dashed border-border mt-1">
              {job.salary && (
                <div className="flex items-center text-foreground font-medium">
                  <BanknoteIcon className="w-3 h-3 mr-1 text-muted-foreground" />
                  <span className="truncate max-w-[60px]">{job.salary}</span>
                </div>
              )}
              
              {job.salary && <span className="text-border">•</span>}

              <div className="flex items-center truncate max-w-[80px]">
                <MapPinIcon className="w-3 h-3 mr-1" />
                <span className="truncate">{job.location || "Location"}</span>
              </div>

              <div className="ml-auto flex items-center shrink-0">
                <CalendarIcon className="w-3 h-3 mr-1" />
                <span>{formatDate(job.created_at)}</span>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* MODALS */}
      {isEditOpen && (
        <EditJobDialog 
          job={job} 
          open={isEditOpen} 
          onOpenChange={setIsEditOpen} 
        />
      )}

      {isAIOpen && (
        <AIGeneratorDialog 
          job={job} 
          open={isAIOpen} 
          onOpenChange={setIsAIOpen} 
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your application for <strong>{job.company_name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteJob(job.id)}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-900 dark:hover:bg-red-800"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}