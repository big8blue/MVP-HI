import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { 
    Team, Match, VenueStatus, EventSettings, Delegation, ScheduleItem, 
    StaffMember, Vehicle, ServiceRequest, DocumentItem, MovementLog, Alert,
    UserSession, UserRole
} from '../types';

interface AppDataContextType {
  currentUser: UserSession | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  settings: EventSettings;
  updateSettings: (settings: EventSettings) => void;
  teams: Team[];
  updateTeams: (teams: Team[]) => void;
  matches: Match[];
  updateMatches: (matches: Match[]) => void;
  updateMatchScore: (matchId: string, scoreA: number, scoreB: number, status: Match['status']) => void;
  venues: VenueStatus[];
  updateVenues: (venues: VenueStatus[]) => void;
  delegations: Delegation[];
  updateDelegations: (delegations: Delegation[]) => void;
  schedule: ScheduleItem[];
  updateSchedule: (schedule: ScheduleItem[]) => void;
  staff: StaffMember[];
  updateStaff: (staff: StaffMember[]) => void;
  fleet: Vehicle[];
  updateFleet: (fleet: Vehicle[]) => void;
  requests: ServiceRequest[];
  updateRequests: (requests: ServiceRequest[]) => void;
  documents: DocumentItem[];
  updateDocuments: (docs: DocumentItem[]) => void;
  logs: MovementLog[];
  updateLogs: (logs: MovementLog[]) => void;
  alerts: Alert[];
  updateAlerts: (alerts: Alert[]) => void;
  // Computed
  calculatedTeams: Team[];
}

const initialSettings: EventSettings = {
  eventName: 'Kalam',
  eventYear: '2025',
  broadcastReach: '1.2M',
  totalAttendance: '25.8k',
  opsEfficiency: '98%',
  delegationStatus: '100%',
  officialSiteUrl: 'https://www.iihf.com'
};

const initialTeams: Team[] = [
  { id: '1', name: 'Canada', group: 'A', logo: '🍁', flag: '🇨🇦' },
  { id: '2', name: 'Finland', group: 'A', logo: '🦁', flag: '🇫🇮' },
  { id: '3', name: 'USA', group: 'A', logo: '🦅', flag: '🇺🇸' },
  { id: '4', name: 'Germany', group: 'A', logo: '🦅', flag: '🇩🇪' },
  { id: '5', name: 'Latvia', group: 'A', logo: '🇱🇻', flag: '🇱🇻' },
  { id: '6', name: 'Sweden', group: 'B', logo: '👑', flag: '🇸🇪' },
  { id: '7', name: 'Czechia', group: 'B', logo: '🦁', flag: '🇨🇿' },
  { id: '8', name: 'Slovakia', group: 'B', logo: '🇸🇰', flag: '🇸🇰' },
  { id: '9', name: 'Switzerland', group: 'B', logo: '🇨🇭', flag: '🇨🇭' },
  { id: '10', name: 'Kazakhstan', group: 'B', logo: '🇰🇿', flag: '🇰🇿' },
];

const initialMatches: Match[] = [
  { id: '1', time: '14:00', venue: 'Ottawa Arena', teamA: 'Canada', teamB: 'Finland', scoreA: 3, scoreB: 1, status: 'finished', group: 'A' },
  { id: '2', time: '18:00', venue: 'Montreal Arena', teamA: 'Sweden', teamB: 'USA', scoreA: 0, scoreB: 0, status: 'live', group: 'B' },
  { id: '3', time: '20:30', venue: 'Ottawa Arena', teamA: 'Czechia', teamB: 'Germany', status: 'scheduled', group: 'B' },
];

const initialVenues: VenueStatus[] = [
  { id: 'v1', name: 'Ottawa Arena', capacity: 18500, currentOccupancy: 17200, status: 'Operational', securityLevel: 'Green' },
  { id: 'v2', name: 'Montreal Arena', capacity: 21000, currentOccupancy: 8500, status: 'Operational', securityLevel: 'Green' },
  { id: 'v3', name: 'Civic Practice Center', capacity: 2000, currentOccupancy: 150, status: 'Maintenance', securityLevel: 'Yellow' },
];

