
import React, { useState } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { Calendar, MapPin, Bus, AlertCircle, MessageSquare, Clock, AlertTriangle, CheckCircle, Navigation, Trophy, ChevronRight } from 'lucide-react';
import { AppView, Delegation, MovementLog } from '../types';
import { ConfirmationModal } from './Modals';

interface RoleDashboardProps {
    onChangeView: (view: AppView) => void;
}

// --- Team Manager (TLO) Dashboard ---
export const TeamDashboard: React.FC<RoleDashboardProps> = ({ onChangeView }) => {
    const { currentUser, delegations, updateDelegations, logs, updateLogs, matches, alerts, requests } = useAppData();
    
    // Get My Team Data
    const myTeam = delegations.find(d => d.id === currentUser?.assignedTeamId);
    const myMatches = matches.filter(m => m.teamA === myTeam?.country || m.teamB === myTeam?.country);
    const nextMatch = myMatches.find(m => m.status === 'scheduled');
    const myRequests = requests.filter(r => r.requestor.includes(myTeam?.country || ''));

    // Modal State
    const [confirmAction, setConfirmAction] = useState<'depart' | 'arrive' | null>(null);

    if (!myTeam) return <div className="p-8 text-center text-slate-500">Team data not assigned. Contact Admin.</div>;

    const handleMovement = () => {
        if (!confirmAction) return;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let newStatus: any = myTeam.status;
        let newLocation: any = myTeam.location;
        let actionText = '';

        if (confirmAction === 'depart') {
            newStatus = 'Transit';
            const dest = myTeam.location === 'Hotel' ? 'Arena' : 'Hotel';
            actionText = `Departed ${myTeam.location} for ${dest}`;
        } else {
            newStatus = 'Secure';
            newLocation = myTeam.location === 'Hotel' ? 'Arena' : 'Hotel'; // Simplified toggle logic
            actionText = `Arrived at ${newLocation}`;
        }

        updateDelegations(delegations.map(d => d.id === myTeam.id ? { ...d, status: newStatus, location: newStatus === 'Secure' ? newLocation : d.location } : d));
        
        const newLog: MovementLog = {
            id: Date.now().toString(),
            teamId: myTeam.id,
            teamName: myTeam.country,
            flag: myTeam.flag,
            action: actionText,
            timestamp,
            type: confirmAction === 'depart' ? 'departure' : 'arrival'
        };
        updateLogs([newLog, ...logs]);
        setConfirmAction(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in pb-20">
            {/* Status Hero Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <span className="text-9xl">{myTeam.flag}</span>
                </div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">{myTeam.country} Delegation</h2>
                            <p className="text-slate-400 text-sm">Status Overview</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${
                             myTeam.status === 'Secure' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                             myTeam.status === 'Transit' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
                             'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                            {myTeam.status}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1 w-full bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-8 h-8 text-indigo-500" />
                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-bold">Current Location</div>
                                    <div className="text-lg font-bold text-white">{myTeam.status === 'Transit' ? 'En Route' : myTeam.location}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-full md:w-auto">
                            {myTeam.status === 'Transit' ? (
                                <button 
                                    onClick={() => setConfirmAction('arrive')}
                                    className="w-full md:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                                >
                                    <MapPin className="w-5 h-5" /> Confirm Arrival
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setConfirmAction('depart')}
                                    className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
                                >
                                    <Bus className="w-5 h-5" /> Start Transport
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Communication / Alerts */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-amber-400" />
                            Organizer Alerts
                        </h3>
                        {alerts.length > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{alerts.length}</span>}
                    </div>
                    <div className="space-y-3">
                        {alerts.length === 0 ? (
                            <p className="text-slate-500 text-sm py-4 text-center">No active alerts from operations.</p>
                        ) : (
                            alerts.map(a => (
                                <div key={a.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                        <span className="font-bold text-amber-400">{a.type}</span>
                                        <span>{a.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-slate-200">{a.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Next Event */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-indigo-400" />
                        Next Match
                    </h3>
                    {nextMatch ? (
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                             <div className="flex justify-between items-center mb-3">
                                 <span className="text-2xl font-bold text-white">{nextMatch.teamA} vs {nextMatch.teamB}</span>
                             </div>
                             <div className="flex flex-col gap-2 text-sm text-slate-300">
                                 <div className="flex items-center gap-2">
                                     <Clock className="w-4 h-4 text-slate-500" /> {nextMatch.time}
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <MapPin className="w-4 h-4 text-slate-500" /> {nextMatch.venue}
                                 </div>
                             </div>
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm text-center py-4">No upcoming matches scheduled.</p>
                    )}
                </div>
            </div>
            
            {/* Quick Actions Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur border-t border-slate-800 p-4 lg:hidden z-50">
                 <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => onChangeView(AppView.CONCIERGE)} className="bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm">Request Service</button>
                     <button onClick={() => onChangeView(AppView.SCHEDULE)} className="bg-slate-800 text-slate-300 py-3 rounded-xl font-bold text-sm">Full Schedule</button>
                 </div>
            </div>

            <ConfirmationModal 
                isOpen={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                onConfirm={handleMovement}
                title={confirmAction === 'depart' ? 'Confirm Departure' : 'Confirm Arrival'}
                description={confirmAction === 'depart' ? 'Are you departing for the venue? This triggers GPS tracking.' : 'Have you arrived safely? This marks the team as Secure.'}
                confirmLabel={confirmAction === 'depart' ? 'Depart' : 'Arrive'}
                icon={Navigation}
            />
        </div>
    );
};

// --- Official Dashboard ---
export const OfficialDashboard: React.FC<RoleDashboardProps> = ({ onChangeView }) => {
    return (
        <div className="space-y-6 animate-in fade-in">
             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                 <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Trophy className="w-8 h-8 text-amber-500" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Officiating Portal</h2>
                 <p className="text-slate-400">Welcome, Official. Your schedule and transport status is below.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                     <h3 className="font-bold text-white mb-4">Upcoming Assignment</h3>
                     <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                         <div className="text-xs text-slate-500 uppercase font-bold mb-1">Dec 26 • 14:00</div>
                         <div className="text-lg font-bold text-white mb-2">Canada vs Finland</div>
                         <div className="text-sm text-slate-400 flex items-center gap-2">
                             <MapPin className="w-4 h-4" /> Ottawa Arena
                         </div>
                     </div>
                 </div>

                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                     <h3 className="font-bold text-white mb-4">Transport Shuttle</h3>
                     <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                         <div>
                             <div className="text-xs text-slate-500 uppercase font-bold mb-1">Pickup</div>
                             <div className="text-white font-bold">12:15 PM</div>
                             <div className="text-xs text-slate-400">Hotel Lobby</div>
                         </div>
                         <Bus className="w-8 h-8 text-indigo-400" />
                     </div>
                 </div>
             </div>
        </div>
    );
};
