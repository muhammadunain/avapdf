import { AnalysisResult, ChatMessage, Deadline, DocumentData, PDFElement, TimelineEvent } from "@/types/type";
import { TabNavigation } from "./TabNavigation";
import { ElementsTab } from "./ElementsTab";
import { AnalysisTab } from "./AnalysisTab";
import { DeadlinesTab } from "./DeadlinesTab";
import { TimelineTab } from "./TimelineTab";
import { ChatTab } from "./ChatTab";

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  documentData, 
  searchTerm, 
  setSearchTerm, 
  selectedElement, 
  handleElementClick, 
  analysisResults, 
  deadlines, 
  setShowDeadlineForm, 
  timelineEvents, 
  handleTimelineClick, 
  chatMessages, 
  chatInput, 
  setChatInput, 
  handleChatSubmit, 
  isChatLoading 
}: {
  activeTab: 'elements' | 'analysis' | 'deadlines' | 'timeline' | 'chat';
  setActiveTab: (tab: 'elements' | 'analysis' | 'deadlines' | 'timeline' | 'chat') => void;
  documentData: DocumentData;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedElement: string | null;
  handleElementClick: (element: PDFElement) => void;
  analysisResults: AnalysisResult[];
  deadlines: Deadline[];
  setShowDeadlineForm: (show: boolean) => void;
  timelineEvents: TimelineEvent[];
  handleTimelineClick: (event: any) => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (input: string) => void;
  handleChatSubmit: (e: React.FormEvent) => void;
  isChatLoading: boolean;
}) => {
  return (
    <div className="w-96 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col shadow-lg">
      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'elements' && (
        <ElementsTab 
          documentData={documentData}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedElement={selectedElement}
          handleElementClick={handleElementClick}
        />
      )}

      {activeTab === 'analysis' && (
        <AnalysisTab analysisResults={analysisResults} />
      )}

      {activeTab === 'deadlines' && (
        <DeadlinesTab 
          deadlines={deadlines}
          setShowDeadlineForm={setShowDeadlineForm}
        />
      )}

      {activeTab === 'timeline' && (
        <TimelineTab 
          timelineEvents={timelineEvents}
          handleTimelineClick={handleTimelineClick}
        />
      )}

      {activeTab === 'chat' && (
        <ChatTab 
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleChatSubmit={handleChatSubmit}
          isChatLoading={isChatLoading}
          documentData={documentData}
        />
      )}
    </div>
  );
};