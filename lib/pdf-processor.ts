// lib/pdf-processor.ts
import * as fs from 'fs'
import * as path from 'path'
import PdfParse from 'pdf-parse'
export async function extractTextFromPDF(buffer: Buffer) {
  try {
    // Dynamic import to avoid build issues
    
    const data = await PdfParse(buffer, {
      // Disable external file loading that causes the error
      max: 0,
      version: 'v1.10.100'
    })
    
    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
      metadata: data.metadata
    }
  } catch (error) {
    console.error('PDF parsing error:', error)
    throw new Error('Failed to parse PDF')
  }
}

export function estimateTextPosition(text: string, pageText: string, pageNumber: number) {
  const lines = pageText.split('\n')
  const textIndex = pageText.indexOf(text)
   
  if (textIndex === -1) {
    return { x: 0, y: 0 }
  }
 
  // Rough estimation of position based on text index
  const beforeText = pageText.substring(0, textIndex)
  const linesBefore = beforeText.split('\n').length - 1
  const charInLine = beforeText.length - beforeText.lastIndexOf('\n') - 1
 
  return {
    x: Math.min(charInLine * 8, 500), // Rough character width estimation
    y: Math.min(linesBefore * 20, 700) // Rough line height estimation
  }
}