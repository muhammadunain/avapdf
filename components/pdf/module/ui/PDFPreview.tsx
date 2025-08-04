'use client'
import { DocumentData } from "@/types/type";
import { Download, Eye, FileCheck, ZoomIn, ZoomOut } from "lucide-react";

export const PDFPreview = ({ 
  documentData, 
  setCurrentView, 
  pdfScale, 
  setPdfScale, 
  pdfContainerRef 
}: {
  documentData: DocumentData;
  setCurrentView: (view: 'analysis' | 'review' | 'workflow') => void;
  pdfScale: number;
  setPdfScale: (scale: number) => void;
pdfContainerRef: React.RefObject<HTMLDivElement | null>;

}) => {
  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white shadow-md">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{documentData.name}</h3>
              <p className="text-sm text-gray-600">
                {documentData.pages} pages • {(documentData.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('review')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Let's Review Now
            </button>
            
            <div className="flex items-center gap-2 bg-gray-100/80 backdrop-blur-sm rounded-xl p-1">
              <button
                onClick={() => setPdfScale(Math.max(0.5, pdfScale - 0.2))}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center font-medium">
                {Math.round(pdfScale * 100)}%
              </span>
              <button
                onClick={() => setPdfScale(Math.min(3, pdfScale + 0.2))}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div 
        ref={pdfContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* PDF pages will be rendered here */}
      </div>
    </div>
  );
};