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

interface PDFElement {
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

interface DocumentData {
  name: string;
  size: number;
  pages: number;
  uploadTime: Date;
  elements: PDFElement[];
  fullText: string;
  pdfUrl?: string;
}

interface ProcessingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  processing: boolean;
  icon: React.ReactNode;
  duration?: number;
}

interface Deadline {
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

interface TimelineEvent {
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

interface AnalysisResult {
  id: string;
  type: 'summary' | 'keypoints' | 'insights' | 'entities' | 'questions' | 'timeline';
  title: string;
  icon: React.ReactNode;
  content: any;
  confidence: number;
  createdAt: Date;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

declare global {
  interface Window {
	pdfjsLib: any;
  }
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [pdfLibLoaded, setPdfLibLoaded] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfScale, setPdfScale] = useState(1.2);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<'elements' | 'analysis' | 'deadlines' | 'timeline' | 'chat'>('elements');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfPages, setPdfPages] = useState<HTMLCanvasElement[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [showDeadlineForm, setShowDeadlineForm] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showWorkflowPlanner, setShowWorkflowPlanner] = useState(false);
  const [currentView, setCurrentView] = useState<'analysis' | 'review' | 'workflow'>('analysis');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const processingSteps: ProcessingStep[] = [
	{ 
	  id: 1, 
	  title: 'Get Ready...', 
	  description: 'Preparing analysis engine', 
	  completed: false,
	  processing: false,
	  icon: <Rocket className="w-4 h-4" />,
	  duration: 1000
	},
	{ 
	  id: 2, 
	  title: 'Upload Complete', 
	  description: 'File received successfully', 
	  completed: false,
	  processing: false,
	  icon: <Upload className="w-4 h-4" />,
	  duration: 500
	},
	{ 
	  id: 3, 
	  title: 'Extract Content', 
	  description: 'Parsing document structure', 
	  completed: false,
	  processing: false,
	  icon: <FileText className="w-4 h-4" />,
	  duration: 2000
	},
	{ 
	  id: 4, 
	  title: 'AI Analysis', 
	  description: 'Generating insights with Gemini', 
	  completed: false,
	  processing: false,
	  icon: <Brain className="w-4 h-4" />,
	  duration: 3000
	},
	{ 
	  id: 5, 
	  title: 'Finalizing', 
	  description: 'Preparing results', 
	  completed: false,
	  processing: false,
	  icon: <CheckCircle className="w-4 h-4" />,
	  duration: 1000
	}
  ];

  useEffect(() => {
	// Load PDF.js library
	const script = document.createElement('script');
	script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
	script.onload = () => {
	  if (window.pdfjsLib) {
		window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
		setPdfLibLoaded(true);
	  }
	};
	document.head.appendChild(script);

	return () => {
	  if (document.head.contains(script)) {
		document.head.removeChild(script);
	  }
	};
  }, []);

  useEffect(() => {
	chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const simulateProcessingSteps = async () => {
	for (let i = 0; i < processingSteps.length; i++) {
	  const step = processingSteps[i];
	  setCurrentStep(step.id);
	  
	  // Set step as processing
	  setProcessingProgress((i / processingSteps.length) * 100);
	  
	  // Simulate step duration
	  await new Promise(resolve => setTimeout(resolve, step.duration || 1000));
	  
	  // Mark step as completed
	  setProcessingProgress(((i + 1) / processingSteps.length) * 100);
	}
  };

  const renderAllPDFPages = async (file: File) => {
	if (!window.pdfjsLib) return;

	const arrayBuffer = await file.arrayBuffer();
	const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
	setPdfDoc(pdf);
	
	const pages: HTMLCanvasElement[] = [];
	
	for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
	  const page = await pdf.getPage(pageNum);
	  const viewport = page.getViewport({ scale: pdfScale });
	  
	  const canvas = document.createElement('canvas');
	  const context = canvas.getContext('2d');
	  canvas.height = viewport.height;
	  canvas.width = viewport.width;
	  canvas.className = 'border border-gray-200 shadow-sm mb-4 rounded-lg';
	  canvas.style.maxWidth = '100%';
	  canvas.style.height = 'auto';
	  
	  await page.render({ canvasContext: context, viewport }).promise;
	  pages.push(canvas);
	}
	
	setPdfPages(pages);
	
	// Render pages in container
	if (pdfContainerRef.current) {
	  pdfContainerRef.current.innerHTML = '';
	  pages.forEach((canvas, index) => {
		const pageWrapper = document.createElement('div');
		pageWrapper.className = 'pdf-page mb-6 bg-white rounded-lg shadow-sm overflow-hidden';
		pageWrapper.setAttribute('data-page', (index + 1).toString());
		
		const pageHeader = document.createElement('div');
		pageHeader.className = 'px-4 py-2 bg-gray-50 border-b text-sm text-gray-600 font-medium';
		pageHeader.textContent = `Page ${index + 1}`;
		
		pageWrapper.appendChild(pageHeader);
		pageWrapper.appendChild(canvas);
		pdfContainerRef.current!.appendChild(pageWrapper);
	  });
	}
  };

  const scrollToElement = (element: PDFElement) => {
	if (!pdfContainerRef.current) return;
	
	const pageElement = pdfContainerRef.current.querySelector(`[data-page="${element.page}"]`);
	if (pageElement) {
	  const containerRect = pdfContainerRef.current.getBoundingClientRect();
	  const pageRect = pageElement.getBoundingClientRect();
	  const scrollTop = pdfContainerRef.current.scrollTop;
	  
	  const relativeY = (element.position.y / 800) * pageRect.height;
	  const targetScroll = scrollTop + pageRect.top - containerRect.top + relativeY - 100;
	  
	  pdfContainerRef.current.scrollTo({
		top: Math.max(0, targetScroll),
		behavior: 'smooth'
	  });
	  
	  const highlight = document.createElement('div');
	  highlight.className = 'absolute bg-yellow-200 opacity-50 pointer-events-none rounded';
	  highlight.style.left = `${element.position.x}px`;
	  highlight.style.top = `${element.position.y}px`;
	  highlight.style.width = '200px';
	  highlight.style.height = '20px';
	  highlight.style.zIndex = '10';
	  // @ts-ignore
	  pageElement.style.position = 'relative';
	  pageElement.appendChild(highlight);
	  
	  setTimeout(() => {
		if (highlight.parentNode) {
		  highlight.parentNode.removeChild(highlight);
		}
	  }, 2000);
	}
  };

  const extractPDFElements = async (file: File): Promise<{ elements: PDFElement[]; fullText: string; pages: number }> => {
	if (!window.pdfjsLib) {
	  throw new Error('PDF.js library not loaded');
	}

	const arrayBuffer = await file.arrayBuffer();
	const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
	
	let fullText = '';
	let elements: PDFElement[] = [];
	let elementId = 1;

	for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
	  const page = await pdf.getPage(pageNum);
	  const textContent = await page.getTextContent();
	  
	  textContent.items.forEach((item: any, index: number) => {
		if (item.str.trim()) {
		  const fontSize = item.transform[0];
		  const fontWeight = item.fontName?.includes('Bold') ? 'bold' : 'normal';
		  
		  let elementType: PDFElement['type'] = 'paragraph';
		  let category = 'content';
		  
		  if (fontSize > 18) {
			elementType = 'heading1';
			category = 'title';
		  } else if (fontSize > 14) {
			elementType = 'heading2';
			category = 'subtitle';
		  } else if (fontSize > 12) {
			elementType = 'heading3';
			category = 'section';
		  } else if (item.str.includes('•') || item.str.match(/^\d+\./)) {
			elementType = 'list';
			category = 'list';
		  } else if (item.str.includes('\t') || item.str.match(/\|/)) {
			elementType = 'table';
			category = 'data';
		  }

		  elements.push({
			id: `element-${elementId++}`,
			type: elementType,
			content: item.str.trim(),
			page: pageNum,
			position: { x: item.transform[4], y: item.transform[5] },
			fontSize,
			fontWeight,
			isEditing: false,
			category,
			confidence: Math.random() * 0.3 + 0.7,
			bbox: {
			  x: item.transform[4],
			  y: item.transform[5],
			  width: item.width || 100,
			  height: item.height || 20
			}
		  });

		  fullText += item.str + ' ';
		}
	  });
	}

	return { elements, fullText: fullText.trim(), pages: pdf.numPages };
  };

