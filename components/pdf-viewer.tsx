'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import { ExtractedDataPoint } from '@/types'

interface PDFViewerProps {
  pdfFile: File | null
  totalPages: number
  highlightedPoint?: ExtractedDataPoint
  onPageChange?: (page: number) => void
}

export default function PDFViewer({ 
  pdfFile, 
  totalPages, 
  highlightedPoint,
  onPageChange 
}: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [pdfUrl, setPdfUrl] = useState<string>('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (pdfFile) {
      const url = URL.createObjectURL(pdfFile)
      setPdfUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [pdfFile])

  useEffect(() => {
    if (highlightedPoint && highlightedPoint.pageNumber !== currentPage) {
      setCurrentPage(highlightedPoint.pageNumber)
      onPageChange?.(highlightedPoint.pageNumber)
    }
  }, [highlightedPoint, currentPage, onPageChange])

  const handlePrevPage = () => {
    const newPage = Math.max(1, currentPage - 1)
    setCurrentPage(newPage)
    onPageChange?.(newPage)
  }

  const handleNextPage = () => {
    const newPage = Math.min(totalPages, currentPage + 1)
    setCurrentPage(newPage)
    onPageChange?.(newPage)
  }

  const handleZoomIn = () => setZoom(prev => Math.min(3, prev + 0.25))
  const handleZoomOut = () => setZoom(prev => Math.max(0.5, prev - 0.25))

  if (!pdfFile) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="text-6xl mb-4">📄</div>
          <p>Upload a PDF to view</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 relative">
        <ScrollArea className="h-full">
          <div className="p-4">
            <div 
              className="relative border rounded-lg overflow-hidden bg-white shadow-sm"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
            >
              <iframe
                ref={iframeRef}
                src={`${pdfUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-[800px] border-0"
                title="PDF Viewer"
              />
              
              {/* Highlight overlay for selected data point */}
              {highlightedPoint && highlightedPoint.pageNumber === currentPage && (
                <div
                  className="absolute bg-yellow-300 bg-opacity-30 border-2 border-yellow-500 rounded animate-pulse"
                  style={{
                    left: `${highlightedPoint.position.x}px`,
                    top: `${highlightedPoint.position.y}px`,
                    width: '200px',
                    height: '20px',
                    zIndex: 10
                  }}
                />
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
}