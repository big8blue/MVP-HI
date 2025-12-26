
import React, { useState } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { Save, Plus, Trash2, Settings, Users, Calendar, MapPin, ShieldCheck, Activity, Globe, Link, Edit2, X, Check, Flag, Trophy, Clock, Shield, Lock, Eye, CheckCircle2, Layout, Users2 } from 'lucide-react';
import { Team, Match, VenueStatus, Delegation, ScheduleItem, EventSettings } from '../types';

export const AdminConsole: React.FC = () => {
  const { 
      settings, updateSettings, 
      teams, updateTeams, 
      delegations, updateDelegations,
      schedule, updateSchedule,
      matches, updateMatches, updateMatchScore
  } = useAppData();
  
  const [activeTab, setActiveTab] = useState<'general' | 'teams' | 'matches' | 'schedule' | 'roles'>('general');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempData, setTempData] = useState<any>(null);
  const [editType, setEditType] = useState<'match' | 'delegation' | 'schedule' | null>(null);

  const openEditModal = (data: any, type: 'match' | 'delegation' | 'schedule') => {
      setTempData({ ...data });
      setEditType(type);
      setIsModalOpen(true);
  };

  const handleSave = () => {
      if (!tempData || !editType) return;

      if (editType === 'match') {
          updateMatchScore(tempData.id, tempData.scoreA, tempData.scoreB, tempData.status);
      } else if (editType === 'delegation') {
          updateDelegations(delegations.map(d => d.id === tempData.id ? tempData : d));
      } else if (editType === 'schedule') {
          updateSchedule(schedule.map(s => s.id === tempData.id ? tempData : s));
      }
      
      setIsModalOpen(false);
      setEditType(null);
  };

  const updateSettingField = (field: keyof EventSettings, value: string) => {
      updateSettings({ ...settings, [field]: value });
  };

  const renderGeneral = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layout className="w-5 h-5 text-indigo-400" />
                    Branding & Identity
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tournament Name</label>
                        <input 
                            type="text" 
                            value={settings.eventName} 
                            onChange={(e) => updateSettingField('eventName', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Event Year</label>
                        <input 
                            type="text" 
                            value={settings.eventYear} 
                            onChange={(e) => updateSettingField('eventYear', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Official Website URL</label>
                        <div className="relative">
                            <Link className="absolute left-4 top-3.5 w-4 h-4 text-slate-600" />
                            <input 
                                type="text" 
                                value={settings.officialSiteUrl} 
                                onChange={(e) => updateSettingField('officialSiteUrl', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Operational KPIs
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Broadcast Reach</label>
                        <input 
                            type="text" 
                            value={settings.broadcastReach} 
                            onChange={(e) => updateSettingField('broadcastReach', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Attendance</label>
                        <input 
                            type="text" 
                            value={settings.totalAttendance} 
                            onChange={(e) => updateSettingField('totalAttendance', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ops Efficiency</label>
                        <input 
                            type="text" 
                            value={settings.opsEfficiency} 
                            onChange={(e) => updateSettingField('opsEfficiency', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Delegation Sync</label>
                        <input 
                            type="text" 
                            value={settings.delegationStatus} 
                            onChange={(e) => updateSettingField('delegationStatus', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center border-dashed">
            <ShieldCheck className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Auto-save is active. All changes are propagated instantly to the Command Center.</p>
        </div>
    </div>
  );

  const renderTeams = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-950 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <tr>
                        <th className="p-4">Nation</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Location</th>
                        <th className="p-4 text-center">PAX</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {delegations.map(d => (
                        <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-4 font-bold text-white flex items-center gap-3">
                                <span className="text-xl">{d.flag}</span>
                                {d.country}
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                    d.status === 'Issue' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                    d.status === 'Transit' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                }`}>
                                    {d.status}
                                </span>
                            </td>
                            <td className="p-4 text-sm text-slate-400">{d.location}</td>
                            <td className="p-4 text-center font-mono text-slate-300">{d.personnelCount}</td>
                            <td className="p-4 text-right">
                                <button 
                                    onClick={() => openEditModal(d, 'delegation')}
                                    className="p-2 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-lg transition-all"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="grid grid-cols-1 gap-4">
            {schedule.map(item => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between hover:border-indigo-500/50 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${
                            item.status === 'In Progress' ? 'bg-indigo-600/20 text-indigo-400' : 
                            item.status === 'Completed' ? 'bg-emerald-600/20 text-emerald-400' :
                            'bg-slate-800 text-slate-500'
                        }`}>
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{item.name}</h4>
                            <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {item.time}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {item.location}</span>
                                <span className="font-bold text-slate-600 uppercase tracking-widest">{item.type}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${
                             item.status === 'In Progress' ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' :
                             item.status === 'Completed' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' :
                             'border-slate-800 text-slate-600'
                        }`}>
                            {item.status}
                        </span>
                        <button 
                            onClick={() => openEditModal(item, 'schedule')}
                            className="p-2 bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-lg transition-all"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const rolePermissions = [
    {
      role: 'LICENSEE',
      label: 'Command Director',
      description: 'Highest authority level with global tournament oversight.',
      permissions: [
        'Access to full Command Center telemetry',
        'Override any delegation movement status',
        'Manage and dispatch all Service Gateway requests',
        'Update match scores and tournament standings',
        'Modify global event settings and system timeline',
        'User management and system administration'
      ],
      color: 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
    },
    {
      role: 'TLO',
      label: 'Team Liaison Officer',
      description: 'Field manager assigned to a specific national delegation.',
      permissions: [
        'Manage movement status for assigned team',
        'Submit and track service requests for their team',
        'View team-specific assignments and schedules',
        'Access to the Digital Handbook (Offline ready)',
        'Receive live alerts from the Command Center'
      ],
      color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
    },
    {
      role: 'OFFICIAL',
      label: 'Tournament Official',
      description: 'Referees, judges, and technical delegates.',
      permissions: [
        'View personal officiating assignments',
        'Access to Master Schedule and timeline',
        'Access to Digital Rulebook and Handbook',
        'Track assigned transport shuttle status'
      ],
      color: 'border-amber-500 bg-amber-500/10 text-amber-400'
    }
  ];

  const renderRoles = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">Access Control Matrix</h3>
        <p className="text-sm text-slate-400">Detailed breakdown of user roles and their corresponding operational permissions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {rolePermissions.map((item) => (
          <div key={item.role} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
            <div className={`p-6 border-b border-slate-800 ${item.color.split(' ')[1]}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${item.color}`}>
                  {item.role}
                </span>
                <Shield className="w-5 h-5 opacity-40" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{item.label}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>
            <div className="p-6 flex-1 space-y-4">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authorized Capabilities</h5>
              <ul className="space-y-3">
                {item.permissions.map((perm, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${item.role === 'LICENSEE' ? 'text-indigo-500' : item.role === 'TLO' ? 'text-emerald-500' : 'text-amber-500'}`} />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-center">
               <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Security Clearance: {item.role === 'LICENSEE' ? 'Level 4' : item.role === 'TLO' ? 'Level 2' : 'Level 1'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMatches = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h3 className="text-lg font-bold text-white">Match Center</h3>
                <p className="text-sm text-slate-400">Score entry and game status management.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map(match => (
                <div key={match.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase border ${
                            match.status === 'live' ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' :
                            match.status === 'finished' ? 'bg-slate-700 text-slate-300 border-slate-600' :
                            'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        }`}>
                            {match.status}
                        </span>
                        <span className="text-xs text-slate-500">{match.time} • {match.venue}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-center flex-1">
                            <div className="text-lg font-bold text-white">{match.teamA}</div>
                        </div>
                        <div className="flex items-center gap-4 px-4">
                            <span className="text-3xl font-mono font-bold text-white">{match.scoreA || 0}</span>
                            <span className="text-slate-700 text-xl">:</span>
                            <span className="text-3xl font-mono font-bold text-white">{match.scoreB || 0}</span>
                        </div>
                        <div className="text-center flex-1">
                            <div className="text-lg font-bold text-white">{match.teamB}</div>
                        </div>
                    </div>

                    <button 
                        onClick={() => openEditModal(match, 'match')}
                        className="w-full py-2 bg-slate-800 hover:bg-indigo-600 rounded-lg text-sm font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" /> Edit Score / Status
                    </button>
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <h1 className="text-2xl font-bold text-white flex items-center gap-3">
             <Settings className="w-8 h-8 text-indigo-500" /> Administration Center
         </h1>
      </div>

      <div className="flex overflow-x-auto gap-2 border-b border-slate-800">
          {[
              { id: 'general', label: 'General', icon: Settings },
              { id: 'teams', label: 'Delegations', icon: Flag },
              { id: 'matches', label: 'Match Scores', icon: Trophy },
              { id: 'schedule', label: 'Timeline', icon: Calendar },
              { id: 'roles', label: 'Permissions', icon: Lock },
          ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id ? 'border-indigo-500 text-white bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                  <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
          ))}
      </div>

      <div className="min-h-[400px]">
          {activeTab === 'general' && renderGeneral()}
          {activeTab === 'teams' && renderTeams()}
          {activeTab === 'matches' && renderMatches()}
          {activeTab === 'schedule' && renderSchedule()}
          {activeTab === 'roles' && renderRoles()}
      </div>

      {isModalOpen && tempData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">
                    {editType === 'match' ? 'Update Match Result' : 
                     editType === 'delegation' ? 'Edit Delegation' : 'Edit Timeline Item'}
                  </h3>
                  
                  <div className="space-y-6">
                      {editType === 'match' && (
                        <>
                          <div className="flex items-center gap-4">
                              <div className="flex-1">
                                  <label className="text-xs text-slate-500 font-bold mb-1 block uppercase">{tempData.teamA}</label>
                                  <input type="number" value={tempData.scoreA} onChange={e => setTempData({...tempData, scoreA: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white" />
                              </div>
                              <div className="pt-5 text-slate-600 font-bold">VS</div>
                              <div className="flex-1">
                                  <label className="text-xs text-slate-500 font-bold mb-1 block uppercase">{tempData.teamB}</label>
                                  <input type="number" value={tempData.scoreB} onChange={e => setTempData({...tempData, scoreB: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white" />
                              </div>
                          </div>
                          <div>
                            <label className="text-xs text-slate-500 font-bold mb-1 block uppercase">Game Status</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['scheduled', 'live', 'finished'].map(s => (
                                    <button key={s} onClick={() => setTempData({...tempData, status: s})} className={`py-2 text-xs font-bold rounded border ${tempData.status === s ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 text-slate-400'}`}>{s.toUpperCase()}</button>
                                ))}
                            </div>
                          </div>
                        </>
                      )}

                      {editType === 'delegation' && (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Location</label>
                            <input type="text" value={tempData.location} onChange={e => setTempData({...tempData, location: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Status</label>
                            <select value={tempData.status} onChange={e => setTempData({...tempData, status: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white">
                                <option value="Secure">Secure</option>
                                <option value="Transit">Transit</option>
                                <option value="Issue">Issue</option>
                            </select>
                          </div>
                        </>
                      )}

                      {editType === 'schedule' && (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Event Title</label>
                            <input type="text" value={tempData.name} onChange={e => setTempData({...tempData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Progress Status</label>
                            <select value={tempData.status} onChange={e => setTempData({...tempData, status: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white">
                                <option value="Upcoming">Upcoming</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </>
                      )}
                  </div>

                  <div className="mt-8 flex gap-3">
                      <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-400 font-bold">Cancel</button>
                      <button onClick={handleSave} className="flex-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20">Commit Changes</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
