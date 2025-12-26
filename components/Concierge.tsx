
import React, { useState } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { Truck, HeartPulse, Package, Coffee, Shield, Clock, CheckCircle, Circle, AlertCircle, Plus, Send } from 'lucide-react';
import { ServiceRequest } from '../types';
import { ConfirmationModal, SuccessModal } from './Modals';

export const Concierge: React.FC = () => {
  const { requests, updateRequests, currentUser } = useAppData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [newRequest, setNewRequest] = useState<Partial<ServiceRequest>>({
    type: 'Transport',
    priority: 'Normal',
    requestor: currentUser?.name || 'Team Manager',
    details: ''
  });

  // Filter requests based on role
  const displayedRequests = currentUser?.role === 'LICENSEE' 
    ? requests 
    : requests.filter(r => r.requestor.includes(currentUser?.name || '') || r.requestor === currentUser?.name);

  const initiateSubmit = () => {
    if (!newRequest.details) return;
    setIsConfirmSubmitOpen(true);
  };

  const handleConfirmedSubmit = () => {
    const request: ServiceRequest = {
      id: Date.now().toString(),
      type: newRequest.type as any,
      priority: newRequest.priority as any,
      status: 'Pending',
      requestor: currentUser?.name || 'Unknown',
      details: newRequest.details || '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    updateRequests([request, ...requests]);
    setIsFormOpen(false);
    setNewRequest({
      type: 'Transport',
      priority: 'Normal',
      requestor: currentUser?.name || 'Team Manager',
      details: ''
    });
    setShowSuccessModal(true);
  };

  const updateStatus = (id: string, newStatus: ServiceRequest['status']) => {
    updateRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Transport': return <Truck className="w-5 h-5 text-blue-400" />;
      case 'Medical': return <HeartPulse className="w-5 h-5 text-rose-400" />;
      case 'Logistics': return <Package className="w-5 h-5 text-amber-400" />;
      case 'Catering': return <Coffee className="w-5 h-5 text-emerald-400" />;
      case 'Security': return <Shield className="w-5 h-5 text-red-400" />;
      default: return <Circle className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Send className="w-8 h-8 text-indigo-500" />
            Concierge Gateway
          </h1>
          <p className="text-slate-400">
              {currentUser?.role === 'LICENSEE' 
                ? 'Central command for all incoming service requests.' 
                : 'Direct service line to the Operations Center.'}
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Request
        </button>
      </div>

      {/* New Request Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">Submit Service Request</h3>
              <p className="text-xs text-slate-400 mt-1">Direct line to Ops Command Center</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Service Type</label>
                  <select
                    value={newRequest.type}
                    onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Transport">Transport</option>
                    <option value="Medical">Medical</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Catering">Catering</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Priority Level</label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Details</label>
                <textarea
                  value={newRequest.details}
                  onChange={(e) => setNewRequest({ ...newRequest, details: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                  placeholder="Describe the requirement clearly..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-800/30">
              <button
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={initiateSubmit}
                className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20 transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation before Submission */}
      <ConfirmationModal
        isOpen={isConfirmSubmitOpen}
        onClose={() => setIsConfirmSubmitOpen(false)}
        onConfirm={handleConfirmedSubmit}
        title="Confirm Request"
        description="Are you sure you want to submit this request to the Command Center? High priority requests will trigger immediate alerts."
        confirmLabel="Yes, Submit"
        icon={Send}
        variant={newRequest.priority === 'Critical' ? 'warning' : 'primary'}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Request Submitted"
        description="Your service request has been successfully logged and dispatched to the Operations Command Center."
      />

      {/* Requests List */}
      <div className="grid gap-4">
        {displayedRequests.map((req) => (
          <div
            key={req.id}
            className={`bg-slate-800/50 backdrop-blur rounded-xl border p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-all ${
              req.status === 'Completed' ? 'border-slate-700 opacity-75' : 'border-slate-600 hover:border-indigo-500/50'
            }`}
          >
            <div className="flex items-start gap-4 flex-1">
              <div className={`p-3 rounded-xl bg-slate-800 border border-slate-700`}>
                {getIcon(req.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${
                    req.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' :
                    req.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-slate-700 text-slate-300 border-slate-600'
                  }`}>
                    {req.priority}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{req.timestamp}</span>
                </div>
                <h3 className="text-white font-medium text-lg leading-tight mb-1">{req.details}</h3>
                <p className="text-sm text-slate-400 flex items-center gap-1">
                  Requested by <span className="text-indigo-300 font-medium">{req.requestor}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-700/50 pt-4 md:pt-0">
               <div className="flex flex-col items-end mr-4">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Status</span>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                      req.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                      req.status === 'Dispatched' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-amber-500/10 text-amber-400'
                  }`}>
                      {req.status === 'Completed' && <CheckCircle className="w-4 h-4" />}
                      {req.status === 'Dispatched' && <Clock className="w-4 h-4" />}
                      {req.status === 'Pending' && <AlertCircle className="w-4 h-4" />}
                      {req.status}
                  </div>
               </div>

               {currentUser?.role === 'LICENSEE' && req.status !== 'Completed' && (
                   <div className="flex gap-2">
                       {req.status === 'Pending' && (
                           <button
                               onClick={() => updateStatus(req.id, 'Dispatched')}
                               className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 transition-colors"
                               title="Mark Dispatched"
                           >
                               <Clock className="w-5 h-5" />
                           </button>
                       )}
                       <button
                           onClick={() => updateStatus(req.id, 'Completed')}
                           className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 transition-colors"
                           title="Mark Completed"
                       >
                           <CheckCircle className="w-5 h-5" />
                       </button>
                   </div>
               )}
            </div>
          </div>
        ))}

        {displayedRequests.length === 0 && (
            <div className="text-center py-12 text-slate-500 bg-slate-800/20 rounded-xl border border-slate-800 border-dashed">
                <p>No active service requests.</p>
            </div>
        )}
      </div>
    </div>
  );
};
