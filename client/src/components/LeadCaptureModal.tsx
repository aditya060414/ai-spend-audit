import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, TrendingDown, Building2, User, ChevronLeft } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface LeadCaptureModalProps {
  shareId: string;
  totalSavings: number;
  onSuccess: (isHighValue: boolean) => void;
  onClose: () => void;
}

type Step = 'type-select' | 'individual' | 'company';

export function LeadCaptureModal({ shareId, totalSavings, onSuccess, onClose }: LeadCaptureModalProps) {
  const [step, setStep] = useState<Step>('type-select');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/api/leads', {
        shareId,
        email,
        companyName: step === 'company' ? companyName : undefined,
        role: step === 'company' ? role : undefined,
      });

      toast.success('Your comprehensive audit is unlocked!');
      onSuccess(response.data.isHighValue || false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit details.');
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#09090b] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Accent bar */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500" />

          {/* Back button */}
          {step !== 'type-select' && (
            <button
              onClick={() => setStep('type-select')}
              className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-8">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-5 border border-emerald-500/20">
              <TrendingDown className="w-6 h-6 text-emerald-400" />
            </div>

            <AnimatePresence mode="wait">

              {/* ── STEP 1: Type Select ── */}
              {step === 'type-select' && (
                <motion.div
                  key="type-select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-2xl font-bold text-zinc-100 mb-2">Unlock Your Full Report</h2>
                  <p className="text-sm text-zinc-400 mb-7">
                    We found&nbsp;
                    <strong className="text-emerald-400">${totalSavings.toLocaleString()}/mo</strong>
                    &nbsp;in potential savings. Who are you optimizing for?
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setStep('individual')}
                      className="flex flex-col items-center gap-3 p-5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-xl transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors border border-zinc-700">
                        <User className="w-5 h-5 text-zinc-300" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-zinc-100">Individual</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Just me</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setStep('company')}
                      className="flex flex-col items-center gap-3 p-5 bg-zinc-900 border border-zinc-700 hover:border-emerald-600 rounded-xl transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center transition-colors border border-emerald-500/20">
                        <Building2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-zinc-100">Company</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Team / org</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2a: Individual ── */}
              {step === 'individual' && (
                <motion.form
                  key="individual"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-4 mt-1"
                >
                  <div>
                    <h2 className="text-xl font-bold text-zinc-100 mb-1">Send me the report</h2>
                    <p className="text-sm text-zinc-400 mb-5">We'll email you the full audit breakdown instantly.</p>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                      placeholder="you@email.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-900 font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send My Report'}
                  </button>
                  <p className="text-center text-[10px] text-zinc-600">We'll never share your email.</p>
                </motion.form>
              )}

              {/* ── STEP 2b: Company ── */}
              {step === 'company' && (
                <motion.form
                  key="company"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-4 mt-1"
                >
                  <div>
                    <h2 className="text-xl font-bold text-zinc-100 mb-1">Enterprise Report</h2>
                    <p className="text-sm text-zinc-400 mb-5">
                      Tell us about your organization to receive a tailored enterprise audit report.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Your Role</label>
                      <input
                        type="text"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
                        placeholder="CTO, VP Eng..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Team Size</label>
                      <input
                        type="number"
                        value={teamSize}
                        onChange={e => setTeamSize(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
                        placeholder="50"
                        min="1"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !email || !companyName}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-900 font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Enterprise Report'}
                  </button>
                  <p className="text-center text-[10px] text-zinc-600">Your data is secure and confidential.</p>
                </motion.form>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
