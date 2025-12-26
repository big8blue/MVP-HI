
import React from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { Calendar, Clock, MapPin, CheckCircle, Circle, ArrowRight, Flag } from 'lucide-react';

export const MasterSchedule: React.FC = () => {
  const { schedule } = useAppData();

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between mb-2">
        <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Calendar className="w-8 h-8 text-indigo-500" />
                Strategic Timeline
            </h1>
            <p className="text-slate-400">Major operational milestones and event phases.</p>
        </div>
        <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-sm font-medium">
            Active Timeline
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8">
        <div className="relative border-l-2 border-slate-700 ml-3 space-y-12 my-4">
          {schedule.map((phase, idx) => {
            const isCompleted = phase.status === 'Completed';
            const isProgress = phase.status === 'In Progress';
            
            return (
              <div key={phase.id} className="ml-10 relative">
                {/* Timeline Dot */}
                <div className={`absolute -left-[53px] top-1 w-6 h-6 rounded-full border-4 ${
                    isCompleted ? 'bg-slate-900 border-emerald-500' :
                    isProgress ? 'bg-indigo-600 border-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]' :
                    'bg-slate-900 border-slate-600'
                }`}></div>

                <div className={`flex flex-col md:flex-row md:items-start justify-between gap-4 p-5 rounded-xl transition-colors border ${
                    isProgress ? 'bg-indigo-900/10 border-indigo-500/30' : 
                    'bg-slate-900/40 border-slate-700/50 hover:bg-slate-800/50'
                }`}>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className={`text-lg font-bold ${isCompleted ? 'text-slate-400' : 'text-white'}`}>
                                {phase.name}
                            </h3>
                            {isProgress && <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded animate-pulse">LIVE</span>}
                            {isCompleted && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Done</span>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {phase.time}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {phase.location}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            phase.type === 'Competition' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                            phase.type === 'Logistics' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                            'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                            {phase.type}
                        </span>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Icon component helper
const CheckCircle = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);
