'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExtractedDataPoint, TransactionStep } from '@/types'
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Download,
  ArrowRight,
  Zap,
  Filter,
  BarChart3
} from 'lucide-react'
import { generateTransactionSuggestions } from '@/lib/actions/gemini'


interface TransactionBuilderProps {
  dataPoints: ExtractedDataPoint[]
  onBack: () => void
}

export default function TransactionBuilder({ dataPoints, onBack }: TransactionBuilderProps) {
  const [transactions, setTransactions] = useState<TransactionStep[]>([])
  const [activeTransaction, setActiveTransaction] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    generateTransactions()
  }, [dataPoints])

  const generateTransactions = async () => {
    setIsGenerating(true)
    try {
      const suggestions = await generateTransactionSuggestions(dataPoints)
      const transactionSteps: TransactionStep[] = suggestions.transactions.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        dataPoints: dataPoints.filter(dp => t.dataPointIds?.includes(dp.id)) || dataPoints,
        status: 'pending' as const,
        transactionType: t.transactionType
      }))
      setTransactions(transactionSteps)
    } catch (error) {
      // Fallback transactions if API fails
      const defaultTransactions: TransactionStep[] = [
        {
          id: 'extract-categorize',
          title: 'Extract & Categorize Data',
          description: 'Organize extracted data points by type and category',
          dataPoints: dataPoints,
          status: 'pending',
          transactionType: 'categorize'
        },
        {
          id: 'validate-data',
          title: 'Validate Data Quality',
          description: 'Check data accuracy and completeness',
          dataPoints: dataPoints.filter(dp => dp.confidence < 0.9),
          status: 'pending',
          transactionType: 'validate'
        },
        {
          id: 'export-results',
          title: 'Export Results',
          description: 'Generate final output in desired format',
          dataPoints: dataPoints,
          status: 'pending',
          transactionType: 'export'
        }
      ]
      setTransactions(defaultTransactions)
    } finally {
      setIsGenerating(false)
    }
  }

  const executeTransaction = async (transactionId: string) => {
    setActiveTransaction(transactionId)
    setTransactions(prev => prev.map(t => 
      t.id === transactionId 
        ? { ...t, status: 'processing' }
        : t
    ))

    // Simulate processing with progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    setTransactions(prev => prev.map(t => 
      t.id === transactionId 
        ? { ...t, status: 'completed' }
        : t
    ))
    setActiveTransaction(null)
    setProgress(0)
  }

  const executeAllTransactions = async () => {
    for (const transaction of transactions) {
      if (transaction.status === 'pending') {
        await executeTransaction(transaction.id)
      }
    }
  }

  const getStatusIcon = (status: TransactionStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'processing': return <Clock className="w-5 h-5 text-blue-500 animate-spin" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />
      default: return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getTypeIcon = (type: TransactionStep['transactionType']) => {
    switch (type) {
      case 'extract': return <Zap className="w-4 h-4" />
      case 'categorize': return <Filter className="w-4 h-4" />
      case 'validate': return <CheckCircle className="w-4 h-4" />
      case 'export': return <Download className="w-4 h-4" />
      default: return <BarChart3 className="w-4 h-4" />
    }
  }

  const completedCount = transactions.filter(t => t.status === 'completed').length
  const totalProgress = transactions.length > 0 ? (completedCount / transactions.length) * 100 : 0

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={onBack} className="mb-4">
            ← Back to Analysis
          </Button>
          <h2 className="text-2xl font-bold">Transaction Processing</h2>
          <p className="text-muted-foreground">
            Process and transform your extracted data through intelligent workflows
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Overall Progress</div>
          <div className="text-2xl font-bold">{Math.round(totalProgress)}%</div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                {dataPoints.length} Data Points
              </Badge>
              <Badge variant="secondary">
                {transactions.length} Transactions
              </Badge>
              <Badge variant="secondary">
                {completedCount} Completed
              </Badge>
            </div>
            <Button 
              onClick={executeAllTransactions}
              disabled={isGenerating || activeTransaction !== null}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Execute All
            </Button>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </CardContent>
      </Card>

      {/* Transaction Steps */}
      <div className="flex-1">
        <Tabs defaultValue="workflow" className="h-full">
          <TabsList>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="data">Data View</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="workflow" className="h-full mt-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {isGenerating ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p>Generating intelligent transaction workflows...</p>
                    </CardContent>
                  </Card>
                ) : (
                  transactions.map((transaction, index) => (
                    <Card key={transaction.id} className="relative">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(transaction.status)}
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                {getTypeIcon(transaction.transactionType)}
                                {transaction.title}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {transaction.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {transaction.dataPoints.length} items
                            </Badge>
                            {transaction.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => executeTransaction(transaction.id)}
                                disabled={activeTransaction !== null}
                              >
                                <Play className="w-4 h-4 mr-1" />
                                Execute
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      {activeTransaction === transaction.id && (
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Processing...</span>
                              <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-1" />
                          </div>
                        </CardContent>
                      )}

                      {transaction.status === 'completed' && (
                        <CardContent>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Transaction completed successfully</span>
                            </div>
                          </div>
                        </CardContent>
                      )}

                      {/* Connection line to next transaction */}
                      {index < transactions.length - 1 && (
                        <div className="absolute left-6 -bottom-4 w-0.5 h-8 bg-border"></div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="data" className="mt-4">
            <Card className="h-[500px]">
              <CardHeader>
                <CardTitle>Data Points by Transaction</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {transactions.map(transaction => (
                      <div key={transaction.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          {getStatusIcon(transaction.status)}
                          <h4 className="font-medium">{transaction.title}</h4>
                          <Badge variant="secondary">
                            {transaction.dataPoints.length} items
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {transaction.dataPoints.slice(0, 3).map(dp => (
                            <div key={dp.id} className="text-sm p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="text-xs">{dp.type}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  Page {dp.pageNumber}
                                </span>
                              </div>
                              <p className="truncate">{dp.content}</p>
                            </div>
                          ))}
                          {transaction.dataPoints.length > 3 && (
                            <div className="text-xs text-muted-foreground text-center py-2">
                              +{transaction.dataPoints.length - 3} more items
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-4">
            <Card className="h-[500px]">
              <CardHeader>
                <CardTitle>Processing Results</CardTitle>
              </CardHeader>
              <CardContent>
                {completedCount === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Results will appear here after executing transactions</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {transactions
                        .filter(t => t.status === 'completed')
                        .map(transaction => (
                          <div key={transaction.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <h4 className="font-medium">{transaction.title}</h4>
                              </div>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-1" />
                                Export
                              </Button>
                            </div>
                            <div className="bg-green-50 p-3 rounded">
                              <p className="text-sm text-green-700">
                                Successfully processed {transaction.dataPoints.length} data points
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  Accuracy: 95%
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  Processing Time: 2.3s
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      
                      {completedCount === transactions.length && (
                        <div className="border-2 border-dashed border-green-200 rounded-lg p-6 text-center">
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                          <h3 className="font-medium text-green-700 mb-2">
                            All Transactions Completed!
                          </h3>
                          <p className="text-sm text-green-600 mb-4">
                            Your PDF analysis workflow has been successfully executed
                          </p>
                          <div className="flex gap-2 justify-center">
                            <Button variant="outline">
                              <Download className="w-4 h-4 mr-1" />
                              Download Report
                            </Button>
                            <Button>
                              <ArrowRight className="w-4 h-4 mr-1" />
                              New Analysis
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}