
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface HighSavingsCTAProps {
  savings: number;
}

export function HighSavingsCTA({ savings }: HighSavingsCTAProps) {
  if (savings < 500) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div>
        <h3 className="text-xl font-semibold text-zinc-100 mb-2">
          Your team may qualify for additional AI infrastructure savings.
        </h3>
        <p className="text-zinc-400">
          Our experts can help you negotiate enterprise contracts and optimize your deployment architecture.
        </p>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg border border-zinc-700 transition-colors w-full md:w-auto">
          Learn More
        </button>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-lg font-medium transition-colors w-full md:w-auto shadow-sm">
          <Calendar className="w-4 h-4" />
          Schedule Consultation
        </button>
      </div>
    </motion.div>
  );
}
