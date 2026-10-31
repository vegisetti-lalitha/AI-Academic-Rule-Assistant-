import * as pdfjsLib from 'pdfjs-dist';
import { DocumentChunk } from '../types';

// Configure worker for pdfjs in Vite
try {
  // Use cdn worker or bundled worker fallback
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker initialization warning:', e);
}

export async function parsePdfFileToChunks(
  file: File,
  category: DocumentChunk['category'] = 'Regulations'
): Promise<DocumentChunk[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdfDoc = await loadingTask.promise;

  const chunks: DocumentChunk[] = [];
  const baseTitle = file.name.replace(/\.[^/.]+$/, '');
  const timestamp = new Date().toISOString().split('T')[0];

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      // @ts-ignore
      .map((item) => (item.str ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (pageText.length > 0) {
      chunks.push({
        id: `uploaded-${Date.now()}-p${pageNum}`,
        title: baseTitle,
        category,
        pageNumber: pageNum,
        section: `Page ${pageNum} Content`,
        content: pageText,
        dateAdded: timestamp,
        isOfficial: true,
        tags: [category.toLowerCase(), 'uploaded', `page-${pageNum}`],
      });
    }
  }

  return chunks;
}