const initialSchedule: ScheduleItem[] = [
    { id: '1', name: 'Group Stage - Round Robin', time: 'Dec 26 - Dec 31', status: 'In Progress', location: 'All Venues', type: 'Competition' },
    { id: '2', name: 'Quarter Finals', time: 'Jan 2, 12:00', status: 'Upcoming', location: 'Ottawa Arena', type: 'Competition' },
    { id: '3', name: 'Semi-Finals', time: 'Jan 4, 15:00', status: 'Upcoming', location: 'Ottawa Arena', type: 'Competition' },
    { id: '4', name: 'Championship Final', time: 'Jan 5, 19:30', status: 'Upcoming', location: 'Ottawa Arena', type: 'Competition' }
];

const MOCK_USERS = [
    { username: 'admin', password: 'puck2025', role: 'LICENSEE', name: 'Ops Director', assignedTeamId: undefined },
    { username: 'tlo_can', password: 'puck2025', role: 'TLO', name: 'Sarah Jenkins', assignedTeamId: '1' },
    { username: 'tlo_usa', password: 'puck2025', role: 'TLO', name: 'Mike Ross', assignedTeamId: '3' },
    { username: 'ref_01', password: 'puck2025', role: 'OFFICIAL', name: 'O. Larsen', assignedTeamId: undefined },
];

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('kalam_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [settings, setSettings] = useState<EventSettings>(initialSettings);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [venues, setVenues] = useState<VenueStatus[]>(initialVenues);
  const [delegations, setDelegations] = useState<Delegation[]>(() => 
    initialTeams.map(t => ({
      id: t.id, country: t.name, flag: t.flag, group: t.group, status: 'Secure', location: 'Hotel', nextMovement: 'Awaiting Schedule', personnelCount: 42
    }))
  );
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [logs, setLogs] = useState<MovementLog[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('kalam_user', JSON.stringify(currentUser));
    else localStorage.removeItem('kalam_user');
  }, [currentUser]);

  // --- Core Standing Engine ---
  const calculatedTeams = useMemo(() => {
    return teams.map(team => {
      let stats = { gp: 0, w: 0, l: 0, otw: 0, otl: 0, gf: 0, ga: 0, pts: 0 };
      
      matches.filter(m => m.status === 'finished').forEach(m => {
        const isTeamA = m.teamA === team.name;
        const isTeamB = m.teamB === team.name;
        
        if (isTeamA || isTeamB) {
          stats.gp++;
          const scoreMe = isTeamA ? (m.scoreA || 0) : (m.scoreB || 0);
          const scoreThem = isTeamA ? (m.scoreB || 0) : (m.scoreA || 0);
          stats.gf += scoreMe;
          stats.ga += scoreThem;

          if (scoreMe > scoreThem) {
            if (m.period === 'OT' || m.period === 'SO') {
                stats.otw++;
                stats.pts += 2;
            } else {
                stats.w++;
                stats.pts += 3;
            }
          } else {
            if (m.period === 'OT' || m.period === 'SO') {
                stats.otl++;
                stats.pts += 1;
            } else {
                stats.l++;
            }
          }
        }
      });

      return {
        ...team,
        gamesPlayed: stats.gp,
        wins: stats.w,
        losses: stats.l,
        otWins: stats.otw,
        otLosses: stats.otl,
        goalsFor: stats.gf,
        goalsAgainst: stats.ga,
        points: stats.pts
      };
    });
  }, [teams, matches]);

  const login = (username: string, password: string): boolean => {
      const user = MOCK_USERS.find(u => u.username === username && u.password === password);
      if (user) {
          setCurrentUser({ id: Date.now().toString(), name: user.name, role: user.role as UserRole, assignedTeamId: user.assignedTeamId });
          return true;
      }
      return false;
  };

  const updateMatchScore = (id: string, scoreA: number, scoreB: number, status: Match['status']) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, scoreA, scoreB, status } : m));
  };

  return (
    <AppDataContext.Provider value={{
      currentUser, login, logout: () => setCurrentUser(null),
      settings, updateSettings: setSettings,
      teams, updateTeams: setTeams,
      matches, updateMatches: setMatches, updateMatchScore,
      venues, updateVenues: setVenues,
      delegations, updateDelegations: setDelegations,
      schedule, updateSchedule: setSchedule,
      staff, updateStaff: setStaff,
      fleet, updateFleet: setFleet,
      requests, updateRequests: setRequests,
      documents, updateDocuments: setDocuments,
      logs, updateLogs: setLogs,
      alerts, updateAlerts: setAlerts,
      calculatedTeams
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within an AppDataProvider');
  return context;
};