  const generateAnalysisResults = async (): Promise<AnalysisResult[]> => {
	await new Promise(resolve => setTimeout(resolve, 2000));
	
	// Generate sample deadlines
	const sampleDeadlines: Deadline[] = [
	  {
		id: 'deadline-1',
		title: 'Q4 Financial Report Submission',
		description: 'Submit quarterly financial report to board of directors',
		dueDate: '2025-01-15',
		priority: 'high',
		status: 'upcoming',
		category: 'Finance',
		relatedPage: 2,
		createdAt: new Date()
	  },
	  {
		id: 'deadline-2',
		title: 'Market Research Analysis',
		description: 'Complete competitive analysis and market positioning study',
		dueDate: '2025-02-01',
		priority: 'medium',
		status: 'upcoming',
		category: 'Research',
		relatedPage: 5,
		createdAt: new Date()
	  },
	  {
		id: 'deadline-3',
		title: 'Technology Implementation',
		description: 'Deploy new automation systems across all departments',
		dueDate: '2025-03-15',
		priority: 'high',
		status: 'upcoming',
		category: 'Technology',
		relatedPage: 8,
		createdAt: new Date()
	  }
	];
	
	setDeadlines(sampleDeadlines);

	// Generate sample timeline events
	const sampleTimeline: TimelineEvent[] = [
	  {
		id: 'timeline-1',
		title: 'Project Initiation',
		description: 'Strategic planning phase commenced with stakeholder alignment',
		date: '2024-01-15',
		type: 'milestone',
		page: 1,
		position: { x: 100, y: 150 },
		relatedElements: ['element-1', 'element-2']
	  },
	  {
		id: 'timeline-2',
		title: 'Market Research Completion',
		description: 'Comprehensive market analysis and competitive landscape study finished',
		date: '2024-03-22',
		type: 'event',
		page: 3,
		position: { x: 120, y: 280 },
		relatedElements: ['element-5', 'element-6']
	  },
	  {
		id: 'timeline-3',
		title: 'Technology Implementation',
		description: 'Core system upgrades and automation tools deployed',
		date: '2024-06-10',
		type: 'milestone',
		page: 6,
		position: { x: 95, y: 200 },
		relatedElements: ['element-10', 'element-11']
	  }
	];
	
	setTimelineEvents(sampleTimeline);
	
	return [
	  {
		id: 'summary-1',
		type: 'summary',
		title: 'Document Summary',
		icon: <FileText className="w-5 h-5" />,
		content: {
		  overview: 'This document contains comprehensive financial and operational data for Q4 2024, including revenue projections, market analysis, and strategic initiatives.',
		  wordCount: 2450,
		  pages: documentData?.pages || 0,
		  readingTime: '8-10 minutes',
		  mainTopics: ['Financial Performance', 'Market Analysis', 'Strategic Planning', 'Risk Assessment']
		},
		confidence: 0.94,
		createdAt: new Date()
	  },
	  {
		id: 'keypoints-1',
		type: 'keypoints',
		title: 'Key Points',
		icon: <Target className="w-5 h-5" />,
		content: {
		  points: [
			{
			  title: 'Revenue Growth',
			  description: 'Company achieved 23% year-over-year revenue growth in Q4 2024',
			  importance: 'high',
			  page: 2,
			  position: { x: 100, y: 200 }
			},
			{
			  title: 'Market Expansion',
			  description: 'Successfully entered 3 new international markets',
			  importance: 'high',
			  page: 5,
			  position: { x: 120, y: 300 }
			},
			{
			  title: 'Cost Optimization',
			  description: 'Reduced operational costs by 15% through efficiency improvements',
			  importance: 'medium',
			  page: 8,
			  position: { x: 90, y: 250 }
			}
		  ]
		},
		confidence: 0.89,
		createdAt: new Date()
	  }
	];
  };

