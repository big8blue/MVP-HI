
export type UserRole = 'LICENSEE' | 'TLO' | 'OFFICIAL';

export interface UserSession {
  id: string;
  name: string;
  role: UserRole;
  assignedTeamId?: string; // For TLOs
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  group: 'A' | 'B';
  logo: string; // Emoji or URL
  flag: string; // Emoji
  // Stats for standings
  gamesPlayed?: number;
  wins?: number;
  losses?: number;
  otWins?: number;
  otLosses?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  points?: number;
}

export interface Match {
  id: string;
  time: string;
  venue: string;
  teamA: string;
  teamB: string;
  scoreA?: number;
  scoreB?: number;
  period?: string; // e.g., "2nd", "3rd", "OT"
  gameTime?: string; // e.g., "14:32"
  status: 'scheduled' | 'live' | 'finished';
  group: 'A' | 'B' | 'Playoff';
}

export interface VenueStatus {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  status: 'Operational' | 'Maintenance' | 'Security Alert';
  securityLevel: 'Green' | 'Yellow' | 'Red';
}

export interface Delegation {
  id: string;
  country: string;
  flag: string;
  group: 'A' | 'B';
  status: 'Secure' | 'Transit' | 'Issue';
  location: 'Hotel' | 'Arena' | 'Airborne' | 'City Center';
  nextMovement: string;
  personnelCount: number;
}

export interface ServiceRequest {
  id: string;
  type: 'Transport' | 'Medical' | 'Logistics' | 'Catering' | 'Security';
  priority: 'Normal' | 'High' | 'Critical';
  status: 'Pending' | 'Dispatched' | 'Completed';
  requestor: string;
  details: string;
  timestamp: string;
}

export interface EventSettings {
  eventName: string;
  eventYear: string;
  broadcastReach: string;
  totalAttendance: string;
  opsEfficiency: string;
  delegationStatus: string;
  officialSiteUrl: string;
}

export interface ScheduleItem {
  id: string;
  name: string;
  time: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  location: string;
  type: 'Logistics' | 'Event' | 'Competition' | 'Social';
}

export interface StaffMember {
    id: string;
    name: string;
    role: 'TLO' | 'Driver' | 'Security' | 'Medical' | 'Volunteer';
    assignment: string;
    status: 'Active' | 'Break' | 'Off Duty';
    location: string;
    contact: string;
    shiftEnd: string;
    batteryLevel: number;
}

export interface Vehicle {
    id: string;
    name: string;
    type: 'Bus' | 'SUV' | 'Van';
    plate: string;
    driverName: string;
    status: 'In Transit' | 'Idle' | 'Maintenance' | 'Reserved';
    location: string;
    fuelLevel: number;
    capacity: string;
}

export interface DocumentItem {
    id: string;
    title: string;
    category: 'Regulations' | 'Medical' | 'Transport' | 'Contacts' | 'Menus';
    format: 'PDF' | 'Map' | 'Link';
    size: string;
    updated: string;
    description: string;
    isOffline: boolean;
}

export interface MovementLog {
    id: string;
    teamId: string;
    teamName: string;
    flag: string;
    action: string;
    timestamp: string;
    type: 'departure' | 'arrival' | 'issue';
}

export interface Alert {
    id: string;
    type: 'Weather' | 'Logistics' | 'Security' | 'Medical' | 'Info';
    title: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD', // Dynamic based on role
  GROUPS = 'GROUPS',
  SCHEDULE = 'SCHEDULE',
  OPERATIONS = 'OPERATIONS',
  RESOURCES = 'RESOURCES',
  CONCIERGE = 'CONCIERGE',
  HANDBOOK = 'HANDBOOK',
  USERS = 'USERS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: { uri: string; title: string }[];
}
