'use client';

import { useState } from "react";
import { Briefcase, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { AddJobDialog } from "@/components/kanban/AddJobDialog";
import { JobFilter } from "@/components/kanban/JobFilter";
import { AnalyticsDialog } from "@/components/kanban/AnalyticsDialog";
import { useJobs } from "@/hooks/useJobs";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const { data: jobs } = useJobs();

  return (
    <main className="h-screen flex flex-col bg-white">
      
      {/* === HEADER UTAMA === */}
      <header className="border-b px-4 sm:px-6 py-3 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          
          {/* BAGIAN KIRI: LOGO + DESKTOP FILTER */}
          <div className="flex items-center gap-4 lg:gap-6 flex-1">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
                <Briefcase className="w-4 h-4" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight hidden sm:block">
                Applyd.
              </h1>
            </div>

            {/* Separator Desktop */}
            <div className="hidden md:block h-6 w-px bg-slate-200 shrink-0"></div>

            {/* Filter Desktop (Hidden on Mobile) */}
            <div className="hidden md:block max-w-md w-full">
              <JobFilter 
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                filterType={filterType} setFilterType={setFilterType}
              />
            </div>
          </div>
          
          {/* BAGIAN KANAN: ACTION BUTTONS */}
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {/* Stats Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9" // Samakan tinggi dengan input
              onClick={() => setIsAnalyticsOpen(true)}
            >
              <BarChart3 className="w-4 h-4 sm:mr-2 text-slate-500" />
              <span className="hidden sm:inline">Stats</span>
            </Button>

            {/* Add Job Button (Inside Component) */}
            <AddJobDialog />
          </div>
        </div>
      </header>
      
      {/* === MOBILE FILTER SECTION (Baris Kedua) === */}
      {/* Hanya muncul di layar kecil (md:hidden) */}
      <div className="md:hidden px-4 py-3 border-b bg-slate-50">
         <JobFilter 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            filterType={filterType} setFilterType={setFilterType}
            className="w-full"
          />
      </div>

      {/* === KANBAN BOARD AREA === */}
      <div className="flex-1 overflow-hidden bg-slate-50/50">
        <KanbanBoard searchQuery={searchQuery} filterType={filterType} />
      </div>

      {/* Analytics Modal */}
      {jobs && (
        <AnalyticsDialog 
          open={isAnalyticsOpen} 
          onOpenChange={setIsAnalyticsOpen} 
          jobs={jobs} 
        />
      )}
    </main>
  );
}