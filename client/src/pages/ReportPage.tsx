import { useEffect, useState } from 'react';
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
  
  const [accessLevel, setAccessLevel] = useState({
    isOwner: false,
    isLead: false,
    isHighValue: false,
  });

  const [showLeadCapture, setShowLeadCapture] = useState(false);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/api/reports/${shareId}`);
      setData(response.data);
      
      // Check local storage for access levels
      const localData = JSON.parse(localStorage.getItem(`report_${shareId}`) || '{}');
      const currentAccess = {
        isOwner: !!localData.isOwner,
        isLead: !!localData.isLead || !response.data.isGated, // If not gated, they have lead access
        isHighValue: !!localData.isHighValue,
      };
      setAccessLevel(currentAccess);
      
      // Show lead capture if the report is gated on the server
      if (response.data.isGated && !currentAccess.isLead) {
        setShowLeadCapture(true);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Report not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shareId) {
      fetchReport();
    }
  }, [shareId]);

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
    <>
      <ReportDashboard data={data} accessLevel={accessLevel} />
      
      {showLeadCapture && data && shareId && (
        <LeadCaptureModal 
          shareId={shareId}
          totalSavings={data.auditResults.totalMonthlySavings}
          onSuccess={handleLeadCaptured}
          onClose={() => setShowLeadCapture(false)}
        />
      )}
    </>
  );
}
