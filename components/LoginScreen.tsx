import React, { useState } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { Globe, Lock, User, ArrowRight, AlertCircle, Zap } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useAppData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    attemptLogin(username, password);
  };

  const attemptLogin = (user: string, pass: string) => {
    setError('');
    setIsLoading(true);

    // Simulate network delay for realism (shorter for quick access)
    setTimeout(() => {
        const success = login(user, pass);
        if (!success) {
            setError('Invalid Credentials. Access Denied.');
            setIsLoading(false);
        }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-inter">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Branding */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-2xl mb-6 shadow-2xl shadow-indigo-500/30">
             <Globe className="w-10 h-10 text-white" />
           </div>
           <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Kalam</h1>
           <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Official Event Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
            <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Username Input */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">User ID</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="Enter authorized ID"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    type="submit"
                    disabled={isLoading || !username || !password}
                    className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 ${
                        isLoading 
                        ? 'bg-slate-800 cursor-wait' 
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98]'
                    }`}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Authenticating...
                        </span>
                    ) : (
                        <>
                            Secure Login <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>

            {/* Quick Access Grid (Dev Mode) */}
            <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dev Mode: Quick Access</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => attemptLogin('admin', 'puck2025')} className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-bold text-indigo-400 hover:text-white transition-colors">
                        Admin / Licensee
                    </button>
                    <button onClick={() => attemptLogin('ref_01', 'puck2025')} className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-bold text-amber-400 hover:text-white transition-colors">
                        Referee Portal
                    </button>
                    <button onClick={() => attemptLogin('tlo_can', 'puck2025')} className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-bold text-white hover:text-slate-200 transition-colors">
                        🇨🇦 Canada TLO
                    </button>
                    <button onClick={() => attemptLogin('tlo_usa', 'puck2025')} className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-bold text-white hover:text-slate-200 transition-colors">
                        🇺🇸 USA TLO
                    </button>
                </div>
            </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 text-center w-full">
        <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
            System Status: Nominal • Encryption: AES-256
        </p>
      </div>
    </div>
  );
};