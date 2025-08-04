import { Deadline } from "@/types/type";
import { CalendarIcon, Flag } from "lucide-react";

export const DeadlineCard = ({ deadline }: { deadline: Deadline }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
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
  );
};