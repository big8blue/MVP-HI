import React, { useState, useEffect } from 'react';
import { Users, Calendar, Plane, Globe, Menu, X, Settings, Database, BellRing, BookOpen, LayoutDashboard, Trophy, CloudSnow, Clock, LogOut } from 'lucide-react';
import { LicenseeDashboard } from './components/Dashboard';
import { TeamDashboard, OfficialDashboard } from './components/RoleViews';
import { Logistics } from './components/Logistics';
import { MasterSchedule } from './components/MasterSchedule';
import { Concierge } from './components/Concierge';
import { DigitalHandbook } from './components/DigitalHandbook';
import { AdminConsole } from './components/AdminConsole';
import { Groups } from './components/Groups';
import { LoginScreen } from './components/LoginScreen';
import { AppDataProvider, useAppData } from './contexts/AppDataContext';
import { AppView } from './types';

const AppHeader: React.FC = () => {
    const { settings, currentUser, logout } = useAppData();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
                        <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-white leading-tight">{settings.eventName}</h1>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            {currentUser?.role === 'LICENSEE' ? 'Command Center' : 
                             currentUser?.role === 'TLO' ? 'Team Manager' : 'Official Portal'}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="px-6 pb-2 flex items-center justify-between border-t border-slate-800/30 pt-2">
                 <div className="text-xs text-slate-300 font-medium">
                     {currentUser?.name}
                 </div>
                 <button onClick={logout} className="text-[10px] text-slate-500 hover:text-red-400 uppercase font-bold flex items-center gap-1 transition-colors">
                     <LogOut className="w-3 h-3" /> Logout
                 </button>
            </div>

            <div className="px-6 pb-4 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono bg-slate-950 p-2 rounded-lg border border-slate-800 shadow-inner">
                    <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="font-semibold text-slate-200">{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CloudSnow className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-semibold text-slate-200">-4°C</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AppContent: React.FC = () => {
  const { currentUser, logout } = useAppData();
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!currentUser) {
      return <LoginScreen />;
  }

  const NavItem = ({ view, icon, label }: { view: AppView; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group mb-1 ${
        currentView === view
          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20 font-semibold'
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
      }`}
    >
      <div className={`${currentView === view ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD: 
        if (currentUser.role === 'TLO') return <TeamDashboard onChangeView={setCurrentView} />;
        if (currentUser.role === 'OFFICIAL') return <OfficialDashboard onChangeView={setCurrentView} />;
        return <LicenseeDashboard onChangeView={setCurrentView} />;
      
      case AppView.GROUPS: return <Groups />;
      case AppView.SCHEDULE: return <MasterSchedule />;
      case AppView.OPERATIONS: return <Logistics />;
      case AppView.CONCIERGE: return <Concierge />;
      case AppView.HANDBOOK: return <DigitalHandbook />;
      case AppView.USERS: return <AdminConsole />;
      default: return <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <Database className="w-12 h-12 mb-4 opacity-50" />
        <p>Restricted Area.</p>
      </div>;
    }
  };

  const renderSidebarNav = () => {
      const commonBottom = (
          <div className="my-4 pt-4 border-t border-slate-800/50">
             <p className="px-2 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Knowledge</p>
             <NavItem view={AppView.HANDBOOK} icon={<BookOpen size={18} />} label="Digital Handbook" />
          </div>
      );

      const logoutItem = (
          <div className="mt-auto p-4 border-t border-slate-800">
              <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl border border-transparent hover:border-red-500/20 transition-all group font-medium"
              >
                  <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Sign Out</span>
              </button>
          </div>
      );

      let navContent;
      if (currentUser.role === 'TLO') {
          navContent = (
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                  <NavItem view={AppView.DASHBOARD} icon={<LayoutDashboard size={18} />} label="My Team" />
                  <NavItem view={AppView.SCHEDULE} icon={<Calendar size={18} />} label="Schedule" />
                  <NavItem view={AppView.CONCIERGE} icon={<BellRing size={18} />} label="Service Requests" />
                  <NavItem view={AppView.GROUPS} icon={<Trophy size={18} />} label="Standings" />
                  {commonBottom}
              </nav>
          );
      } else if (currentUser.role === 'OFFICIAL') {
          navContent = (
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                  <NavItem view={AppView.DASHBOARD} icon={<LayoutDashboard size={18} />} label="Assignments" />
                  <NavItem view={AppView.SCHEDULE} icon={<Calendar size={18} />} label="Master Schedule" />
                  {commonBottom}
              </nav>
          );
      } else {
          navContent = (
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                  <NavItem view={AppView.DASHBOARD} icon={<LayoutDashboard size={18} />} label="Command Center" />
                  <NavItem view={AppView.GROUPS} icon={<Trophy size={18} />} label="Standings" />
                  <NavItem view={AppView.SCHEDULE} icon={<Calendar size={18} />} label="Master Schedule" />
                  
                  <div className="my-4 pt-4 border-t border-slate-800/50">
                     <p className="px-2 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operations</p>
                     <NavItem view={AppView.OPERATIONS} icon={<Plane size={18} />} label="Ops & Delegations" />
                     <NavItem view={AppView.CONCIERGE} icon={<BellRing size={18} />} label="Service Gateway" />
                  </div>

                  {commonBottom}

                   <div className="mt-4 p-4 border-t border-slate-800">
                      <button onClick={() => setCurrentView(AppView.USERS)} className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700 transition-colors group">
                        <Settings className="w-4 h-4 text-slate-500 group-hover:text-white" />
                        <span className="text-sm font-medium text-slate-400 group-hover:text-white">Admin Console</span>
                      </button>
                    </div>
              </nav>
          );
      }

      return (
          <div className="flex flex-col h-full">
              {navContent}
              {logoutItem}
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-inter selection:bg-indigo-500/30">
      <aside className="hidden lg:flex w-72 flex-col border-r border-slate-800 bg-slate-900/80 backdrop-blur-xl h-screen sticky top-0">
        <AppHeader />
        {renderSidebarNav()}
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 lg:hidden flex flex-col backdrop-blur-md">
          <div className="flex justify-between items-center p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
               <div className="bg-indigo-600 p-2 rounded-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold">Kalam</h1>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-800 rounded-lg text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
              {renderSidebarNav()}
          </div>
        </div>
      )}

      <main className="flex-1 h-screen overflow-y-auto bg-slate-950 relative scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 sticky top-0 bg-slate-950/90 backdrop-blur-md z-40">
           <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm">Kalam</span>
           </div>
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-400 hover:text-white">
             <Menu className="w-6 h-6" />
           </button>
        </div>

        <div className="max-w-[1400px] mx-auto p-4 lg:p-10">
            <div className="mb-10 hidden lg:block">
                 <h2 className="text-4xl font-bold text-white tracking-tight">
                    {currentView === AppView.DASHBOARD ? (
                        currentUser.role === 'TLO' ? 'My Delegation' :
                        currentUser.role === 'OFFICIAL' ? 'Officiating Hub' : 'Command Center'
                    ) : 
                     currentView === AppView.OPERATIONS ? 'Operations Control' : 
                     currentView === AppView.SCHEDULE ? 'Strategic Timeline' :
                     currentView === AppView.CONCIERGE ? 'Service Gateway' :
                     currentView === AppView.HANDBOOK ? 'Knowledge Hub' :
                     currentView === AppView.USERS ? 'Administration' :
                     currentView === AppView.GROUPS ? 'Tournament Standings' :
                     currentView.toLowerCase().replace('_', ' ')}
                 </h2>
                 <p className="text-slate-500 mt-2 font-medium">Real-time oversight for the Junior Hockey World Cup 2025.</p>
            </div>

            {renderContent()}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
    return (
        <AppDataProvider>
            <AppContent />
        </AppDataProvider>
    );
};

export default App;