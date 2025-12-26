
import React, { useState } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { Users, Truck, HeartPulse, Shield, Search, Filter, MapPin, Phone, MoreHorizontal, Battery, Fuel, Clock, CircleUserRound, Bus, Car, UserCog } from 'lucide-react';
import { StaffMember } from '../types';

type ResourceTab = 'overview' | 'roster' | 'fleet';

export const Resources: React.FC = () => {
    const { staff, updateStaff, fleet, updateFleet } = useAppData();
    const [activeTab, setActiveTab] = useState<ResourceTab>('roster');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<string>('All');

    const handleStatusChange = (id: string, newStatus: StaffMember['status']) => {
        updateStaff(staff.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Active': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'Break': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'Off Duty': return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
            case 'In Transit': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
            case 'Idle': return 'text-slate-300 bg-slate-500/10 border-slate-500/20';
            case 'Maintenance': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'Reserved': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            default: return 'text-slate-400';
        }
    };

    const filteredStaff = staff.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.assignment.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'All' || s.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const filteredFleet = fleet.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.driverName.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <UserCog className="w-8 h-8 text-cyan-500" />
                        Resource Management
                    </h1>
                    <p className="text-slate-400">Micro-management of personnel rosters and fleet assets.</p>
                </div>
                
                <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                    <button 
                        onClick={() => setActiveTab('roster')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'roster' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        Personnel Roster
                    </button>
                    <button 
                         onClick={() => setActiveTab('fleet')}
                         className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'fleet' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        Fleet Assets
                    </button>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder={activeTab === 'roster' ? "Search staff by name or assignment..." : "Search vehicle ID or driver..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                {activeTab === 'roster' && (
                    <div className="flex items-center gap-2 overflow-x-auto">
                        <Filter className="w-5 h-5 text-slate-500" />
                        {['All', 'TLO', 'Driver', 'Medical', 'Security'].map(role => (
                            <button
                                key={role}
                                onClick={() => setFilterRole(role)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border whitespace-nowrap ${
                                    filterRole === role 
                                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' 
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ROSTER TAB */}
            {activeTab === 'roster' && (
                <div className="grid gap-4">
                    {filteredStaff.map(member => (
                        <div key={member.id} className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-4 hover:border-indigo-500/30 transition-colors group">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                                {/* Avatar & Name */}
                                <div className="flex items-center gap-4 min-w-[250px]">
                                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 relative">
                                        {member.role === 'Medical' ? <HeartPulse className="w-6 h-6 text-rose-400" /> :
                                         member.role === 'Driver' ? <Truck className="w-6 h-6 text-amber-400" /> :
                                         member.role === 'Security' ? <Shield className="w-6 h-6 text-indigo-400" /> :
                                         <CircleUserRound className="w-6 h-6 text-cyan-400" />}
                                         <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-800 ${
                                             member.status === 'Active' ? 'bg-emerald-500' :
                                             member.status === 'Break' ? 'bg-amber-500' : 'bg-slate-500'
                                         }`}></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{member.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{member.role}</span>
                                            <span className="text-slate-600">•</span>
                                            <span className="text-xs text-indigo-300">{member.assignment}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Location */}
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                                    <div className="flex flex-col justify-center">
                                        <label className="text-[10px] uppercase text-slate-500 font-bold mb-1">Status</label>
                                        <select 
                                            value={member.status}
                                            onChange={(e) => handleStatusChange(member.id, e.target.value as any)}
                                            className={`text-xs font-medium px-2 py-1 rounded border outline-none cursor-pointer appearance-none ${getStatusColor(member.status)}`}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Break">Break</option>
                                            <option value="Off Duty">Off Duty</option>
                                        </select>
                                    </div>
                                    
                                    <div className="flex flex-col justify-center">
                                        <label className="text-[10px] uppercase text-slate-500 font-bold mb-1">Location</label>
                                        <div className="flex items-center gap-1.5 text-sm text-slate-300 truncate">
                                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                            {member.location}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <label className="text-[10px] uppercase text-slate-500 font-bold mb-1">Shift Ends</label>
                                        <div className="flex items-center gap-1.5 text-sm text-slate-300">
                                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                                            {member.shiftEnd}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <label className="text-[10px] uppercase text-slate-500 font-bold mb-1">Device Battery</label>
                                        <div className="flex items-center gap-2">
                                            <Battery className={`w-4 h-4 ${member.batteryLevel < 20 ? 'text-red-500' : 'text-emerald-500'}`} />
                                            <span className="text-xs text-slate-400 font-mono">{member.batteryLevel}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 ml-auto">
                                    <button className="p-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg border border-slate-700 transition-colors" title="Call">
                                        <Phone className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredStaff.length === 0 && <div className="text-center py-12 text-slate-500">No personnel found matching filters.</div>}
                </div>
            )}

            {/* FLEET TAB */}
            {activeTab === 'fleet' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredFleet.map(vehicle => (
                         <div key={vehicle.id} className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-5 hover:border-indigo-500/30 transition-colors">
                             <div className="flex justify-between items-start mb-4">
                                 <div className="flex items-center gap-3">
                                     <div className={`p-3 rounded-xl ${
                                         vehicle.type === 'Bus' ? 'bg-indigo-500/20 text-indigo-400' : 
                                         vehicle.type === 'SUV' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-400'
                                     }`}>
                                         {vehicle.type === 'Bus' ? <Bus className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                                     </div>
                                     <div>
                                         <h3 className="font-bold text-white text-lg">{vehicle.name}</h3>
                                         <div className="text-xs font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 w-fit">{vehicle.plate}</div>
                                     </div>
                                 </div>
                                 <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(vehicle.status)}`}>
                                     {vehicle.status}
                                 </span>
                             </div>

                             <div className="space-y-3 bg-slate-900/50 rounded-lg p-3 border border-slate-800/50">
                                 <div className="flex justify-between items-center text-sm">
                                     <span className="text-slate-500 flex items-center gap-2"><UserCog className="w-3.5 h-3.5"/> Operator</span>
                                     <span className="text-slate-200 font-medium">{vehicle.driverName}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-sm">
                                     <span className="text-slate-500 flex items-center gap-2"><MapPin className="w-3.5 h-3.5"/> Location</span>
                                     <span className="text-slate-200 font-medium truncate max-w-[150px]">{vehicle.location}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-sm">
                                     <span className="text-slate-500 flex items-center gap-2"><Users className="w-3.5 h-3.5"/> Pax Load</span>
                                     <span className="text-slate-200 font-mono">{vehicle.capacity}</span>
                                 </div>
                             </div>

                             <div className="mt-4 flex items-center gap-3">
                                 <Fuel className={`w-4 h-4 ${vehicle.fuelLevel < 25 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
                                 <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                     <div 
                                        className={`h-full rounded-full ${vehicle.fuelLevel < 25 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                        style={{ width: `${vehicle.fuelLevel}%` }}
                                     ></div>
                                 </div>
                                 <span className="text-xs font-mono text-slate-400">{vehicle.fuelLevel}%</span>
                             </div>

                             <div className="mt-4 pt-4 border-t border-slate-700/50 flex gap-2">
                                 <button className="flex-1 py-2 text-xs font-medium bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 rounded border border-slate-700 transition-colors">
                                     Locate
                                 </button>
                                 <button className="flex-1 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors">
                                     Reassign
                                 </button>
                             </div>
                         </div>
                    ))}
                     {filteredFleet.length === 0 && <div className="col-span-2 text-center py-12 text-slate-500">No vehicles found.</div>}
                </div>
            )}
        </div>
    );
};
