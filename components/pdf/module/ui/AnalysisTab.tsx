import { AnalysisResult } from "@/types/type";
import { Edit3, Trash2 } from "lucide-react";

export const AnalysisTab = ({ analysisResults }: { analysisResults: AnalysisResult[] }) => {
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

  return (
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
  );
};