  const handleFileUpload = async (selectedFile: File) => {
	if (!selectedFile || selectedFile.type !== 'application/pdf') {
	  alert('Please select a valid PDF file');
	  return;
	}

	if (!pdfLibLoaded) {
	  alert('PDF processing library is still loading. Please wait...');
	  return;
	}

	setIsProcessing(true);
	setFile(selectedFile);
	
	try {
	  await simulateProcessingSteps();
	  
	  const { elements, fullText, pages } = await extractPDFElements(selectedFile);
	  
	  const pdfUrl = URL.createObjectURL(selectedFile);
	  setDocumentData({
		name: selectedFile.name,
		size: selectedFile.size,
		pages,
		uploadTime: new Date(),
		elements,
		fullText,
		pdfUrl
	  });

	  await renderAllPDFPages(selectedFile);
	  const analysis = await generateAnalysisResults();
	  setAnalysisResults(analysis);
	  
	  setCurrentView('analysis');

	} catch (error) {
	  console.error('Upload error:', error);
	  alert('Failed to process PDF. Please try again.');
	} finally {
	  setIsProcessing(false);
	  setProcessingProgress(0);
	}
  };

  const handleElementClick = (element: PDFElement) => {
	setSelectedElement(element.id);
	scrollToElement(element);
  };

  const handleTimelineClick = (event: any) => {
	scrollToElement({
	  ...event,
	  id: `timeline-${event.date}`,
	  type: 'paragraph',
	  content: event.title
	});
  };

  const getFilteredElements = () => {
	if (!documentData) return [];
	
	let filtered = documentData.elements;
	
	if (searchTerm) {
	  filtered = filtered.filter(el => 
		el.content.toLowerCase().includes(searchTerm.toLowerCase())
	  );
	}
	
	return filtered;
  };

  const getElementIcon = (type: PDFElement['type']) => {
	switch (type) {
	  case 'heading1': return <Heading1 className="w-4 h-4" />;
	  case 'heading2': return <Heading2 className="w-4 h-4" />;
	  case 'heading3': return <Heading2 className="w-4 h-4" />;
	  case 'paragraph': return <Type className="w-4 h-4" />;
	  case 'table': return <Table className="w-4 h-4" />;
	  case 'list': return <List className="w-4 h-4" />;
	  default: return <FileText className="w-4 h-4" />;
	}
  };

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
	  handleFileUpload(droppedFile);
	}
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
	e.preventDefault();
	if (!chatInput.trim() || !documentData || isChatLoading) return;

	const userMessage: ChatMessage = {
	  id: Date.now().toString(),
	  type: 'user',
	  content: chatInput,
	  timestamp: new Date()
	};

	const loadingMessage: ChatMessage = {
	  id: (Date.now() + 1).toString(),
	  type: 'assistant',
	  content: '',
	  timestamp: new Date(),
	  isLoading: true
	};

	setChatMessages(prev => [...prev, userMessage, loadingMessage]);
	setChatInput('');
	setIsChatLoading(true);

