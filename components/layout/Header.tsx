'use client';

import { Briefcase, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobDialog } from "@/components/kanban/JobDialog"; // Gunakan Component Baru
import { JobFilter } from "@/components/kanban/JobFilter";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filterType: string;
  setFilterType: (v: string) => void;
  onStatsClick: () => void;
}

export function Header({ searchQuery, setSearchQuery, filterType, setFilterType, onStatsClick }: HeaderProps) {
  return (
    <header className="border-b border-border px-4 sm:px-6 py-3 bg-background/95 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-4 lg:gap-6 flex-1">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background shadow-sm">
              <Briefcase className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-foreground tracking-tight hidden sm:block">Applyd.</h1>
          </div>
          
          <div className="hidden md:block h-6 w-px bg-border shrink-0"></div>
          
          <div className="hidden md:block max-w-md w-full">
            <JobFilter 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              filterType={filterType} 
              setFilterType={setFilterType} 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 border-border text-muted-foreground hover:text-foreground" 
            onClick={onStatsClick}
          >
            <BarChart3 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Stats</span>
          </Button>
          
          <JobDialog 
            trigger={
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                <Plus className="w-4 h-4 mr-2" />Add Job
              </Button>
            } 
          />
        </div>
      </div>
    </header>
  );
}