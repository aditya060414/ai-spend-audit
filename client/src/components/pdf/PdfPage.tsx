import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import type { ThemeConfig } from './theme';

interface PdfPageProps {
  children: ReactNode;
  className?: string;
  pageNumber?: number;
  theme: ThemeConfig;
  includeFooter?: boolean;
}

export function PdfPage({ children, className, pageNumber, theme, includeFooter = true }: PdfPageProps) {
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
        minHeight: '100mm', // Just a sensible minimum
        padding: '20mm', // standard A4 margin
      }}
    >
      <div className="flex-1 flex flex-col relative z-10">
        {children}
      </div>

      {/* Footer / Page Number */}
      {includeFooter && pageNumber !== undefined && (
        <div className={cn("mt-6 flex justify-between items-center text-xs font-mono border-t pt-4", theme.textMuted, theme.borderSecondary)}>
          <span>AI Spend Audit Report</span>
          <span>Page {pageNumber}</span>
          <span>Generated {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      )}
    </div>
  );
}