	try {
	  const response = await fetch('/api/analyze', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
		  query: chatInput,
		  content: documentData.fullText,
		  documentName: documentData.name
		})
	  });

	  const data = await response.json();
	  
	  setChatMessages(prev => 
		prev.map(msg => 
		  msg.id === loadingMessage.id 
			? { ...msg, content: data.response || 'Sorry, I couldn\'t process your request.', isLoading: false }
			: msg
		)
	  );
	} catch (error) {
	  setChatMessages(prev => 
		prev.map(msg => 
		  msg.id === loadingMessage.id 
			? { ...msg, content: 'Sorry, there was an error processing your request.', isLoading: false }
			: msg
		)
	  );
	} finally {
	  setIsChatLoading(false);
	}
  };

  const addDeadline = (deadline: Omit<Deadline, 'id' | 'createdAt'>) => {
	const newDeadline: Deadline = {
	  ...deadline,
	  id: Date.now().toString(),
	  createdAt: new Date()
	};
	setDeadlines(prev => [...prev, newDeadline]);
	setShowDeadlineForm(false);
  };

  const renderAnalysisCard = (result: AnalysisResult) => {
	const { content } = result;
	
	switch (result.type) {
	  case 'summary':
		return (
		  <div className="space-y-4">
			<p className="text-gray-700 leading-relaxed">{content.overview}</p>
			<div className="grid grid-cols-2 gap-4">
			  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
				<div className="text-2xl font-bold text-blue-700">{content.wordCount}</div>
				<div className="text-sm text-blue-600">Words</div>
			  </div>
			  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
				<div className="text-2xl font-bold text-green-700">{content.pages}</div>
				<div className="text-sm text-green-600">Pages</div>
			  </div>
			  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
				<div className="text-sm font-semibold text-purple-700">{content.readingTime}</div>
				<div className="text-xs text-purple-600">Reading Time</div>
			  </div>
			  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
				<div className="text-sm font-semibold text-orange-700">{content.mainTopics.length}</div>
				<div className="text-xs text-orange-600">Main Topics</div>
			  </div>
			</div>
			<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
			  <h5 className="font-semibold text-gray-900 mb-3">Main Topics</h5>
			  <div className="flex flex-wrap gap-2">
				{content.mainTopics.map((topic: string, index: number) => (
				  <span key={index} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-sm">
					{topic}
				  </span>
				))}
			  </div>
			</div>
		  </div>
		);
		
	  case 'keypoints':
		return (
		  <div className="space-y-3">
			{content.points.map((point: any, index: number) => (
			  <div 
				key={index} 
				className="border border-gray-200 rounded-xl p-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 cursor-pointer transition-all duration-300 hover:shadow-md"
				onClick={() => handleTimelineClick(point)}
			  >
				<div className="flex items-start justify-between mb-3">
				  <h5 className="font-semibold text-gray-900">{point.title}</h5>
				  <div className="flex items-center gap-2">
					<span className={`px-2 py-1 rounded-full text-xs font-medium ${
					  point.importance === 'high' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
					  point.importance === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
					  'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
					}`}>
					  {point.importance}
					</span>
					<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
					  Page {point.page}
					</span>
				  </div>
				</div>
				<p className="text-gray-700 text-sm leading-relaxed">{point.description}</p>
			  </div>
			))}
		  </div>
		);
		
	  default:
		return <div>Content type not supported</div>;
	}
  };

  const DeadlineForm = ({ onSubmit, onCancel }: { onSubmit: (deadline: Omit<Deadline, 'id' | 'createdAt'>) => void, onCancel: () => void }) => {
	const [formData, setFormData] = useState({
	  title: '',
	  description: '',
	  dueDate: '',
	  priority: 'medium' as 'high' | 'medium' | 'low',
	  category: '',
	  status: 'upcoming' as 'upcoming' | 'overdue' | 'completed'
	});

	const handleSubmit = (e: React.FormEvent) => {
	  e.preventDefault();
	  onSubmit(formData);
	};

	return (
	  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
		  <div className="p-6 border-b border-gray-200">
			<h3 className="text-xl font-bold text-gray-900">Add New Deadline</h3>
		  </div>
		  
		  <form onSubmit={handleSubmit} className="p-6 space-y-4">
			<div>
			  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
			  <input
				type="text"
				value={formData.title}
				onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
				className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				required
			  />
			</div>
			
			<div>
			  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
			  <textarea
				value={formData.description}
				onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
				className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				rows={3}
				required
			  />
			</div>
			
			<div className="grid grid-cols-2 gap-4">
			  <div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
				<input
				  type="date"
				  value={formData.dueDate}
				  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
				  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				  required
				/>
			  </div>
			  
			  <div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
				<select
				  value={formData.priority}
				  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
				  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
				  <option value="low">Low</option>
				  <option value="medium">Medium</option>
				  <option value="high">High</option>
				</select>
			  </div>
			</div>
			
			<div>
			  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
			  <input
				type="text"
				value={formData.category}
				onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
				className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				placeholder="e.g., Finance, Research, Technology"
				required
			  />
			</div>
			
			<div className="flex gap-3 pt-4">
			  <button
				type="submit"
				className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
			  >
				Add Deadline
			  </button>
			  <button
				type="button"
				onClick={onCancel}
				className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
			  >
				Cancel
			  </button>
			</div>
		  </form>
		</div>
	  </div>
	);
  };

  return (
	<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
	  {/* Header */}
	  <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
		<div className="px-6 py-2">
		  <div className="flex items-center justify-between">
			<div className="flex items-center gap-4">
			  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
				<Sparkles className="w-7 h-7 text-white" />
			  </div>
			  <div>
				<h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
				 AVA
				</h1>
				<p className="text-sm text-gray-600">AI-Powered Document Intelligence</p>
			  </div>
			</div>
			
			{/* View Navigation */}
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
			
			{/* Progress Steps */}
			{isProcessing && (
			  <div className="flex items-center gap-2">
				{processingSteps.map((step, index) => (
				  <div key={step.id} className="flex items-center gap-2">
					<div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-500 ${
					  currentStep === step.id 
						? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110' 
						: currentStep > step.id 
						  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
						  : 'bg-gray-200 text-gray-600'
					}`}>
					  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.icon}
					</div>
					<div className="hidden lg:block">
					  <div className={`text-sm font-medium ${
						currentStep === step.id ? 'text-blue-600' : 'text-gray-600'
					  }`}>
						{step.title}
					  </div>
					  <div className="text-xs text-gray-500">{step.description}</div>
					</div>
					{index < processingSteps.length - 1 && (
					  <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
					)}
				  </div>
				))}
			  </div>
			)}
		  </div>
		  
		  {/* Progress Bar */}
		  {isProcessing && processingProgress > 0 && (
			<div className="mt-4">
			  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
				<div 
				  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500 shadow-sm"
				  style={{ width: `${processingProgress}%` }}
				/>
			  </div>
			  <p className="text-sm text-gray-600 mt-2 font-medium">Processing... {Math.round(processingProgress)}%</p>
			</div>
		  )}
		</div>
	  </div>

	  {/* Main Content */}
	  <div className="flex h-[calc(100vh-120px)]">
		{/* Upload Screen */}
		{!documentData && (
		  <div className="flex-1 flex items-center justify-center p-8">
			<div className="max-w-3xl w-full">
			  <div className="text-center mb-12">
				<div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg">
				  <Zap className="w-4 h-4" />
				  Powered by Advanced AI
				</div>
				
			  </div>

			  <div 
				className={`bg-white/70 backdrop-blur-sm cursor-pointer rounded-3xl shadow-2xl border-2 border-dashed transition-all duration-500 hover:shadow-3xl ${
				  isDragOver 
					? 'border-green-500 bg-blue-50/70 scale-105 shadow-blue-200/50' 
					: 'border-gray-300 hover:border-blue-400'
				}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			  >
				<div className="p-16 text-center">
				  <div className="mx-auto w-24 h-24 bg-gradient-to-br cursor-pointer from-blue-100 via-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
					<Upload className="w-12 h-12 text-blue-600" />
				  </div>
				  
				  <h3 className="text-3xl font-bold text-gray-900 mb-4">
					Drop your PDF here
				  </h3>
				  <p className="text-gray-600 mb-10 text-lg">
					or click to browse and select a file from your device
				  </p>
				  
				  <input
					ref={fileInputRef}
					type="file"
					accept=".pdf"
					onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
					className="hidden"
				  />
				  
				  <button
					onClick={() => fileInputRef.current?.click()}
					disabled={isProcessing || !pdfLibLoaded}
					className="bg-green-500 hover:bg-green-700 cursor-pointer text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-2 disabled:transform-none"
				  >
					{!pdfLibLoaded ? (
					  <div className="flex items-center gap-3">
						<Loader2 className="w-6 h-6 animate-spin" />
						Loading Engine...
					  </div>
					) : isProcessing ? (
					  <div className="flex items-center gap-3">
						<Loader2 className="w-6 h-6 animate-spin" />
						Processing Magic...
					  </div>
					) : (
					  <div className="flex items-center gap-3">
						<Upload className="w-6 h-6" />
						Choose PDF File
					  </div>
					)}
				  </button>

				  <div className="mt-8 text-sm text-gray-500 space-y-2">
					<div>Supports PDF files up to 50MB</div>
					<div className="flex items-center justify-center gap-6 text-xs">
					  <div className="flex items-center gap-1">
						<Shield className="w-3 h-3" />
						Secure Processing
					  </div>
					  <div className="flex items-center gap-1">
						<Zap className="w-3 h-3" />
						AI-Powered
					  </div>
					  <div className="flex items-center gap-1">
						<Globe className="w-3 h-3" />
						Cloud Ready
					  </div>
					</div>
				  </div>
				</div>
			  </div>
			</div>
		  </div>
		)}

		{/* Analysis Interface */}
		{documentData && currentView === 'analysis' && (
		  <>
			{/* Left Sidebar */}
			<div className="w-96 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col shadow-lg">
			  {/* Tab Navigation */}
			  <div className="p-4 border-b border-gray-200/50">
				<div className="flex items-center gap-1 bg-gray-100/80 backdrop-blur-sm rounded-xl p-1">
				  {[
					{ id: 'elements', label: 'Elements', icon: <FileText className="w-4 h-4" /> },
					{ id: 'analysis', label: 'Analysis', icon: <Brain className="w-4 h-4" /> },
					{ id: 'deadlines', label: 'Deadlines', icon: <Clock className="w-4 h-4" /> },
					{ id: 'timeline', label: 'Timeline', icon: <CalendarIcon className="w-4 h-4" /> },
					{ id: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> }
				  ].map((tab) => (
					<button
					  key={tab.id}
					  onClick={() => setActiveTab(tab.id as any)}
					  className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
						activeTab === tab.id
						  ? 'bg-white shadow-sm text-blue-600'
						  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
					  }`}
					>
					  {tab.icon}
					  <span className="hidden lg:inline">{tab.label}</span>
					</button>
				  ))}
				</div>
			  </div>

			  {/* Elements Tab */}
			  {activeTab === 'elements' && (
				<>
				  <div className="p-4 border-b border-gray-200/50">
					<div className="flex items-center justify-between mb-4">
					  <h3 className="text-lg font-bold text-gray-900">Document Elements</h3>
					  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
						{getFilteredElements().length}
					  </span>
					</div>
					
					<div className="relative">
					  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
					  <input
						type="text"
						placeholder="Search elements..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-3 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
					  />
					</div>
				  </div>

				  <div className="flex-1 overflow-y-auto">
					<div className="p-4 space-y-3">
					  {getFilteredElements().map((element) => (
						<div
						  key={element.id}
						  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
							selectedElement === element.id
							  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg'
							  : 'border-gray-200/50 hover:border-gray-300 bg-white/80 backdrop-blur-sm'
						  }`}
						  onClick={() => handleElementClick(element)}
						>
						  <div className="flex items-start gap-3">
							<div className={`p-2 rounded-lg ${
							  element.type === 'heading1' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
							  element.type === 'heading2' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' :
							  element.type === 'paragraph' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
							  element.type === 'table' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
							  element.type === 'list' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
							  'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
							} shadow-sm`}>
							  {getElementIcon(element.type)}
							</div>
							
							<div className="flex-1 min-w-0">
							  <div className="flex items-center justify-between mb-2">
								<span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
								  {element.type.replace(/(\d)/, ' $1')}
								</span>
								<span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
								  Page {element.page}
								</span>
							  </div>
							  
							  <p className="text-sm text-gray-900 line-clamp-2 leading-relaxed">
								{element.content}
							  </p>
							  
							  {element.confidence && (
								<div className="flex items-center gap-2 mt-3">
								  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
								  <span className="text-xs text-gray-500 font-medium">
									{Math.round(element.confidence * 100)}% confidence
								  </span>
								</div>
							  )}
							</div>
						  </div>
						</div>
					  ))}
					</div>
				  </div>
				</>
			  )}

			  {/* Analysis Tab */}
			  {activeTab === 'analysis' && (
				<div className="flex-1 overflow-y-auto">
				  <div className="p-4 space-y-4">
					{analysisResults.map((result) => (
					  <div key={result.id} className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
						<div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
						  <div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
							  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white shadow-md">
								{result.icon}
							  </div>
							  <div>
								<h4 className="font-bold text-gray-900">{result.title}</h4>
								<div className="flex items-center gap-2 mt-1">
								  <span className="text-xs text-gray-500 font-medium">
									{Math.round(result.confidence * 100)}% confidence
								  </span>
								  <span className="text-xs text-gray-400">
									{result.createdAt.toLocaleTimeString()}
								  </span>
								</div>
							  </div>
							</div>
							<div className="flex items-center gap-1">
							  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
								<Edit3 className="w-4 h-4 text-gray-500" />
							  </button>
							  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
								<Trash2 className="w-4 h-4 text-gray-500" />
							  </button>
							</div>
						  </div>
						</div>
						
						<div className="p-4">
						  {renderAnalysisCard(result)}
						</div>
					  </div>
					))}
				  </div>
				</div>
			  )}

			  {/* Deadlines Tab */}
			  {activeTab === 'deadlines' && (
				<div className="flex-1 flex flex-col">
				  <div className="p-4 border-b border-gray-200/50">
					<div className="flex items-center justify-between mb-4">
					  <h3 className="text-lg font-bold text-gray-900">Deadlines</h3>
					  <button
						onClick={() => setShowDeadlineForm(true)}
						className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
					  >
						<Plus className="w-4 h-4 inline mr-1" />
						Add
					  </button>
					</div>
				  </div>

				  <div className="flex-1 overflow-y-auto p-4 space-y-3">
					{deadlines.map((deadline) => (
					  <div key={deadline.id} className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
						<div className="flex items-start justify-between mb-3">
						  <div className="flex items-center gap-3">
							<div className={`p-2 rounded-lg ${
							  deadline.priority === 'high' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
							  deadline.priority === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
							  'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
							} shadow-sm`}>
							  <Flag className="w-4 h-4" />
							</div>
							<div>
							  <h4 className="font-semibold text-gray-900">{deadline.title}</h4>
							  <p className="text-sm text-gray-600 mt-1">{deadline.description}</p>
							</div>
						  </div>
						  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
							deadline.status === 'overdue' ? 'bg-red-100 text-red-800' :
							deadline.status === 'completed' ? 'bg-green-100 text-green-800' :
							'bg-blue-100 text-blue-800'
						  }`}>
							{deadline.status}
						  </span>
						</div>
						
						<div className="flex items-center justify-between text-sm">
						  <div className="flex items-center gap-4">
							<div className="flex items-center gap-1 text-gray-500">
							  <CalendarIcon className="w-3 h-3" />
							  {new Date(deadline.dueDate).toLocaleDateString()}
							</div>
							<span className="px-2 py-1 bg-gray-100 rounded text-gray-600 text-xs">
							  {deadline.category}
							</span>
						  </div>
						  {deadline.relatedPage && (
							<span className="text-xs text-gray-400">Page {deadline.relatedPage}</span>
						  )}
						</div>
					  </div>
					))}
				  </div>
				</div>
			  )}

			  {/* Timeline Tab */}
			  {activeTab === 'timeline' && (
				<div className="flex-1 flex flex-col">
				  <div className="p-4 border-b border-gray-200/50">
					<h3 className="text-lg font-bold text-gray-900">Timeline Events</h3>
				  </div>

				  <div className="flex-1 overflow-y-auto p-4 space-y-4">
					{timelineEvents.map((event, index) => (
					  <div 
						key={event.id}
						className="relative cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 rounded-xl p-4 border border-gray-200/50 transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm"
						onClick={() => handleTimelineClick(event)}
					  >
						{index < timelineEvents.length - 1 && (
						  <div className="absolute left-6 top-20 w-0.5 h-16 bg-gradient-to-b from-blue-300 to-blue-200"></div>
						)}
						
						<div className="flex gap-4">
						  <div className={`p-3 rounded-xl flex-shrink-0 shadow-md ${
							event.type === 'milestone' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
							'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
						  }`}>
							{event.type === 'milestone' ? 
							  <Target className="w-5 h-5" /> : 
							  <CalendarIcon className="w-5 h-5" />
							}
						  </div>
						  
						  <div className="flex-1">
							<div className="flex items-center justify-between mb-3">
							  <h5 className="font-bold text-gray-900">{event.title}</h5>
							  <div className="flex items-center gap-2">
								<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
								  Page {event.page}
								</span>
								<span className={`text-xs px-3 py-1 rounded-full font-medium ${
								  event.type === 'milestone' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
								  'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
								} shadow-sm`}>
								  {event.type}
								</span>
							  </div>
							</div>
							
							<p className="text-sm text-gray-700 mb-3 leading-relaxed">{event.description}</p>
							
							<div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
							  <CalendarIcon className="w-3 h-3" />
							  {new Date(event.date).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							  })}
							</div>
						  </div>
						</div>
					  </div>
					))}
				  </div>
				</div>
			  )}

			  {/* Chat Tab */}
			  {activeTab === 'chat' && (
				<div className="flex-1 flex flex-col">
				  <div className="p-4 border-b border-gray-200/50">
					<div className="flex items-center gap-3">
					  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white shadow-md">
						<Bot className="w-5 h-5" />
					  </div>
					  <div>
						<h3 className="text-lg font-bold text-gray-900">AI Assistant</h3>
						<p className="text-sm text-gray-600">Ask questions about your document</p>
					  </div>
					</div>
				  </div>

				  <div className="flex-1 overflow-y-auto p-4 space-y-4">
					{chatMessages.length === 0 && (
					  <div className="text-center py-8">
						<div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
						  <MessageSquare className="w-8 h-8 text-blue-600" />
						</div>
						<h4 className="font-semibold text-gray-900 mb-2">Start a conversation</h4>
						<p className="text-sm text-gray-600">Ask me anything about your document!</p>
					  </div>
					)}
					
					{chatMessages.map((message) => (
					  <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
						{message.type === 'assistant' && (
						  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
							<Bot className="w-4 h-4 text-white" />
						  </div>
						)}
						
						<div className={`max-w-[80%] p-3 rounded-2xl ${
						  message.type === 'user' 
							? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
							: 'bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-900'
						} shadow-sm`}>
						  {message.isLoading ? (
							<div className="flex items-center gap-2">
							  <Loader2 className="w-4 h-4 animate-spin" />
							  <span className="text-sm">Thinking...</span>
							</div>
						  ) : (
							<p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
						  )}
						  <div className={`text-xs mt-2 opacity-70 ${
							message.type === 'user' ? 'text-white' : 'text-gray-500'
						  }`}>
							{message.timestamp.toLocaleTimeString()}
						  </div>
						</div>
						
						{message.type === 'user' && (
						  <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
							<Users className="w-4 h-4 text-white" />
						  </div>
						)}
					  </div>
					))}
					<div ref={chatEndRef} />
				  </div>

				  <div className="p-4 border-t border-gray-200/50">
					<form onSubmit={handleChatSubmit} className="flex gap-3">
					  <div className="flex-1 relative">
						<input
						  type="text"
						  value={chatInput}
						  onChange={(e) => setChatInput(e.target.value)}
						  placeholder="Ask about your document..."
						  className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm pr-12"
						  disabled={isChatLoading}
						/>
						<button
						  type="submit"
						  disabled={!chatInput.trim() || isChatLoading}
						  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
						>
						  {isChatLoading ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						  ) : (
							<Send className="w-4 h-4" />
						  )}
						</button>
					  </div>
					</form>
				  </div>
				</div>
			  )}
			</div>

			{/* Right Side - PDF Preview */}
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
		  </>
		)}

		{/* Review Screen */}
		{documentData && currentView === 'review' && (
		  <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 p-8">
			<div className="max-w-6xl mx-auto">
			  <div className="text-center mb-8">
				<h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
				  Document Review Dashboard
				</h2>
				<p className="text-lg text-gray-600">
				  Comprehensive analysis and insights for {documentData.name}
				</p>
			  </div>

			  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
				{/* Summary Card */}
				<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
				  <div className="flex items-center gap-3 mb-4">
					<div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white shadow-md">
					  <FileText className="w-6 h-6" />
					</div>
					<h3 className="text-xl font-bold text-gray-900">Document Summary</h3>
				  </div>
				  <div className="space-y-3">
					<div className="flex justify-between">
					  <span className="text-gray-600">Pages</span>
					  <span className="font-semibold">{documentData.pages}</span>
					</div>
					<div className="flex justify-between">
					  <span className="text-gray-600">Elements</span>
					  <span className="font-semibold">{documentData.elements.length}</span>
					</div>
					<div className="flex justify-between">
					  <span className="text-gray-600">Size</span>
					  <span className="font-semibold">{(documentData.size / 1024 / 1024).toFixed(1)} MB</span>
					</div>
				  </div>
				</div>

				{/* Deadlines Card */}
				<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
				  <div className="flex items-center gap-3 mb-4">
					<div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white shadow-md">
					  <Clock className="w-6 h-6" />
					</div>
					<h3 className="text-xl font-bold text-gray-900">Active Deadlines</h3>
				  </div>
				  <div className="space-y-3">
					{deadlines.slice(0, 3).map((deadline) => (
					  <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
						<div>
						  <div className="font-medium text-sm">{deadline.title}</div>
						  <div className="text-xs text-gray-500">{new Date(deadline.dueDate).toLocaleDateString()}</div>
						</div>
						<span className={`px-2 py-1 rounded-full text-xs font-medium ${
						  deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
						  deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
						  'bg-green-100 text-green-800'
						}`}>
						  {deadline.priority}
						</span>
					  </div>
					))}
				  </div>
				</div>

				{/* Timeline Card */}
				<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
				  <div className="flex items-center gap-3 mb-4">
					<div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white shadow-md">
					  <CalendarIcon className="w-6 h-6" />
					</div>
					<h3 className="text-xl font-bold text-gray-900">Timeline Events</h3>
				  </div>
				  <div className="space-y-3">
					{timelineEvents.slice(0, 3).map((event) => (
					  <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
						<div className={`p-2 rounded-lg ${
						  event.type === 'milestone' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
						}`}>
						  {event.type === 'milestone' ? <Target className="w-3 h-3" /> : <CalendarIcon className="w-3 h-3" />}
						</div>
						<div className="flex-1">
						  <div className="font-medium text-sm">{event.title}</div>
						  <div className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</div>
						</div>
					  </div>
					))}
				  </div>
				</div>
			  </div>

			  {/* Action Buttons */}
			  <div className="flex items-center justify-center gap-4">
				<button
				  onClick={() => setCurrentView('workflow')}
				  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
				>
				  <Workflow className="w-6 h-6 inline mr-3" />
				  Plan Your Workflow
				</button>
				
				<button
				  onClick={() => setCurrentView('analysis')}
				  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
				>
				  <ArrowRight className="w-6 h-6 inline mr-3" />
				  Continue Analysis
				</button>
			  </div>
			</div>
		  </div>
		)}

		{/* Workflow Planner Screen */}
		{documentData && currentView === 'workflow' && (
		  <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 p-8">
			<div className="max-w-6xl mx-auto">
			  <div className="text-center mb-8">
				<div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg">
				  <Workflow className="w-5 h-5" />
				  Workflow Planner
				</div>
				<h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
				  Smart Workflow Planning
				</h2>
				<p className="text-lg text-gray-600">
				  AI-generated workflow based on your document analysis
				</p>
			  </div>

			  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Workflow Steps */}
				<div className="lg:col-span-2 space-y-6">
				  {[
					{
					  id: 1,
					  title: 'Document Review',
					  description: 'Complete thorough review of all document sections',
					  duration: '2-3 hours',
					  priority: 'high',
					  status: 'pending',
					  dependencies: []
					},
					{
					  id: 2,
					  title: 'Key Points Analysis',
					  description: 'Analyze and validate key findings and insights',
					  duration: '1-2 hours',
					  priority: 'high',
					  status: 'pending',
					  dependencies: [1]
					},
					{
					  id: 3,
					  title: 'Timeline Verification',
					  description: 'Verify timeline events and important dates',
					  duration: '30-45 mins',
					  priority: 'medium',
					  status: 'pending',
					  dependencies: [1]
					},
					{
					  id: 4,
					  title: 'Deadline Management',
					  description: 'Set up tracking for all identified deadlines',
					  duration: '45-60 mins',
					  priority: 'high',
					  status: 'pending',
					  dependencies: [2, 3]
					},
					{
					  id: 5,
					  title: 'Action Plan Creation',
					  description: 'Create comprehensive action plan based on findings',
					  duration: '1-1.5 hours',
					  priority: 'medium',
					  status: 'pending',
					  dependencies: [4]
					}
				  ].map((step, index) => (
					<div key={step.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
					  <div className="flex items-start justify-between mb-4">
						<div className="flex items-center gap-4">
						  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
							step.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
							step.status === 'in-progress' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
							'bg-gradient-to-r from-gray-500 to-gray-600'
						  }`}>
							{step.status === 'completed' ? <CheckCircle className="w-6 h-6" /> : step.id}
						  </div>
						  <div>
							<h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
							<p className="text-gray-600">{step.description}</p>
						  </div>
						</div>
						
						<div className="text-right">
						  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
							step.priority === 'high' ? 'bg-red-100 text-red-800' :
							step.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
							'bg-green-100 text-green-800'
						  }`}>
							{step.priority} priority
						  </span>
						  <div className="text-sm text-gray-500 mt-1">{step.duration}</div>
						</div>
					  </div>
					  
					  <div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
						  <Timer className="w-4 h-4 text-gray-400" />
						  <span className="text-sm text-gray-600">Estimated: {step.duration}</span>
						</div>
						
						<button className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
						  step.status === 'completed' ? 'bg-green-100 text-green-800 cursor-not-allowed' :
						  step.status === 'in-progress' ? 'bg-blue-600 text-white hover:bg-blue-700' :
						  'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}>
						  {step.status === 'completed' ? 'Completed' :
						   step.status === 'in-progress' ? 'In Progress' :
						   'Start Task'}
						</button>
					  </div>
					</div>
				  ))}
				</div>

				{/* Workflow Summary */}
				<div className="space-y-6">
				  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
					<h3 className="text-lg font-bold text-gray-900 mb-4">Workflow Summary</h3>
					<div className="space-y-3">
					  <div className="flex justify-between">
						<span className="text-gray-600">Total Tasks</span>
						<span className="font-semibold">5</span>
					  </div>
					  <div className="flex justify-between">
						<span className="text-gray-600">Estimated Time</span>
						<span className="font-semibold">5-8 hours</span>
					  </div>
					  <div className="flex justify-between">
						<span className="text-gray-600">High Priority</span>
						<span className="font-semibold text-red-600">3 tasks</span>
					  </div>
					  <div className="flex justify-between">
						<span className="text-gray-600">Medium Priority</span>
						<span className="font-semibold text-yellow-600">2 tasks</span>
					  </div>
					</div>
				  </div>

				  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
					<h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
					<div className="space-y-3">
					  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md">
						<Play className="w-4 h-4 inline mr-2" />
						Start Workflow
					  </button>
					  <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
						<Download className="w-4 h-4 inline mr-2" />
						Export Plan
					  </button>
					  <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
						<Share2 className="w-4 h-4 inline mr-2" />
						Share Workflow
					  </button>
					</div>
				  </div>

				  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
					<div className="flex items-center gap-3 mb-3">
					  <Lightbulb className="w-5 h-5 text-green-600" />
					  <h4 className="font-semibold text-green-900">AI Recommendation</h4>
					</div>
					<p className="text-green-800 text-sm leading-relaxed">
					  Based on the document complexity and content, I recommend starting with the Document Review task 
					  and allocating 3-4 hours in your first session for optimal results.
					</p>
				  </div>
				</div>
			  </div>

			  <div className="text-center mt-8">
				<button
				  onClick={() => setCurrentView('analysis')}
				  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md"
				>
				  <ArrowRight className="w-5 h-5 inline mr-2" />
				  Back to Analysis
				</button>
			  </div>
			</div>
		  </div>
		)}
	  </div>

	  {/* Deadline Form Modal */}
	  {showDeadlineForm && (
		<DeadlineForm 
		  onSubmit={addDeadline}
		  onCancel={() => setShowDeadlineForm(false)}
		/>
	  )}
	</div>
  );
}