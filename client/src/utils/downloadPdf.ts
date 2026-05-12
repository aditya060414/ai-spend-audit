import type { PdfQuality } from '../types';

/**
 * Captures dedicated A4 HTML elements and downloads them as a high-quality PDF.
 * @param containerId The ID of the container holding the PDF pages.
 * @param filename The name of the downloaded PDF file.
 * @param quality The quality setting (standard/high) to optimize file size.
 */
export async function downloadPdf(
  containerId: string, 
  filename: string, 
  qualityLevel: PdfQuality = 'standard',
  bgColor: string = '#ffffff'
): Promise<void> {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container with id '${containerId}' not found.`);
  }

  // Find all individual pages inside the container
  const pages = Array.from(container.querySelectorAll('.pdf-page-container')) as HTMLElement[];
  
  if (pages.length === 0) {
    throw new Error("No elements with class '.pdf-page-container' found.");
  }

  const { default: jsPDF } = await import('jspdf');
  const { toJpeg } = await import('html-to-image');

  // Initialize PDF (A4 portrait)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();

  const pixelRatio = qualityLevel === 'high' ? 4 : qualityLevel === 'standard' ? 2 : 1.2;
  const imageQuality = qualityLevel === 'low' ? 0.7 : 0.95;

  // Capture and add each page sequentially
  for (let i = 0; i < pages.length; i++) {
    const pageElement = pages[i];
    
    // Ensure it's fully visible for capture
    const originalOverflow = pageElement.style.overflow;
    pageElement.style.overflow = 'visible';

    // Calculate aspect ratio to avoid stretching
    const ratio = pageElement.offsetHeight / pageElement.offsetWidth;
    const imgHeightInMm = pdfWidth * ratio;

    // Capture page
    const imgData = await toJpeg(pageElement, {
      quality: imageQuality,
      pixelRatio: pixelRatio, 
      backgroundColor: bgColor,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      }
    });

    pageElement.style.overflow = originalOverflow;

    if (i > 0) {
      pdf.addPage();
    }
    
    // Add to PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeightInMm, undefined, 'FAST');
  }

  pdf.save(filename);
}
