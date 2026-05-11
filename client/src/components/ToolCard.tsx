import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { ToolInput } from "../types";
import { cn } from "../lib/utils";

interface ToolCardProps {
  tool: ToolInput;
  onUpdate: (id: string, field: keyof ToolInput, value: string | number) => void;
  onRemove: (id: string) => void;
  supportedTools: Record<string, string[]>;
  toolNames: string[];
}

export function ToolCard({
  tool,
  onUpdate,
  onRemove,
  supportedTools,
  toolNames,
}: ToolCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
        mass: 1,
      }}
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-3 items-end",
        "bg-zinc-950/50 p-4 lg:p-5 rounded-xl border border-zinc-800/80 shadow-sm hover:border-zinc-700/50",
        "will-change-transform",
      )}
    >
      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
        <label htmlFor={`toolName-${tool.id}`} className="block text-[10px] lg:text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
          Tool Name
        </label>
        <input
          id={`toolName-${tool.id}`}
          type="text"
          list={`tool-suggestions-${tool.id}`}
          placeholder="e.g. Cursor, Claude…"
          value={tool.toolName}
          onChange={(e) => onUpdate(tool.id, "toolName", e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 lg:py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
        />
        <datalist id={`tool-suggestions-${tool.id}`}>
          {toolNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>

      <div className="col-span-1 lg:col-span-2">
        <label htmlFor={`currentPlan-${tool.id}`} className="block text-[10px] lg:text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
          Plan
        </label>
        <input
          id={`currentPlan-${tool.id}`}
          type="text"
          list={`plan-suggestions-${tool.id}`}
          placeholder="e.g. Pro, Business…"
          value={tool.currentPlan}
          onChange={(e) => onUpdate(tool.id, "currentPlan", e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 lg:py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
        />
        <datalist id={`plan-suggestions-${tool.id}`}>
          {(() => {
            const normalizedInput = tool.toolName.trim().toLowerCase();
            const toolKey = Object.keys(supportedTools).find(
              (key) => key.toLowerCase().includes(normalizedInput) && normalizedInput.length >= 2
            ) || Object.keys(supportedTools).find(
              (key) => key.toLowerCase() === normalizedInput
            );
            
            return (supportedTools[toolKey || ""] ?? []).map((plan) => (
              <option key={plan} value={plan} />
            ));
          })()}
        </datalist>
      </div>

      <div className="col-span-1 lg:col-span-2">
        <label htmlFor={`seats-${tool.id}`} className="block text-[10px] lg:text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
          Seats
        </label>
        <input
          id={`seats-${tool.id}`}
          type="number"
          min="1"
          value={tool.seats}
          onChange={(e) =>
            onUpdate(tool.id, "seats", parseInt(e.target.value) || 0)
          }
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 lg:py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
        />
      </div>

      <div className="col-span-1 lg:col-span-2">
        <label htmlFor={`monthlyCost-${tool.id}`} className="block text-[10px] lg:text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
          Cost/mo ($)
        </label>
        <input
          id={`monthlyCost-${tool.id}`}
          type="number"
          min="0"
          value={tool.monthlyCost || ""}
          onChange={(e) =>
            onUpdate(tool.id, "monthlyCost", parseInt(e.target.value) || 0)
          }
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 lg:py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
        />
      </div>

      <div className="col-span-1 sm:col-span-2 lg:col-span-2">
        <label className="block text-[10px] lg:text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
          Intensity
        </label>
        <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-lg h-[38px] lg:h-[36px]">
          {(["low", "medium", "high"] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onUpdate(tool.id, "usageIntensity", level)}
              className={cn(
                "flex-1 flex items-center justify-center text-[10px] font-bold uppercase rounded-md transition-all",
                (tool.usageIntensity || "medium") === level
                  ? "bg-zinc-800 text-emerald-400 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {level === "medium" ? "Med" : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex justify-end mt-2 lg:mt-0">
        <button
          type="button"
          onClick={() => onRemove(tool.id)}
          className="p-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors w-full lg:w-auto flex items-center justify-center border border-zinc-800 lg:border-none"
          title="Remove tool"
        >
          <Trash2 className="w-4 h-4 lg:w-3.5 lg:h-3.5" />
          <span className="lg:hidden ml-2 text-xs font-medium">
            Remove Tool
          </span>
        </button>
      </div>
    </motion.div>
  );
}
