import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ShieldCheck, ChevronRight, Loader2, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import { ToolCard } from "../components/ToolCard";
import type { ToolInput } from "../types";

// to give suggestion to user
const SUPPORTED_TOOLS: Record<string, string[]> = {
  Cursor: ["Pro", "Business"],
  "GitHub Copilot": ["Pro", "Pro+", "Business", "Enterprise"],
  Claude: ["Pro", "Max", "Team", "Enterprise"],
  ChatGPT: ["Go", "Plus", "Pro", "Business", "Enterprise"],
  Windsurf: ["Pro", "Max", "Team", "Enterprise"],
  Gemini: ["Google AI Pro", "Google AI Ultra"],
  "Anthropic API": ["Build", "Scale"],
  "OpenAI API": ["Free", "Pay-as-you-go"],
  "Gemini API": ["Free", "Pay-as-you-go"],
};

const TOOL_NAMES = Object.keys(SUPPORTED_TOOLS);

// check input
// coerce - typecast
const AuditSchema = z.object({
  teamSize: z.coerce.number().min(1, "Team size must be at least 1"),
  useCases: z.string(),
  tools: z
    .array(
      z.object({
        toolName: z.string().min(1, "Tool name is required"),
        currentPlan: z.string().min(1, "Current plan is required"),
        seats: z.coerce.number().min(1, "Seats must be at least 1"),
        monthlyCost: z.coerce.number().min(0, "Cost cannot be negative"),
        usageIntensity: z.enum(["low", "medium", "high"]).optional(),
      }),
    )
    .min(1, "Add at least one tool"),
});

export function LandingPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamSize, setTeamSize] = useState<string>("");
  const [useCases, setUseCases] = useState<string>("coding");
  const [tools, setTools] = useState<ToolInput[]>([
    {
      id: crypto.randomUUID(),
      toolName: "",
      currentPlan: "",
      seats: 1,
      monthlyCost: 0,
      usageIntensity: "medium",
    },
  ]);

  const handleAddTool = () => {
    setTools([
      ...tools,
      {
        id: crypto.randomUUID(),
        toolName: "",
        currentPlan: "",
        seats: 1,
        monthlyCost: 0,
        usageIntensity: "medium",
      },
    ]);
  };

  const handleRemoveTool = (id: string) => {
    setTools(tools.filter((t) => t.id !== id));
  };

  const handleUpdateTool = (id: string, field: keyof ToolInput, value: any) => {
    setTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  // Load state on mount
  useEffect(() => {
    const saved = localStorage.getItem("audit_form_state");
    if (saved) {
      try {
        const { teamSize: s, useCases: u, tools: t } = JSON.parse(saved);
        if (s) setTeamSize(s);
        if (u) setUseCases(u);
        if (t && t.length > 0) setTools(t);
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
  }, []);

  // Save state on change
  useEffect(() => {
    const state = { teamSize, useCases, tools };
    localStorage.setItem("audit_form_state", JSON.stringify(state));
  }, [teamSize, useCases, tools]);

  const currentMonthlySpend = useMemo(
    () => tools.reduce((acc, t) => acc + (Number(t.monthlyCost) || 0), 0),
    [tools],
  );

  const annualSpend = useMemo(
    () => currentMonthlySpend * 12,
    [currentMonthlySpend],
  );

  // check is input valid or not
  const isValid = useMemo(() => {
    const result = AuditSchema.safeParse({ teamSize, useCases, tools });
    return result.success;
  }, [teamSize, useCases, tools]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = AuditSchema.safeParse({ teamSize, useCases, tools });

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      toast.error(firstError.message);
      return;
    }

    const { data: validData } = validation;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Running AI Audit Engine...");

    try {
      const response = await api.post("/api/audit", validData);

      const { shareId } = response.data;

      // Store ownership in localStorage
      const existingData = JSON.parse(
        localStorage.getItem(`report_${shareId}`) || "{}",
      );
      localStorage.setItem(
        `report_${shareId}`,
        JSON.stringify({ ...existingData, isOwner: true }),
      );

      toast.success("Audit complete!", { id: loadingToast });
      navigate(`/report/${shareId}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to generate audit.", {
        id: loadingToast,
      });
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

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-[10px] lg:text-xs font-medium text-zinc-300 mb-6">
            <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI-Powered Financial Optimization</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 leading-[1.1]">
            Audit Your AI <br className="hidden sm:block" /> Software Spend
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-[540px] mx-auto leading-relaxed">
            Discover hidden savings, eliminate redundant tools, and optimize
            seat counts in seconds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
          {/* SECTION 1: Team Info */}
          <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl p-5 lg:p-8 shadow-xl">
            <h2 className="text-base lg:text-lg font-semibold text-zinc-100 mb-6 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 border border-zinc-700">
                1
              </span>
              Team Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Total Team Size
                </label>
                <input
                  type="number"
                  min="1"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                  placeholder="e.g. 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Primary Use Case
                </label>
                <div className="relative">
                  <select
                    value={useCases}
                    onChange={(e) => setUseCases(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 appearance-none transition-colors"
                  >
                    <option value="coding">Engineering / Coding</option>
                    <option value="writing">Content / Writing</option>
                    <option value="research">Research / Analysis</option>
                    <option value="mixed">Mixed Teams</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 rotate-90 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Tools */}
          <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl p-5 lg:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base lg:text-lg font-semibold text-zinc-100 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 border border-zinc-700">
                  2
                </span>
                AI Tools Stack
              </h2>
            </div>

            <motion.div layout className="space-y-4 mb-6">
              <AnimatePresence mode="popLayout" initial={false}>
                {tools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onUpdate={handleUpdateTool}
                    onRemove={handleRemoveTool}
                    supportedTools={SUPPORTED_TOOLS}
                    toolNames={TOOL_NAMES}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            <button
              type="button"
              onClick={handleAddTool}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-zinc-300 rounded-lg transition-colors border border-zinc-700 hover:border-zinc-600"
            >
              <Plus className="w-4 h-4" />
              Add Tool
            </button>
          </div>

          {/* SECTION 3: Live Summary & Submit */}
          <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl p-5 lg:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              {isSubmitting ? (
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 md:gap-8 w-full md:w-auto animate-pulse">
                  <div className="h-10 w-24 bg-zinc-800 rounded-lg" />
                  <div className="h-10 w-px bg-zinc-800 hidden md:block" />
                  <div className="h-10 w-32 bg-zinc-800 rounded-lg" />
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 md:gap-10 w-full md:w-auto">
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                      Monthly Spend
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-zinc-100 tabular-nums">
                      ${currentMonthlySpend.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-zinc-800 hidden sm:block"></div>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                      Annual Run Rate
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-zinc-100 tabular-nums">
                      ${annualSpend.toLocaleString()}
                    </p>
                  </div>

                  {currentMonthlySpend > 100 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                    >
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-0.5">
                        Est. Savings
                      </p>
                      <p className="text-sm font-bold text-emerald-400">
                        Up to 35%
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              <div className="w-full md:w-auto shrink-0 flex flex-col items-center md:items-end">
                <button
                  data-testid="analyze-button"
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
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
