'use server';

import pdf from 'pdf-parse';

/**
 * Extracts text from a PDF provided as a data URI.
 * @param pdfDataUri The PDF file as a data URI.
 * @returns The extracted text content.
 */
export async function runExtractTextFromPdf(pdfDataUri: string): Promise<string> {
  const base64Data = pdfDataUri.substring(pdfDataUri.indexOf(',') + 1);
  const buffer = Buffer.from(base64Data, 'base64');
  
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('Failed to parse PDF:', error);
    throw new Error('Failed to extract text from the PDF file.');
  }
}
