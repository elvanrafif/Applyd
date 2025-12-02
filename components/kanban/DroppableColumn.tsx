import { useDroppable } from "@dnd-kit/core";
import { JobStatus } from "@/types";

interface DroppableColumnProps {
  id: JobStatus;
  title: string;
  count: number;
  children: React.ReactNode;
}

export function DroppableColumn({ id, title, count, children }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id, // ID kolom = Status (WISHLIST, APPLIED, dll)
  });

  return (
    <div 
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 rounded-lg p-4 transition-colors duration-200 ${
        isOver ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-slate-50'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-700">{title}</h3>
        <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">
          {count}
        </span>
      </div>

      <div className="space-y-3 min-h-[100px]">
        {children}
      </div>
    </div>
  );
}