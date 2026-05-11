import { motion } from 'framer-motion';
import { Building2, ChevronRight, Mail, PhoneCall } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function EnterpriseCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-indigo-500/30 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
        <Building2 size={120} />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4">
            Enterprise Solutions
          </div>
          <h2 className="text-3xl font-bold text-zinc-100 mb-4">Scale Your AI Operations with Confidence</h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Your organization is reaching a scale where custom enterprise agreements and consolidated AI governance can save you over 45% on license costs.
          </p>
        </div>
        
        <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={() => toast.success('Executive briefings are temporarily oversubscribed. We will open new slots soon.', { icon: '💼' })}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-zinc-100 hover:bg-white text-zinc-900 font-bold rounded-xl shadow-xl transition-all"
          >
            <Mail className="w-5 h-5" />
            Book Executive Briefing
            <ChevronRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => toast.success('Sales support portal is under maintenance. Please try again later.', { icon: '📞' })}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl border border-zinc-700 transition-all"
          >
            <PhoneCall className="w-5 h-5" />
            Contact Sales
          </button>
        </div>
      </div>
    </motion.div>
  );
}
