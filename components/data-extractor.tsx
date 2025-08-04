'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExtractedDataPoint, AnalysisResult } from '@/types'
import { FileText, Table as TableIcon, Hash, List, DollarSign, Calendar, Eye } from 'lucide-react'

interface DataExtractorProps {
  analysisResult: AnalysisResult | null
  onDataPointClick: (dataPoint: ExtractedDataPoint) => void
  selectedDataPoint?: ExtractedDataPoint
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'table': return <TableIcon className="w-4 h-4" />
    case 'financial': return <DollarSign className="w-4 h-4" />
    case 'date': return <Calendar className="w-4 h-4" />
    case 'list': return <List className="w-4 h-4" />
    case 'header': return <Hash className="w-4 h-4" />
    default: return <FileText className="w-4 h-4" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'table': return 'bg-blue-100 text-blue-800'
    case 'financial': return 'bg-green-100 text-green-800'
    case 'date': return 'bg-purple-100 text-purple-800'
    case 'list': return 'bg-orange-100 text-orange-800'
    case 'header': return 'bg-indigo-100 text-indigo-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function DataExtractor({ 
  analysisResult, 
  onDataPointClick, 
  selectedDataPoint 
}: DataExtractorProps) {
  const [filter, setFilter] = useState<string>('all')

  if (!analysisResult) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <div className="text-6xl mb-4">🤖</div>
            <p>Analysis results will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const filteredDataPoints = analysisResult.dataPoints.filter(point => 
    filter === 'all' || point.type === filter
  )

  const dataTypes = ['all', ...Array.from(new Set(analysisResult.dataPoints.map(p => p.type)))]

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Document Type</h4>
              <Badge variant="secondary" className="mt-1">
                {analysisResult.documentType}
              </Badge>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Summary</h4>
              <p className="text-sm mt-1">{analysisResult.summary}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Key Insights</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysisResult.keyInsights.map((insight, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {insight}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{analysisResult.dataPoints.length} data points extracted</span>
              <span>Processed in {(analysisResult.processingTime / 1000).toFixed(1)}s</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Points */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Extracted Data Points</CardTitle>
          <div className="flex flex-wrap gap-1">
            {dataTypes.map(type => (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(type)}
                className="capitalize"
              >
                {type === 'all' ? 'All' : `${type} (${analysisResult.dataPoints.filter(p => p.type === type).length})`}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <Tabs defaultValue="list" className="h-full">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="h-full">
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {filteredDataPoints.map((dataPoint) => (
                    <Card 
                      key={dataPoint.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedDataPoint?.id === dataPoint.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => onDataPointClick(dataPoint)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {getTypeIcon(dataPoint.type)}
                              <Badge className={getTypeColor(dataPoint.type)}>
                                {dataPoint.type}
                              </Badge>
                              <Badge variant="outline">
                                Page {dataPoint.pageNumber}
                              </Badge>
                              <Badge variant="outline">
                                {Math.round(dataPoint.confidence * 100)}% confidence
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {dataPoint.content}
                            </p>
                            {dataPoint.metadata && (
                              <div className="flex gap-1 mt-2">
                                {dataPoint.metadata.category && (
                                  <Badge variant="secondary" className="text-xs">
                                    {dataPoint.metadata.category}
                                  </Badge>
                                )}
                                {dataPoint.metadata.subcategory && (
                                  <Badge variant="secondary" className="text-xs">
                                    {dataPoint.metadata.subcategory}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="table" className="h-full">
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDataPoints.map((dataPoint) => (
                      <TableRow 
                        key={dataPoint.id}
                        className={`cursor-pointer ${
                          selectedDataPoint?.id === dataPoint.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => onDataPointClick(dataPoint)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(dataPoint.type)}
                            <Badge className={getTypeColor(dataPoint.type)}>
                              {dataPoint.type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate">{dataPoint.content}</p>
                        </TableCell>
                        <TableCell>{dataPoint.pageNumber}</TableCell>
                        <TableCell>{Math.round(dataPoint.confidence * 100)}%</TableCell>
                        <TableCell>
                          {dataPoint.metadata?.category || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}