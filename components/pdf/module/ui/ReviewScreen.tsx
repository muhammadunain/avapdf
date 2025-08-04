import { DocumentData, Deadline, TimelineEvent } from "@/types/type";
import { ArrowRight, CalendarIcon, Clock, FileText, Target, Workflow } from "lucide-react";

export const ReviewScreen = ({ 
  documentData, 
  deadlines, 
  timelineEvents, 
  setCurrentView 
}: {
  documentData: DocumentData;
  deadlines: Deadline[];
  timelineEvents: TimelineEvent[];
  setCurrentView: (view: 'analysis' | 'review' | 'workflow') => void;
}) => {
  return (
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
  );
};