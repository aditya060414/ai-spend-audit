import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ShieldCheck, ChevronRight, Loader2, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ToolInput {
  id: string;
  toolName: string;
  currentPlan: string;
  seats: number;
  monthlyCost: number;
}

const COMMON_TOOLS = [
  'Cursor',
  'GitHub Copilot',
  'Claude',
  'ChatGPT',
  'Midjourney',
  'Perplexity',
  'Notion AI',
];

export function LandingPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamSize, setTeamSize] = useState<number>(10);
  const [useCases, setUseCases] = useState<string>('coding');
  const [tools, setTools] = useState<ToolInput[]>([
    { id: crypto.randomUUID(), toolName: 'Cursor', currentPlan: 'Business', seats: 10, monthlyCost: 400 },
  ]);

  const handleAddTool = () => {
    setTools([
      ...tools,
      { id: crypto.randomUUID(), toolName: '', currentPlan: 'Pro', seats: 1, monthlyCost: 0 }
    ]);
  };

  const handleRemoveTool = (id: string) => {
    setTools(tools.filter(t => t.id !== id));
  };

  const handleUpdateTool = (id: string, field: keyof ToolInput, value: any) => {
    setTools(tools.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const currentMonthlySpend = tools.reduce((acc, t) => acc + (Number(t.monthlyCost) || 0), 0);
  const annualSpend = currentMonthlySpend * 12;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tools.length === 0) {
      toast.error('Please add at least one tool.');
      return;
    }

    const validTools = tools.filter(t => t.toolName.trim() !== '' && t.monthlyCost > 0);
    if (validTools.length === 0) {
      toast.error('Please complete the tool details.');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Running AI Audit Engine...');

    try {
      const response = await api.post('/api/audit', {
        teamSize,
        useCases,
        tools: validTools.map(t => ({
          toolName: t.toolName,
          currentPlan: t.currentPlan,
          seats: Number(t.seats),
          monthlyCost: Number(t.monthlyCost)
        }))
      });

      const { shareId } = response.data;
      
      // Store ownership in localStorage
      const existingData = JSON.parse(localStorage.getItem(`report_${shareId}`) || '{}');
      localStorage.setItem(`report_${shareId}`, JSON.stringify({ ...existingData, isOwner: true }));
      
      toast.success('Audit complete!', { id: loadingToast });
      navigate(`/report/${shareId}`);
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to generate audit.', { id: loadingToast });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-emerald-500/30 font-sans pb-24">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-indigo-500/10 via-zinc-900/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_0%,#18181b_0%,transparent_100%)]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-xs font-medium text-zinc-300 mb-6">
            <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI-Powered Financial Optimization</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400">
            Audit Your AI Software Spend
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Discover hidden savings, eliminate redundant tools, and optimize seat counts in seconds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: Team Info */}
          <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <h2 className="text-lg font-semibold text-zinc-100 mb-6 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 border border-zinc-700">1</span>
              Team Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Total Team Size</label>
                <input 
                  type="number" 
                  min="1"
                  value={teamSize}
                  onChange={e => setTeamSize(parseInt(e.target.value) || 1)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Primary Use Case</label>
                <div className="relative">
                  <select
                    value={useCases}
                    onChange={e => setUseCases(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 appearance-none transition-colors"
                  >
                    <option value="coding">Engineering / Coding</option>
                    <option value="writing">Content / Writing</option>
                    <option value="research">Research / Analysis</option>
                    <option value="data">Data Science</option>
                    <option value="mixed">Mixed Teams</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 rotate-90 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Tools */}
          <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 border border-zinc-700">2</span>
                AI Tools Stack
              </h2>
            </div>

            <div className="space-y-4 mb-6">
              <AnimatePresence initial={false}>
                {tools.map((tool) => (
                  <motion.div 
                    key={tool.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/80"
                  >
                    <div className="col-span-1 md:col-span-4">
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Tool Name</label>
                      <input 
                        type="text" 
                        list="common-tools"
                        placeholder="e.g. ChatGPT"
                        value={tool.toolName}
                        onChange={e => handleUpdateTool(tool.id, 'toolName', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-3">
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Plan</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Team"
                        value={tool.currentPlan}
                        onChange={e => handleUpdateTool(tool.id, 'currentPlan', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Seats</label>
                      <input 
                        type="number" 
                        min="1"
                        value={tool.seats}
                        onChange={e => handleUpdateTool(tool.id, 'seats', parseInt(e.target.value) || 0)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Cost/mo ($)</label>
                      <input 
                        type="number" 
                        min="0"
                        value={tool.monthlyCost || ''}
                        onChange={e => handleUpdateTool(tool.id, 'monthlyCost', parseInt(e.target.value) || 0)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-1 flex justify-end">
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTool(tool.id)}
                        className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Remove tool"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button 
              type="button" 
              onClick={handleAddTool}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-zinc-300 rounded-lg transition-colors border border-zinc-700 hover:border-zinc-600"
            >
              <Plus className="w-4 h-4" />
              Add Tool
            </button>
            <datalist id="common-tools">
              {COMMON_TOOLS.map(t => <option key={t} value={t} />)}
            </datalist>
          </div>

          {/* SECTION 3: Live Summary & Submit */}
          <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex flex-wrap items-center gap-6 md:gap-8 w-full md:w-auto">
                 <div>
                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Monthly Spend</p>
                   <p className="text-3xl font-bold text-zinc-100">${currentMonthlySpend.toLocaleString()}</p>
                 </div>
                 <div className="h-10 w-px bg-zinc-800 hidden md:block"></div>
                 <div>
                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Annual Run Rate</p>
                   <p className="text-3xl font-bold text-zinc-100">${annualSpend.toLocaleString()}</p>
                 </div>
                 
                 {currentMonthlySpend > 100 && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                   >
                     <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-0.5">Est. Savings</p>
                     <p className="text-sm font-bold text-emerald-400">Up to 35%</p>
                   </motion.div>
                 )}
               </div>

               <div className="w-full md:w-auto shrink-0 flex flex-col items-center md:items-end">
                  <button 
                    type="submit" 
                    disabled={isSubmitting || tools.length === 0}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-bold rounded-xl shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing Spend...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Run AI Audit
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-zinc-500 mt-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" /> Secure and confidential.
                  </p>
               </div>
             </div>
          </div>
          
        </form>
      </div>
    </div>
  );
}
