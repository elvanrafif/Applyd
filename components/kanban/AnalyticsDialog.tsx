'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Job, JobStatus } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Briefcase, Trophy, XCircle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobs: Job[];
}

const COLORS = {
  WISHLIST: '#94a3b8',
  APPLIED: '#3b82f6',
  INTERVIEWING: '#f59e0b',
  OFFER: '#10b981',
  REJECTED: '#f43f5e',
};

export function AnalyticsDialog({ open, onOpenChange, jobs }: AnalyticsDialogProps) {
  
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<JobStatus, number>);

  const pieData = Object.keys(COLORS).map((key) => ({
    name: key.charAt(0) + key.slice(1).toLowerCase(),
    value: statusCounts[key as JobStatus] || 0,
    color: COLORS[key as JobStatus],
  })).filter(item => item.value > 0);

  const totalJobs = jobs.length;
  const activeProcess = (statusCounts.APPLIED || 0) + (statusCounts.INTERVIEWING || 0);
  const successRate = totalJobs > 0 
    ? Math.round(((statusCounts.OFFER || 0) / totalJobs) * 100) 
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[700px] max-h-[85vh] overflow-y-auto p-0 gap-0 overflow-hidden rounded-xl">
        
        <div className="px-6 py-4 border-b bg-slate-50/50">
          <DialogHeader>
            <DialogTitle className="text-xl">Dashboard Overview</DialogTitle>
            <DialogDescription>
              Real-time metrics of your job hunting journey.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatItem 
              title="Total Applications" 
              value={totalJobs} 
              icon={<Briefcase className="h-5 w-5 text-slate-600" />}
              bgClass="bg-slate-100"
            />
            <StatItem 
              title="Active Processes" 
              value={activeProcess} 
              icon={<Activity className="h-5 w-5 text-blue-600" />} 
              bgClass="bg-blue-100"
            />
            <StatItem 
              title="Offers Received" 
              value={statusCounts.OFFER || 0} 
              icon={<Trophy className="h-5 w-5 text-emerald-600" />} 
              bgClass="bg-emerald-100"
            />
             <StatItem 
              title="Rejections" 
              value={statusCounts.REJECTED || 0} 
              icon={<XCircle className="h-5 w-5 text-rose-600" />} 
              bgClass="bg-rose-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="border rounded-xl p-4 shadow-sm bg-white">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Status Distribution</h3>
              <div className="h-[200px] w-full">
                {totalJobs === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs bg-slate-50 rounded-lg border border-dashed">No data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60} // Lebih tipis donut-nya
                        outerRadius={80}
                        paddingAngle={5} // Jarak antar slice lebih lebar
                        dataKey="value"
                        cornerRadius={5} // Sudut slice membulat
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}/>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="border rounded-xl p-4 shadow-sm bg-white">
               <h3 className="text-sm font-semibold text-slate-800 mb-4">Offer Success Rate</h3>
               <div className="flex flex-col items-center justify-center h-[200px] relative">
                  <svg className="h-40 w-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                    <circle 
                      cx="80" cy="80" r="70" 
                      stroke="currentColor" strokeWidth="10" fill="transparent" 
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * successRate) / 100} 
                      strokeLinecap="round" // Ujung garis membulat
                      className={cn(
                        "transition-all duration-1000 ease-out",
                        successRate > 50 ? "text-emerald-500" : successRate > 0 ? "text-blue-500" : "text-slate-300"
                      )} 
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-slate-900">{successRate}<span className="text-lg text-slate-400">%</span></span>
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">Conversion</span>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatItem({ title, value, icon, bgClass }: { title: string, value: number, icon: React.ReactNode, bgClass: string }) {
  return (
    <div className="flex items-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={cn("flex-shrink-0 p-3 rounded-full mr-4", bgClass)}>
        {icon}
      </div>
      
      <div>
        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900 leading-none">{value}</h4>
      </div>
    </div>
  )
}