import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { ReportDashboard } from '../components/ReportDashboard';
import type { ReportData } from '../types';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { LeadCaptureModal } from '../components/LeadCaptureModal'; 


export function ReportPage() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [accessLevel, setAccessLevel] = useState(() => {
    const localData = JSON.parse(localStorage.getItem(`report_${shareId}`) || '{}');
    return {
      isOwner: !!localData.isOwner,
      isLead: !!localData.isLead, 
      isHighValue: !!localData.isHighValue,
    };
  });

  const [showLeadCapture, setShowLeadCapture] = useState(false);

  const fetchReport = useCallback(async () => {
    try {
      const response = await api.get(`/api/reports/${shareId}`);
      setData(response.data);
      
      // Update lead status if already captured on server
      if (response.data.isLeadCaptured && !accessLevel.isLead) {
        setAccessLevel(prev => ({ ...prev, isLead: true }));
      }

    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Report not found.');
    } finally {
      setLoading(false);
    }
  }, [shareId, accessLevel.isLead]);

  useEffect(() => {
    if (shareId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchReport();
    }
  }, [shareId, fetchReport]);

  // Removed automatic lead capture timer to make it completely optional.
  // Lead capture is now only triggered by user actions (Share/Export).

  // Listen for manual lead capture triggers (from Share/Export)
  useEffect(() => {
    const handleTrigger = () => {
      if (!accessLevel.isLead) {
        setShowLeadCapture(true);
      }
    };
    window.addEventListener('trigger-lead-capture', handleTrigger);
    return () => window.removeEventListener('trigger-lead-capture', handleTrigger);
  }, [accessLevel.isLead]);

  const handleLeadCaptured = (isHighValue: boolean) => {
    const newAccess = { isOwner: true, isLead: true, isHighValue };
    setAccessLevel(newAccess);
    localStorage.setItem(`report_${shareId}`, JSON.stringify(newAccess));
    setShowLeadCapture(false);
    fetchReport(); // Re-fetch to get the full (un-gated) data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
        <p className="text-sm font-medium tracking-wide uppercase">Loading Report...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-100 mb-2">Report Unavailable</h2>
          <p className="text-zinc-400 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Create New Audit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button 
          onClick={() => navigate('/')}
          className="group inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Audit
        </button>
      </div>

      <ReportDashboard data={data} accessLevel={accessLevel} />
      
      {showLeadCapture && data && shareId && (
        <LeadCaptureModal 
          shareId={shareId}
          totalSavings={data.auditResults.totalMonthlySavings}
          onSuccess={handleLeadCaptured}
          onClose={() => setShowLeadCapture(false)}
        />
      )}
    </div>
  );
}
