'use client'
import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, FileText, Loader2, ChevronRight, ChevronLeft, Eye, List, 
  Table, Heading1, Heading2, Type, Hash, Edit3, Save, X, Bot, 
  Sparkles, FileCheck, Search, Filter, RotateCcw, ZoomIn, ZoomOut,
  Download, Copy, Check, Clock, Calendar, MapPin, Users, Building,
  DollarSign, Trash2, Plus, AlertCircle, ArrowRight, Play, Pause,
  CheckCircle, Target, BookOpen, BarChart3, TrendingUp, FileX,
  Settings, Share2, Star, Globe, Shield, Zap, MessageSquare,
  Brain, Lightbulb, Activity, Database, PieChart, Send, RefreshCw,
  Calendar as CalendarIcon, Timer, Flag, AlertTriangle, CheckSquare,
  Layout, Workflow, Rocket, Layers, Grid, Filter as FilterIcon
} from 'lucide-react';
import { DocumentData, ProcessingStep } from '@/types/type';
import { ProcessingSteps } from './ProcessingSteps';
import { ProgressBar } from './ProgressBar';


// Header Component
export const Header = ({ 
  documentData, 
  currentView, 
  setCurrentView, 
  isProcessing, 
  processingSteps, 
  currentStep, 
  processingProgress 
}: {
  documentData: DocumentData | null;
  currentView: 'analysis' | 'review' | 'workflow';
  setCurrentView: (view: 'analysis' | 'review' | 'workflow') => void;
  isProcessing: boolean;
  processingSteps: ProcessingStep[];
  currentStep: number;
  processingProgress: number;
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                PDF Analyzer Pro
              </h1>
              <p className="text-sm text-gray-600">AI-Powered Document Intelligence</p>
            </div>
          </div>
          
          {documentData && (
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              {[
                { id: 'analysis', label: 'Analysis', icon: <Brain className="w-4 h-4" /> },
                { id: 'review', label: 'Review', icon: <Eye className="w-4 h-4" /> },
                { id: 'workflow', label: 'Workflow', icon: <Workflow className="w-4 h-4" /> }
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentView === view.id
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {view.icon}
                  {view.label}
                </button>
              ))}
            </div>
          )}
          
          {isProcessing && (
            <ProcessingSteps 
              steps={processingSteps} 
              currentStep={currentStep} 
            />
          )}
        </div>
        
        {isProcessing && processingProgress > 0 && (
          <ProgressBar progress={processingProgress} />
        )}
      </div>
    </div>
  );
};