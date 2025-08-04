// app/api/upload-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromPDF } from '@/lib/pdf-processor'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
     
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
 
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }
 
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
 
    console.log('Processing PDF:', file.name, 'Size:', file.size)
    
    const pdfData = await extractTextFromPDF(buffer)
    
    console.log('PDF processed successfully, pages:', pdfData.numPages)
 
    return NextResponse.json({
      success: true,
      data: {
        filename: file.name,
        size: file.size,
        text: pdfData.text,
        numPages: pdfData.numPages,
        info: pdfData.info
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}