'use client'
import { Globe, Loader2, Shield, Upload, Zap, FileText, CheckCircle } from "lucide-react";
import { useRef } from "react";

export const UploadScreen = ({ 
  onFileUpload, 
  isProcessing, 
  pdfLibLoaded, 
  isDragOver, 
  setIsDragOver 
}: {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
  pdfLibLoaded: boolean;
  isDragOver: boolean;
  setIsDragOver: (isDragOver: boolean) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileUpload(droppedFile);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium mb-6 border border-blue-200">
            <Zap className="w-4 h-4" />
            AI-Powered Document Analysis
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF Document Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload your PDF document to extract insights, analyze timelines, track deadlines, and get intelligent answers to your questions.
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div 
            className={`relative transition-all duration-300 ${
              isDragOver 
                ? 'bg-blue-50 border-blue-300' 
                : 'hover:bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="p-12 text-center">
              {/* Upload Icon */}
              <div className={`mx-auto w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                isDragOver ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Upload className={`w-8 h-8 ${isDragOver ? 'text-blue-600' : 'text-gray-500'}`} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload PDF Document
              </h3>
              <p className="text-gray-500 mb-8">
                Drag and drop your file here, or click to browse
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing || !pdfLibLoaded}
                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              >
                {!pdfLibLoaded ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading...
                  </>
                ) : isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Select File
                  </>
                )}
              </button>

              <p className="text-sm text-gray-400 mt-4">
                Maximum file size: 50MB
              </p>
            </div>

            {isDragOver && (
              <div className="absolute inset-0 bg-blue-50/80 border-2 border-dashed border-blue-300 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                  <p className="text-blue-700 font-medium">Drop your PDF here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Secure Processing</h4>
            <p className="text-gray-600 text-sm">Your documents are processed securely with enterprise-grade encryption.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Fast Analysis</h4>
            <p className="text-gray-600 text-sm">Get instant insights and analysis powered by advanced AI technology.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Smart Extraction</h4>
            <p className="text-gray-600 text-sm">Automatically extract key information, dates, and important details.</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm">
          {pdfLibLoaded ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-600">System Ready</span>
            </>
          ) : (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-blue-600">Initializing...</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};