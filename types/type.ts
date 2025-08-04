// Types
export interface PDFElement {
  id: string;
  type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'table' | 'list' | 'image' | 'text';
  content: string;
  page: number;
  position: { x: number; y: number };
  fontSize?: number;
  fontWeight?: string;
  isEditing?: boolean;
  category?: string;
  confidence?: number;
  bbox?: { x: number; y: number; width: number; height: number };
}

export interface DocumentData {
  name: string;
  size: number;
  pages: number;
  uploadTime: Date;
  elements: PDFElement[];
  fullText: string;
  pdfUrl?: string;
}

export interface ProcessingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  processing: boolean;
  icon: React.ReactNode;
  duration?: number;
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'upcoming' | 'overdue' | 'completed';
  category: string;
  relatedPage?: number;
  createdAt: Date;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'milestone' | 'event' | 'decision' | 'outcome';
  page: number;
  position: { x: number; y: number };
  relatedElements: string[];
  isEditing?: boolean;
}

export interface AnalysisResult {
  id: string;
  type: 'summary' | 'keypoints' | 'insights' | 'entities' | 'questions' | 'timeline';
  title: string;
  icon: React.ReactNode;
  content: any;
  confidence: number;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}
