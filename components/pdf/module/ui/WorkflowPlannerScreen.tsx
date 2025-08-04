import { ArrowRight, Download, Play, Timer, Workflow } from "lucide-react";

export const WorkflowScreen = ({ setCurrentView }: { setCurrentView: (view: 'analysis' | 'review' | 'workflow') => void }) => {
  const workflowSteps = [
    {
      id: 1,
      title: 'Document Review',
      description: 'Complete thorough review of all document sections',
      duration: '2-3 hours',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Key Points Analysis',
      description: 'Analyze and validate key findings and insights',
      duration: '1-2 hours',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Timeline Verification',
      description: 'Verify timeline events and important dates',
      duration: '30-45 mins',
      priority: 'medium',
      status: 'pending'
    }
  ];

  return (
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
          <div className="lg:col-span-2 space-y-6">
            {workflowSteps.map((step) => (
              <div key={step.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-md bg-gradient-to-r from-gray-500 to-gray-600">
                      {step.id}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    step.priority === 'high' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {step.priority} priority
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Estimated: {step.duration}</span>
                  </div>
                  
                  <button className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                    Start Task
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Workflow Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="font-semibold">{workflowSteps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Time</span>
                  <span className="font-semibold">4-6 hours</span>
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
              </div>
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
  );
};
