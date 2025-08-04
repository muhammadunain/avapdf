'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText, Loader2, ArrowRight } from 'lucide-react'
import { ExtractedDataPoint, AnalysisResult } from '@/types'
import { formatFileSize } from '@/lib/utils'
import PDFViewer from './pdf-viewer'
import DataExtractor from './data-extractor'
import TransactionBuilder from './transaction-builder'

export default function PDFAnalyzer() {
  const [step, setStep] = useState<'upload' | 'analyze' | 'transaction'>('upload')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [selectedDataPoint, setSelectedDataPoint] = useState<ExtractedDataPoint>()
  const [error, setError] = useState<string>('')

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB')
      return
    }

    setError('')
    setPdfFile(file)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 100)

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      
      // Auto-start analysis
      setTimeout(() => {
        setIsUploading(false)
        startAnalysis(result.data)
      }, 500)

    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [])

  const startAnalysis = async (uploadData: any) => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setStep('analyze')

    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 80) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 5
        })
      }, 200)

      const response = await fetch('/api/analyze-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: uploadData.text,
          filename: uploadData.filename,
          numPages: uploadData.numPages,
        }),
      })

      clearInterval(progressInterval)
      setAnalysisProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Analysis failed')
      }

      const result = await response.json()
      setAnalysisResult(result.data)
      
      setTimeout(() => {
        setIsAnalyzing(false)
      }, 500)

    } catch (error) {
      console.error('Analysis error:', error)
      setError(error instanceof Error ? error.message : 'Analysis failed')
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  const handleDataPointClick = (dataPoint: ExtractedDataPoint) => {
    setSelectedDataPoint(dataPoint)
  }

  const handleNextStep = () => {
    if (step === 'analyze' && analysisResult) {
      setStep('transaction')
    }
  }

  const handleBackToAnalysis = () => {
    setStep('analyze')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const resetAnalyzer = () => {
    setStep('upload')
    setPdfFile(null)
    setAnalysisResult(null)
    setSelectedDataPoint(undefined)
    setError('')
    setIsUploading(false)
    setIsAnalyzing(false)
    setUploadProgress(0)
    setAnalysisProgress(0)
  }

  // Upload Step
  if (step === 'upload') {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PDF AI Analyzer
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload your PDF and let AI extract, analyze, and process your data intelligently
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            {!isUploading ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Upload PDF Document</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your PDF file here, or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF files up to 10MB
                </p>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                />
              </div>
            ) : (
              <div className="text-center">
                <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">Processing PDF</h3>
                <p className="text-muted-foreground mb-4">
                  {pdfFile && `Uploading ${pdfFile.name} (${formatFileSize(pdfFile.size)})`}
                </p>
                <Progress value={uploadProgress} className="max-w-xs mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">
                  {uploadProgress}% complete
                </p>
              </div>
            )}

            {error && (
              <Alert className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Analysis Step
  if (step === 'analyze') {
    return (
      <div className="container mx-auto p-6 h-screen">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">PDF Analysis</h1>
            <p className="text-muted-foreground">
              {pdfFile && `Analyzing ${pdfFile.name}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetAnalyzer}>
              New Upload
            </Button>
            {analysisResult && !isAnalyzing && (
              <Button onClick={handleNextStep} className="flex items-center gap-2">
                Next Step <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {isAnalyzing && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Analyzing Document with AI</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Extracting data points, categorizing content, and generating insights...
                  </p>
                  <Progress value={analysisProgress} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{analysisProgress}%</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Data Extraction */}
          <div className="space-y-4">
            <DataExtractor
              analysisResult={analysisResult}
              onDataPointClick={handleDataPointClick}
              selectedDataPoint={selectedDataPoint}
            />
          </div>

          {/* Right Panel - PDF Viewer */}
          <div>
            <PDFViewer
              pdfFile={pdfFile}
              totalPages={analysisResult?.totalPages || 1}
              highlightedPoint={selectedDataPoint}
              onPageChange={(page) => console.log('Page changed to:', page)}
            />
          </div>
        </div>
      </div>
    )
  }

  // Transaction Step
  if (step === 'transaction' && analysisResult) {
    return (
      <div className="container mx-auto p-6 h-screen">
        <TransactionBuilder
          dataPoints={analysisResult.dataPoints}
          onBack={handleBackToAnalysis}
        />
      </div>
    )
  }

  return null
}