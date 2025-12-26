
import React, { useState } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { Book, FileText, Search, Map, ShieldAlert, Phone, Utensils, Download, Eye, X, File, WifiOff, Check, Loader2, Trash2 } from 'lucide-react';
import { DocumentItem } from '../types';

export const DigitalHandbook: React.FC = () => {
  const { documents, updateDocuments } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'All', label: 'All Files', icon: <Book className="w-4 h-4" /> },
    { id: 'Offline', label: 'Saved / Offline', icon: <WifiOff className="w-4 h-4" /> },
    { id: 'Regulations', label: 'Regulations', icon: <FileText className="w-4 h-4" /> },
    { id: 'Medical', label: 'Medical', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'Transport', label: 'Transport', icon: <Map className="w-4 h-4" /> },
    { id: 'Contacts', label: 'Contacts', icon: <Phone className="w-4 h-4" /> },
    { id: 'Menus', label: 'Menus', icon: <Utensils className="w-4 h-4" /> },
  ];

  const handleToggleOffline = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    if (doc.isOffline) {
        // Remove from offline
        updateDocuments(documents.map(d => d.id === docId ? { ...d, isOffline: false } : d));
    } else {
        // Simulate Download
        setDownloadingIds(prev => new Set(prev).add(docId));
        setTimeout(() => {
            updateDocuments(documents.map(d => d.id === docId ? { ...d, isOffline: true } : d));
            setDownloadingIds(prev => {
                const next = new Set(prev);
                next.delete(docId);
                return next;
            });
        }, 1500);
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'Offline') {
        return matchesSearch && doc.isOffline;
    }
    
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Book className="w-8 h-8 text-indigo-500" />
            Digital Handbook
          </h1>
          <p className="text-slate-400">Official repository for tournament regulations, maps, and protocols.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search documents, maps, protocols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors border ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {cat.icon}
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDocs.map(doc => {
            const isDownloading = downloadingIds.has(doc.id);
            return (
              <div key={doc.id} className={`group bg-slate-800/50 backdrop-blur border rounded-xl p-5 transition-all ${
                  doc.isOffline ? 'border-indigo-500/40 shadow-lg shadow-indigo-900/10' : 'border-slate-700 hover:border-indigo-500/50'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-3 rounded-lg ${
                    doc.format === 'PDF' ? 'bg-red-500/10 text-red-400' : 
                    doc.format === 'Map' ? 'bg-emerald-500/10 text-emerald-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {doc.format === 'PDF' && <FileText className="w-6 h-6" />}
                    {doc.format === 'Map' && <Map className="w-6 h-6" />}
                    {doc.format === 'Link' && <File className="w-6 h-6" />}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        v.{doc.updated}
                      </span>
                      {doc.isOffline && (
                          <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              <Check className="w-3 h-3" /> Saved
                          </span>
                      )}
                  </div>
                </div>
                
                <h3 className="text-white font-bold mb-1 truncate group-hover:text-indigo-400 transition-colors">{doc.title}</h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2 min-h-[40px]">{doc.description}</p>
                
                <div className="flex items-center justify-between border-t border-slate-700/50 pt-4 mt-auto">
                  <span className="text-xs text-slate-500">{doc.size}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPreviewDoc(doc)}
                      className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleToggleOffline(doc.id)}
                      disabled={isDownloading}
                      className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                          doc.isOffline 
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-red-500/10 hover:text-red-400' 
                            : 'hover:bg-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title={doc.isOffline ? "Remove Offline Access" : "Download for Offline Access"}
                    >
                      {isDownloading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                      ) : doc.isOffline ? (
                          <div className="group-hover:hidden"><Check className="w-4 h-4" /></div>
                      ) : (
                          <Download className="w-4 h-4" />
                      )}
                      {doc.isOffline && <div className="hidden group-hover:block"><Trash2 className="w-4 h-4" /></div>}
                    </button>
                  </div>
                </div>
              </div>
            );
        })}

        {filteredDocs.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            {selectedCategory === 'Offline' ? (
                <>
                    <WifiOff className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No documents saved for offline access.</p>
                    <p className="text-xs mt-2">Tap the download icon on any document to save it.</p>
                </>
            ) : (
                <>
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No documents found matching "{searchQuery}"</p>
                </>
            )}
          </div>
        )}
      </div>

      {/* Document Viewer Modal (Mock) */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-4xl h-[80vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded ${previewDoc.format === 'PDF' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                   {previewDoc.format === 'PDF' ? <FileText className="w-5 h-5" /> : <Map className="w-5 h-5" />}
                </div>
                <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                        {previewDoc.title}
                        {previewDoc.isOffline && <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">OFFLINE READY</span>}
                    </h3>
                    <p className="text-xs text-slate-400">{previewDoc.description}</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 bg-slate-950 relative overflow-y-auto flex items-center justify-center">
                {previewDoc.format === 'Map' ? (
                     <div className="text-center p-8">
                        <Map className="w-24 h-24 mx-auto text-emerald-500/20 mb-4" />
                        <p className="text-slate-500">Interactive Map Viewer Module Loading...</p>
                        <div className="w-full h-64 bg-slate-900 border border-slate-800 mt-6 rounded-xl flex items-center justify-center">
                            <span className="text-xs text-slate-600">[ Map Placeholder: {previewDoc.title} ]</span>
                        </div>
                     </div>
                ) : (
                    <div className="w-full max-w-2xl h-full p-8 bg-white text-slate-900 shadow-lg mx-auto my-8 min-h-[800px]">
                        <div className="border-b-2 border-slate-200 pb-4 mb-6 flex justify-between items-end">
                            <h1 className="text-3xl font-serif font-bold text-slate-800">IIHF OFFICIAL DOCUMENT</h1>
                            <span className="text-sm font-mono text-slate-500">REF: {previewDoc.id}-2024</span>
                        </div>
                        <h2 className="text-xl font-bold mb-4">{previewDoc.title.toUpperCase()}</h2>
                        <div className="space-y-4 text-justify font-serif text-sm leading-relaxed">
                            <p><strong>1. PREAMBLE</strong></p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <p><strong>2. SCOPE OF APPLICATION</strong></p>
                            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                            <p className="p-4 bg-slate-100 border-l-4 border-slate-400 italic">
                                "This is a simulated document view for demonstration purposes within the PuckDrop application context."
                            </p>
                            <p><strong>3. AMENDMENTS</strong></p>
                            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
