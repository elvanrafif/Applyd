'use client';

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Import cn untuk merging class

interface JobFilterProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  className?: string; // Tambahkan prop className
}

export function JobFilter({ 
  searchQuery, 
  setSearchQuery, 
  filterType, 
  setFilterType,
  className
}: JobFilterProps) {
  
  const handleReset = () => {
    setSearchQuery("");
    setFilterType("ALL");
  };

  const isFiltered = searchQuery !== "" || filterType !== "ALL";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* 1. Search Bar - Flex Grow agar memenuhi ruang */}
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors w-full"
        />
      </div>

      {/* 2. Filter Dropdown (Job Type) - Ukuran tetap */}
      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-[110px] sm:w-[130px] h-9 bg-slate-50 border-slate-200 text-xs sm:text-sm">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All</SelectItem>
          <SelectItem value="Remote">Remote</SelectItem>
          <SelectItem value="Hybrid">Hybrid</SelectItem>
          <SelectItem value="On-site">On-site</SelectItem>
        </SelectContent>
      </Select>

      {/* 3. Reset Button */}
      {isFiltered && (
        <Button 
          variant="ghost" 
          size="icon" // Ubah jadi icon only biar hemat tempat
          onClick={handleReset}
          className="h-9 w-9 text-slate-500 hover:text-slate-700 shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}