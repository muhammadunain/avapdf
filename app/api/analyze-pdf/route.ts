import { NextRequest, NextResponse } from 'next/server'
import { estimateTextPosition } from '@/lib/pdf-processor'
import { generateId } from '@/lib/utils'
import { analyzeDocumentWithGemini } from '@/lib/actions/gemini'

export async function POST(request: NextRequest) {
  try {
    const { text, filename, numPages } = await request.json()

    if (!text || !filename) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const startTime = Date.now()
    const analysisResult = await analyzeDocumentWithGemini(text, filename)
    const processingTime = Date.now() - startTime

    // Enhance data points with better positioning
    const enhancedDataPoints = analysisResult.dataPoints.map((point: any) => ({
      ...point,
      id: point.id || generateId(),
      position: point.position || estimateTextPosition(point.content, text, point.pageNumber || 1),
      confidence: point.confidence || 0.8
    }))

    const result = {
      summary: analysisResult.summary,
      dataPoints: enhancedDataPoints,
      totalPages: numPages,
      documentType: analysisResult.documentType,
      keyInsights: analysisResult.keyInsights || [],
      processingTime
    }

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze PDF' },
      { status: 500 }
    )
  }
}