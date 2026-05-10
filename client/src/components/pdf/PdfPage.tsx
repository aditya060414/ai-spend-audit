import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import type { ThemeConfig } from './theme';

interface PdfPageProps {
  children: ReactNode;
  className?: string;
  pageNumber?: number;
  totalPages?: number;
  theme: ThemeConfig;
  includeFooter?: boolean;
}

export function PdfPage({ children, className, pageNumber, totalPages, theme, includeFooter = true }: PdfPageProps) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div 
      className={cn(
        "pdf-page-container relative flex flex-col overflow-hidden",
        theme.pageBg,
        theme.textPrimary,
        className
      )}
      style={{
        width: '210mm',
        height: 'auto',
        minHeight: '297mm', 
        padding: '28mm', 
      }}
    >
      <div className="flex-1 flex flex-col relative z-10">
        {children}
      </div>

      {/* Footer / Dynamic Page Numbering */}
      {includeFooter && pageNumber !== undefined && (
        <div className={cn("mt-6 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-t pt-4 opacity-60", theme.textMuted, theme.borderSecondary)}>
          <span>AI Spend Audit</span>
          <span className="font-mono">
            Page {pageNumber} {totalPages ? `of ${totalPages}` : ''}
          </span>
          <span>{dateStr} • {timeStr}</span>
        </div>
      )}
    </div>
  );
}
