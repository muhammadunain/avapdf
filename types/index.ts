export interface ExtractedDataPoint {
  id: string
  content: string
  type: 'text' | 'table' | 'header' | 'list' | 'financial' | 'date'
  pageNumber: number
  position: {
    x: number
    y: number
  }
  confidence: number
  metadata?: {
    category?: string
    subcategory?: string
    format?: string
  }
}

export interface AnalysisResult {
  summary: string
  dataPoints: ExtractedDataPoint[]
  totalPages: number
  documentType: string
  keyInsights: string[]
  processingTime: number
}

export interface TransactionStep {
  id: string
  title: string
  description: string
  dataPoints: ExtractedDataPoint[]
  status: 'pending' | 'processing' | 'completed' | 'error'
  transactionType: 'extract' | 'categorize' | 'validate' | 'export'
}