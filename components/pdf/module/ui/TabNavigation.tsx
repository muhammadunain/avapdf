import { Brain, CalendarIcon, Clock, FileText, MessageSquare } from "lucide-react";

export const TabNavigation = ({ 
  activeTab, 
  setActiveTab 
}: {
  activeTab: 'elements' | 'analysis' | 'deadlines' | 'timeline' | 'chat';
  setActiveTab: (tab: 'elements' | 'analysis' | 'deadlines' | 'timeline' | 'chat') => void;
}) => {
  const tabs = [
    { id: 'elements', label: 'Elements', icon: <FileText className="w-4 h-4" /> },
    { id: 'analysis', label: 'Analysis', icon: <Brain className="w-4 h-4" /> },
    { id: 'deadlines', label: 'Deadlines', icon: <Clock className="w-4 h-4" /> },
    { id: 'timeline', label: 'Timeline', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> }
  ];

  return (
    <div className="p-4 border-b border-gray-200/50">
      <div className="flex items-center gap-1 bg-gray-100/80 backdrop-blur-sm rounded-xl p-1">
        {tabs.map((tab) => (
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
  );
};