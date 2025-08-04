'use client'
import { Download, Eye, FileCheck, ZoomIn, ZoomOut } from "lucide-react";

// Mock DocumentData type for demo
interface DocumentData {
  name: string;
  pages: number;
  size: number;
}

export default function PDFPreview() {
  // Mock data and state for demo
  const documentData: DocumentData = {
    name: "Contract_Agreement_Final.pdf",
    pages: 24,
    size: 2.4 * 1024 * 1024 // 2.4 MB
  };

  const pdfScale = 1.0;
  const setPdfScale = (scale: number) => console.log('Scale:', scale);
  const setCurrentView = (view: string) => console.log('View:', view);

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Document Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl text-white shadow-lg shadow-emerald-500/25">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900 text-lg tracking-tight">
                  {documentData.name}
                </h3>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    {documentData.pages} pages
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    {(documentData.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
              </div>
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-3">
              {/* Review Button */}
              <button
                onClick={() => setCurrentView('review')}
                className="group relative bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:from-blue-700 hover:via-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>Let's Review Now</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Zoom Controls */}
              <div className="flex items-center bg-slate-100/80 backdrop-blur-sm rounded-xl p-1.5 border border-slate-200/50 shadow-sm">
                <button
                  onClick={() => setPdfScale(Math.max(0.5, pdfScale - 0.2))}
                  className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 text-slate-600 hover:text-slate-800"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="px-3 py-1 min-w-[65px] text-center">
                  <span className="text-sm font-medium text-slate-700 bg-white/60 px-2 py-1 rounded-md">
                    {Math.round(pdfScale * 100)}%
                  </span>
                </div>
                <button
                  onClick={() => setPdfScale(Math.min(3, pdfScale + 0.2))}
                  className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 text-slate-600 hover:text-slate-800"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Download Button */}
              <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 text-slate-600 hover:text-slate-800 hover:shadow-sm border border-transparent hover:border-slate-200">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Content Area */}
      <div className="flex-1 overflow-y-auto p-8" style={{ scrollBehavior: 'smooth' }}>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Mock PDF Pages */}
          {[1, 2, 3].map((page) => (
            <div
              key={page}
              className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-[8.5/11] bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-300 to-slate-400 rounded-2xl mx-auto flex items-center justify-center">
                    <FileCheck className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-slate-700">
                      Page {page}
                    </h4>
                    <p className="text-sm text-slate-500 max-w-xs">
                      PDF content would be rendered here. This is a preview of how the document pages will appear.
                    </p>
                  </div>
                  {/* Mock content lines */}
                  <div className="space-y-2 mt-6">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 bg-slate-200 rounded ${
                          i === 7 ? 'w-3/4' : 'w-full'
                        } ${i % 3 === 0 ? 'bg-slate-300' : ''}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Page Number */}
              <div className="mt-4 text-center">
                <span className="inline-block bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
                  Page {page} of {documentData.pages}
                </span>
              </div>
            </div>
          ))}

          {/* Load More Indicator */}
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></div>
              <span>Loading more pages...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}