'use server';

const pdf = require('pdf-parse');

export async function uploadPDF(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    if (file.type !== 'application/pdf') {
      return { success: false, error: 'Invalid file type. Please upload a PDF.' };
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Parse PDF
    const data = await pdf(buffer);
    
    return {
      success: true,
      content: data.text.trim(),
      pages: data.numpages
    };
  } catch (error) {
    console.error('PDF processing error:', error);
    return {
      success: false,
      error: 'Failed to process PDF. Please make sure it\'s a valid PDF file.'
    };
  }
}