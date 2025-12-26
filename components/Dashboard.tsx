import React from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { Calendar, AlertTriangle, MapPin, Radio, Trophy, Bell, LayoutDashboard, Send, Clock, ChevronRight } from 'lucide-react';
import { AppView } from '../types';

interface DashboardProps {
    onChangeView: (view: AppView) => void;
}

export const LicenseeDashboard: React.FC<DashboardProps> = ({ onChangeView }) => {
    const { delegations, venues, matches, teams, alerts, requests } = useAppData();

    const liveMatch = matches.find(m => m.status === 'live');
    const liveTeamA = teams.find(t => t.name === liveMatch?.teamA);
    const liveTeamB = teams.find(t => t.name === liveMatch?.teamB);

    const issueDelegations = delegations.filter(d => d.status === 'Issue');
    const criticalRequests = requests.filter(r => r.priority === 'Critical' && r.status === 'Pending');
    const isSystemCritical = issueDelegations.length > 0 || criticalRequests.length > 0 || alerts.some(a => a.severity === 'high');

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            
            {/* 1. PRIMARY MONITORING GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LIVE BROADCAST CARD */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <Radio className="w-64 h-64 text-indigo-400" />
                    </div>
                    
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-3">
                             <div className="flex items-center gap-2 bg-red-600/10 border border-red-500/20 px-3 py-1 rounded-full text-red-500 text-xs font-bold uppercase tracking-wider animate-pulse">
                                <Radio className="w-3 h-3" /> Live Feed
                            </div>
                            <span className="text-slate-500 font-mono text-xs">CHANNEL-01</span>
                        </div>
                        <span className="text-slate-400 text-sm font-medium">{liveMatch?.venue || 'Waiting for Game Start'}</span>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                        {liveMatch && liveTeamA && liveTeamB ? (
                            <>
                                <div className="text-center flex-1">
                                    <div className="text-7xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-700">{liveTeamA.flag}</div>
                                    <div className="text-3xl font-bold text-white tracking-tight">{liveTeamA.name}</div>
                                </div>
                                
                                <div className="flex flex-col items-center">
                                    <div className="bg-slate-950 border border-slate-800 px-10 py-6 rounded-3xl shadow-2xl mb-4">
                                        <span className="text-7xl font-mono font-bold text-white tracking-tighter">
                                            {liveMatch.scoreA}<span className="text-slate-800 mx-2">:</span>{liveMatch.scoreB}
                                        </span>
                                    </div>
                                    <div className="text-emerald-500 font-mono font-bold text-sm bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                                        PERIOD 2 • 12:45
                                    </div>
                                </div>

                                <div className="text-center flex-1">
                                    <div className="text-7xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-700">{liveTeamB.flag}</div>
                                    <div className="text-3xl font-bold text-white tracking-tight">{liveTeamB.name}</div>
                                </div>
                            </>
                        ) : (
                            <div className="w-full text-center py-10 opacity-40">
                                <Calendar className="w-16 h-16 mx-auto mb-4" />
                                <p className="text-xl font-medium">Broadcast Signal Standby</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* OPS FEED CARD */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-slate-800 bg-slate-950/30 flex justify-between items-center">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Bell className="w-4 h-4 text-indigo-400" />
                            Ops Feed
                        </h3>
                        {isSystemCritical && <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
                        {issueDelegations.length > 0 ? issueDelegations.map(d => (
                            <div key={`issue-${d.id}`} className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl animate-pulse">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">INCIDENT</span>
                                    <span className="text-[10px] text-slate-500 font-mono">NOW</span>
                                </div>
                                <div className="text-sm font-bold text-white">{d.country} requires assistance at {d.location}.</div>
                            </div>
                        )) : (
                            <div className="py-20 text-center opacity-30">
                                <ShieldAlert className="w-12 h-12 mx-auto mb-2" />
                                <p className="text-xs uppercase font-bold tracking-widest">All Nominal</p>
                            </div>
                        )}

                        {alerts.map(a => (
                             <div key={a.id} className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                                 <div className="flex justify-between items-start mb-2">
                                     <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{a.type}</span>
                                     <span className="text-[10px] text-slate-500">{a.timestamp}</span>
                                 </div>
                                 <div className="text-sm text-slate-300 leading-snug font-medium">{a.message}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. VENUE TELEMETRY */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-indigo-500" />
                        Venue Telemetry
                    </h3>
                    <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
                         <div className="flex items-center gap-2 text-emerald-400">
                             <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Stable
                         </div>
                         <div className="flex items-center gap-2 text-amber-400">
                             <div className="w-2 h-2 rounded-full bg-amber-500"></div> Congested
                         </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {venues.map(venue => {
                        const percent = Math.round((venue.currentOccupancy / venue.capacity) * 100);
                        const isHigh = percent > 85;
                        return (
                            <div key={venue.id} className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-inner">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="font-bold text-white text-lg">{venue.name}</div>
                                        <div className="text-xs text-slate-500 mt-1 uppercase font-bold">Security: {venue.securityLevel}</div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${isHigh ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                        {venue.status}
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold text-slate-400">
                                        <span>OCCUPANCY LOAD</span>
                                        <span className="font-mono text-indigo-400">{percent}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${percent > 85 ? 'bg-amber-500' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'}`} 
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-[10px] text-slate-600 font-mono text-right">
                                        TOTAL: {venue.currentOccupancy.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. QUICK ACTIONS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button onClick={() => onChangeView(AppView.CONCIERGE)} className="bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800 p-6 rounded-2xl transition-all group flex items-center justify-between shadow-xl">
                    <div className="flex flex-col items-start">
                        <Send className="w-6 h-6 mb-3 text-indigo-400" />
                        <span className="font-bold text-sm text-white">New Request</span>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
                <button onClick={() => onChangeView(AppView.OPERATIONS)} className="bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800 p-6 rounded-2xl transition-all group flex items-center justify-between shadow-xl">
                    <div className="flex flex-col items-start">
                        <MapPin className="w-6 h-6 mb-3 text-indigo-400" />
                        <span className="font-bold text-sm text-white">Ops Map</span>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
                <button onClick={() => onChangeView(AppView.GROUPS)} className="bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800 p-6 rounded-2xl transition-all group flex items-center justify-between shadow-xl">
                    <div className="flex flex-col items-start">
                        <Trophy className="w-6 h-6 mb-3 text-indigo-400" />
                        <span className="font-bold text-sm text-white">Standings</span>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
                <button onClick={() => onChangeView(AppView.SCHEDULE)} className="bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800 p-6 rounded-2xl transition-all group flex items-center justify-between shadow-xl">
                    <div className="flex flex-col items-start">
                        <Clock className="w-6 h-6 mb-3 text-indigo-400" />
                        <span className="font-bold text-sm text-white">Timeline</span>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
            </div>
        </div>
    );
};

const ShieldAlert = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);