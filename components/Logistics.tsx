
import React, { useState } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { MapPin, Shield, Navigation, Bus, Building2, History, Phone, AlertOctagon, Share2, Edit2, Save, X, Radio, AlertTriangle } from 'lucide-react';
import { Delegation, MovementLog } from '../types';
import { ConfirmationModal } from './Modals';

export const Logistics: React.FC = () => {
    // Operations View (formerly Logistics)
    const { delegations, updateDelegations, logs, updateLogs } = useAppData();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingDelegation, setEditingDelegation] = useState<Delegation | null>(null);
    
    // Confirmation Modal State
    const [confirmModalState, setConfirmModalState] = useState<{
        isOpen: boolean;
        action: 'depart' | 'arrive' | null;
    }>({ isOpen: false, action: null });
    
    // TLO Simulation State
    const [selectedTloTeamId, setSelectedTloTeamId] = useState<string>('3'); // Default to USA for demo

    const activeTeam = delegations.find(d => d.id === selectedTloTeamId);

    // Derived Stats
    const statusCounts = {
        hotel: delegations.filter(d => d.location === 'Hotel').length,
        arena: delegations.filter(d => d.location === 'Arena').length,
        transit: delegations.filter(d => d.status === 'Transit').length,
        issue: delegations.filter(d => d.status === 'Issue').length
    };

    // TLO Quick Actions
    const initiateTloAction = (actionType: 'depart' | 'arrive') => {
        setConfirmModalState({ isOpen: true, action: actionType });
    };

    const executeTloAction = () => {
        const actionType = confirmModalState.action;
        if (!actionType || !activeTeam) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let newLocation: any = activeTeam.location;
        let newStatus: any = activeTeam.status;
        let logAction = '';
        let logType: 'departure' | 'arrival' = 'departure';

        if (actionType === 'depart') {
            newStatus = 'Transit';
            const destination = activeTeam.location === 'Hotel' ? 'Arena' : 'Hotel';
            logAction = `Departed ${activeTeam.location} for ${destination}`;
            logType = 'departure';
        } else {
            newStatus = 'Secure';
            newLocation = activeTeam.location === 'Hotel' ? 'Arena' : 'Hotel';
            logAction = `Arrived at ${newLocation} safely`;
            logType = 'arrival';
        }

        updateDelegations(delegations.map(d => d.id === activeTeam.id ? {
            ...d,
            status: newStatus,
            location: newStatus === 'Secure' ? newLocation : d.location,
            nextMovement: newStatus === 'Secure' ? 'Awaiting Schedule' : 'En Route'
        } : d));

        const newLog: MovementLog = {
            id: Date.now().toString(),
            teamId: activeTeam.id,
            teamName: activeTeam.country,
            flag: activeTeam.flag,
            action: logAction,
            timestamp,
            type: logType
        };
        updateLogs([newLog, ...logs]);
        setConfirmModalState({ isOpen: false, action: null });
    };

    const handleShareLocation = () => {
        if (!activeTeam) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Simulated action for the UI
        const newLog: MovementLog = {
            id: Date.now().toString(),
            teamId: activeTeam.id,
            teamName: activeTeam.country,
            flag: activeTeam.flag,
            action: `📍 Shared Location Beacon: Secure`,
            timestamp,
            type: 'arrival'
        };
        updateLogs([newLog, ...logs]);
    };

    const handleQuickIncident = () => {
        if(!activeTeam) return;
        
        // 1. Update Team Status
        updateDelegations(delegations.map(d => d.id === activeTeam.id ? { ...d, status: 'Issue' } : d));
        
        // 2. Log the Incident
        const newLog: MovementLog = {
            id: Date.now().toString(),
            teamId: activeTeam.id,
            teamName: activeTeam.country,
            flag: activeTeam.flag,
            action: 'Reported Urgent Issue via Quick Ops',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'issue'
        };
        updateLogs([newLog, ...logs]);
    };

    const handleEditClick = (delegation: Delegation) => {
        setEditingDelegation({ ...delegation });
        setIsEditModalOpen(true);
    };

    const handleSave = () => {
        if (editingDelegation) {
            updateDelegations(delegations.map(d => d.id === editingDelegation.id ? editingDelegation : d));
            setIsEditModalOpen(false);
            setEditingDelegation(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Shield className="w-8 h-8 text-indigo-500" />
                        Operations Command
                    </h1>
                    <p className="text-slate-400">Real-time delegation movement telemetry and TLO coordination.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-sm text-slate-300 font-mono">GPS: LOCKED</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                
                {/* Main Content - Left Side */}
                <div className="xl:col-span-3 space-y-6">
                    
                    {/* TLO Flight Deck (Quick Actions) */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group shadow-xl">
                        {/* Decorative Background */}
                         <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Navigation className="w-64 h-64 text-indigo-400" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Navigation className="w-5 h-5 text-cyan-400" />
                                        TLO Flight Deck
                                    </h2>
                                    <p className="text-sm text-slate-400">Command interface for delegation movement.</p>
                                </div>
                                <select 
                                    value={selectedTloTeamId}
                                    onChange={(e) => setSelectedTloTeamId(e.target.value)}
                                    className="bg-slate-800 border border-slate-700 rounded-lg text-sm px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto font-medium shadow-sm"
                                >
                                    {delegations.map(d => (
                                        <option key={d.id} value={d.id}>{d.flag} {d.country}</option>
                                    ))}
                                </select>
                            </div>

                            {activeTeam && (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Status Card */}
                                    <div className="lg:col-span-5 bg-slate-950/80 p-6 rounded-xl border border-indigo-500/20 flex flex-col justify-between shadow-inner">
                                        <div className="flex items-start gap-5">
                                            <div className="text-5xl bg-slate-800 w-20 h-20 flex items-center justify-center rounded-xl shadow-lg border border-slate-700">{activeTeam.flag}</div>
                                            <div>
                                                <div className="text-2xl font-bold text-white tracking-tight">{activeTeam.country}</div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border ${
                                                        activeTeam.status === 'Issue' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                                        activeTeam.status === 'Transit' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    }`}>
                                                        {activeTeam.status}
                                                    </span>
                                                    <span className="text-slate-400 text-sm font-medium flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {activeTeam.status === 'Transit' ? 'En Route' : activeTeam.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-slate-800">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Current Order</div>
                                                    <div className="text-sm text-indigo-300 font-mono bg-indigo-500/10 px-2 py-1 rounded inline-block border border-indigo-500/20">
                                                        {activeTeam.nextMovement}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Personnel</div>
                                                    <div className="text-white font-mono">{activeTeam.personnelCount} PAX</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Primary Action Button */}
                                    <div className="lg:col-span-4 flex flex-col gap-3">
                                        {activeTeam.status === 'Transit' ? (
                                            <button 
                                                onClick={() => initiateTloAction('arrive')}
                                                className="h-full w-full bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all flex flex-col items-center justify-center gap-2 animate-pulse group border border-emerald-400/20"
                                            >
                                                <MapPin className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                                Confirm Arrival
                                                <span className="text-xs font-normal opacity-80 font-mono bg-emerald-700/50 px-2 py-0.5 rounded">TAP TO LOG</span>
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => initiateTloAction('depart')}
                                                className="h-full w-full bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all flex flex-col items-center justify-center gap-2 group border border-indigo-400/20"
                                            >
                                                <Bus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                                Start Transport
                                                <span className="text-xs font-normal opacity-80 font-mono bg-indigo-700/50 px-2 py-0.5 rounded">TAP TO LOG</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Quick Ops Grid */}
                                    <div className="lg:col-span-3 grid grid-cols-1 gap-2">
                                        <button 
                                            onClick={handleQuickIncident}
                                            className="bg-slate-800 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 border border-slate-700 text-slate-300 p-2 rounded-lg flex items-center justify-start gap-3 transition-colors group px-4 h-12"
                                        >
                                            <AlertOctagon className="w-4 h-4 text-red-500" />
                                            <span className="text-xs font-bold">Report Issue</span>
                                        </button>
                                        <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 p-2 rounded-lg flex items-center justify-start gap-3 transition-colors px-4 h-12">
                                            <Phone className="w-4 h-4 text-indigo-400" />
                                            <span className="text-xs font-bold">Call Driver</span>
                                        </button>
                                        <button 
                                            onClick={handleShareLocation}
                                            className="bg-slate-800 hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400 border border-slate-700 text-slate-300 p-2 rounded-lg flex items-center justify-start gap-3 transition-colors px-4 h-12"
                                        >
                                            <Share2 className="w-4 h-4 text-cyan-400" />
                                            <span className="text-xs font-bold">Share Beacon</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* LIVE FLEET MATRIX */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                         <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                             <h2 className="text-sm font-bold text-white flex items-center gap-2">
                                 <Radio className="w-4 h-4 text-emerald-500" />
                                 Live Fleet Matrix
                             </h2>
                             <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hotel: {statusCounts.hotel}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Transit: {statusCounts.transit}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Arena: {statusCounts.arena}
                                </div>
                             </div>
                         </div>
                         <div className="overflow-x-auto">
                             <table className="w-full text-left text-sm">
                                 <thead className="bg-slate-950 text-slate-500 text-xs uppercase font-bold tracking-wider">
                                     <tr>
                                         <th className="px-6 py-3">Team</th>
                                         <th className="px-6 py-3">Status</th>
                                         <th className="px-6 py-3">Location</th>
                                         <th className="px-6 py-3">Order</th>
                                         <th className="px-6 py-3 text-right">Edit</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-800">
                                     {delegations.map(d => (
                                         <tr key={d.id} className="hover:bg-slate-800/50 transition-colors group">
                                             <td className="px-6 py-3 font-medium text-white flex items-center gap-3">
                                                 <span className="text-xl">{d.flag}</span>
                                                 {d.country}
                                             </td>
                                             <td className="px-6 py-3">
                                                 <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border ${
                                                     d.status === 'Secure' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                     d.status === 'Transit' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                     'bg-red-500/10 text-red-400 border-red-500/20'
                                                 }`}>
                                                     {d.status}
                                                 </span>
                                             </td>
                                             <td className="px-6 py-3 text-slate-300 font-medium">
                                                <div className="flex items-center gap-2">
                                                    {d.status === 'Transit' && <Navigation className="w-3.5 h-3.5 text-amber-500 animate-pulse" />}
                                                    {d.status === 'Secure' && <MapPin className="w-3.5 h-3.5 text-emerald-500" />}
                                                    {d.status === 'Issue' && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                                                    {d.status === 'Transit' ? 'En Route (GPS)' : d.location}
                                                </div>
                                             </td>
                                             <td className="px-6 py-3 text-slate-500 font-mono text-xs">
                                                 {d.nextMovement}
                                             </td>
                                             <td className="px-6 py-3 text-right">
                                                 <button 
                                                    onClick={() => handleEditClick(d)}
                                                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition-colors opacity-0 group-hover:opacity-100"
                                                 >
                                                     <Edit2 className="w-3.5 h-3.5" />
                                                 </button>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                    </div>

                </div>

                {/* Right Side - Logs */}
                <div className="xl:col-span-1">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl h-[calc(100vh-140px)] flex flex-col sticky top-6 shadow-xl">
                        <div className="p-4 border-b border-slate-800 bg-slate-950/50 rounded-t-2xl flex items-center justify-between">
                             <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                 <History className="w-4 h-4 text-indigo-400" />
                                 Live Log
                             </h3>
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
                             {logs.map((log, idx) => (
                                 <div key={log.id} className={`relative pl-8 pr-4 py-4 border-b border-slate-800/50 ${idx === 0 ? 'bg-indigo-500/5' : ''}`}>
                                     {/* Timeline Line */}
                                     <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-800"></div>
                                     {/* Dot */}
                                     <div className={`absolute left-[13px] top-5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 z-10 ${
                                         log.type === 'departure' ? 'bg-indigo-500' : 
                                         log.type === 'issue' ? 'bg-red-500' : 'bg-emerald-500'
                                     }`}></div>
                                     
                                     <div className="flex justify-between items-start mb-1">
                                         <span className="text-[10px] font-bold text-slate-500 font-mono bg-slate-950 px-1 rounded">{log.timestamp}</span>
                                     </div>
                                     <div className="text-sm font-bold text-slate-200 mb-1 flex items-center gap-2">
                                         <span>{log.flag}</span> {log.teamName}
                                     </div>
                                     <div className="text-xs text-slate-400 leading-snug">
                                         {log.action}
                                     </div>
                                 </div>
                             ))}
                             
                             <div className="text-center py-6">
                                 <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">End of Log</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal (RBAC Simulated) */}
            {isEditModalOpen && editingDelegation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Edit2 className="w-4 h-4 text-indigo-400" />
                                Override Status
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Location</label>
                                <select 
                                    value={editingDelegation.location}
                                    onChange={(e) => setEditingDelegation({...editingDelegation, location: e.target.value as any})}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="Hotel">Hotel</option>
                                    <option value="Arena">Arena</option>
                                    <option value="City Center">City Center</option>
                                    <option value="Airborne">Airborne</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Operational Status</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Secure', 'Transit', 'Issue'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setEditingDelegation({...editingDelegation, status: status as any})}
                                            className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                                                editingDelegation.status === status
                                                ? status === 'Secure' ? 'bg-emerald-600 border-emerald-500 text-white'
                                                : status === 'Transit' ? 'bg-amber-600 border-amber-500 text-white'
                                                : 'bg-red-600 border-red-500 text-white'
                                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Next Movement Order</label>
                                <input 
                                    type="text" 
                                    value={editingDelegation.nextMovement}
                                    onChange={(e) => setEditingDelegation({...editingDelegation, nextMovement: e.target.value})}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                                />
                            </div>
                        </div>
                        <div className="p-5 border-t border-slate-800 flex justify-end gap-2">
                             <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium">Cancel</button>
                             <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                                 <Save className="w-4 h-4" /> Save Changes
                             </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={confirmModalState.isOpen}
                onClose={() => setConfirmModalState({ isOpen: false, action: null })}
                onConfirm={executeTloAction}
                title={confirmModalState.action === 'depart' ? 'Confirm Departure' : 'Confirm Arrival'}
                description={confirmModalState.action === 'depart' 
                    ? `Are you sure you want to log ${activeTeam?.country} as DEPARTED from ${activeTeam?.location}? GPS tracking will be activated.`
                    : `Confirming arrival for ${activeTeam?.country} at destination. This will mark the delegation as SECURE.`
                }
                confirmLabel={confirmModalState.action === 'depart' ? 'Log Departure' : 'Log Arrival'}
                icon={Navigation}
            />
        </div>
    );
};
