
import React from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { Team } from '../types';
import { Shield, TrendingUp, TrendingDown } from 'lucide-react';

const StandingRow: React.FC<{ team: Team; rank: number }> = ({ team, rank }) => (
  <tr className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
    <td className="p-4 text-center text-slate-400 font-mono text-sm">{rank}</td>
    <td className="p-4 flex items-center gap-3">
        <span className="text-2xl">{team.flag}</span>
        <div className="flex flex-col">
            <span className="font-bold text-slate-100">{team.name}</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold">{team.group} Group</span>
        </div>
    </td>
    <td className="p-4 text-center font-semibold text-slate-100">{team.gamesPlayed}</td>
    <td className="p-4 text-center text-slate-300">{team.wins}</td>
    <td className="p-4 text-center text-slate-300 hidden sm:table-cell">{team.otWins}</td>
    <td className="p-4 text-center text-slate-300 hidden sm:table-cell">{team.otLosses}</td>
    <td className="p-4 text-center text-slate-300">{team.losses}</td>
    <td className="p-4 text-center text-slate-300 hidden md:table-cell">{team.goalsFor}:{team.goalsAgainst}</td>
    <td className="p-4 text-center font-bold text-cyan-400 text-lg">{team.points}</td>
    <td className="p-4 text-center">
        {rank <= 4 ? (
            <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase">
                <TrendingUp className="w-3 h-3 mr-1" /> QF Spot
            </span>
        ) : (
            <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                <TrendingDown className="w-3 h-3 mr-1" /> Relegation
            </span>
        )}
    </td>
  </tr>
);

export const Groups: React.FC = () => {
  const { calculatedTeams } = useAppData();
  
  const sortTeams = (teamList: Team[]) => [...teamList].sort((a, b) => {
      if ((b.points || 0) !== (a.points || 0)) return (b.points || 0) - (a.points || 0);
      const diffA = (a.goalsFor || 0) - (a.goalsAgainst || 0);
      const diffB = (b.goalsFor || 0) - (b.goalsAgainst || 0);
      return diffB - diffA;
  });

  const groupA = sortTeams(calculatedTeams.filter(t => t.group === 'A'));
  const groupB = sortTeams(calculatedTeams.filter(t => t.group === 'B'));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {[ { name: 'A', data: groupA, icon: Shield, color: 'text-indigo-400' }, { name: 'B', data: groupB, icon: Shield, color: 'text-cyan-400' } ].map(grp => (
        <div key={grp.name} className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <grp.icon className={`w-5 h-5 ${grp.color}`} /> Group {grp.name}
            </h2>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded border border-slate-700">Official Standings</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-950">
                  <th className="p-4 text-center">POS</th>
                  <th className="p-4">Nation</th>
                  <th className="p-4 text-center">GP</th>
                  <th className="p-4 text-center">W</th>
                  <th className="p-4 text-center hidden sm:table-cell">OTW</th>
                  <th className="p-4 text-center hidden sm:table-cell">OTL</th>
                  <th className="p-4 text-center">L</th>
                  <th className="p-4 text-center hidden md:table-cell">GF:GA</th>
                  <th className="p-4 text-center">PTS</th>
                  <th className="p-4 text-center">Projection</th>
                </tr>
              </thead>
              <tbody>
                {grp.data.map((team, idx) => (
                  <StandingRow key={team.id} team={team} rank={idx + 1} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};
