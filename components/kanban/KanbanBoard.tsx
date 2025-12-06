'use client';

import { 
  DndContext, 
  DragEndEvent, 
  useSensor, 
  useSensors, 
  PointerSensor 
} from "@dnd-kit/core";
import { useJobs } from "@/hooks/useJobs";
import { JobStatus, Job } from "@/types";
import { JobCard } from "./JobCard";
import { DroppableColumn } from "./DroppableColumn";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateJobStatus } from "@/hooks/useUpdateJobs";

interface KanbanBoardProps {
  searchQuery: string;
  filterType: string;
}

const COLUMNS: { id: JobStatus; title: string }[] = [
  { id: 'WISHLIST', title: 'Wishlist' },
  { id: 'APPLIED', title: 'Applied' },
  { id: 'INTERVIEWING', title: 'Interviewing' },
  { id: 'OFFER', title: 'Offer' },
  { id: 'REJECTED', title: 'Rejected' },
];

export function KanbanBoard({ searchQuery, filterType }: KanbanBoardProps) {
  const { data: jobs, isLoading } = useJobs();
  const { mutate: updateStatus } = useUpdateJobStatus();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const filteredJobs = jobs?.filter((job) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      job.company_name.toLowerCase().includes(query) || 
      job.position.toLowerCase().includes(query) ||
      job.tags?.some(tag => tag.toLowerCase().includes(query));

    const matchesType = 
      filterType === "ALL" || 
      job.job_type === filterType;

    return matchesSearch && matchesType;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const jobId = active.id as string;
    const newStatus = over.id as JobStatus;

    const job = jobs?.find((j) => j.id === jobId);

    if (job && job.status !== newStatus) {
      updateStatus({ jobId, newStatus });
    }
  };

  if (isLoading) return <BoardSkeleton />;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto p-4 pb-10 items-start">
        {COLUMNS.map((col) => {
          const columnJobs = filteredJobs?.filter((job) => job.status === col.id) || [];
          
          return (
            <DroppableColumn 
              key={col.id} 
              id={col.id} 
              title={col.title} 
              count={columnJobs.length}
            >
              {columnJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              
              {columnJobs.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-lg">
                  <p className="text-xs text-slate-400">
                    {searchQuery ? "No matches" : "Empty"}
                  </p>
                </div>
              )}
            </DroppableColumn>
          );
        })}
      </div>
    </DndContext>
  );
}

function BoardSkeleton() {
  return (
    <div className="flex gap-4 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-80 bg-slate-50 rounded-lg p-4 space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      ))}
    </div>
  );
}