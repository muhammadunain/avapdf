import { TimelineEvent } from "@/types/type";
import { CalendarIcon, Target } from "lucide-react";

export const TimelineEventCard = ({ 
  event, 
  isLast, 
  onClick 
}: {
  event: TimelineEvent;
  isLast: boolean;
  onClick: () => void;
}) => {
  return (
    <div 
      className="relative cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 rounded-xl p-4 border border-gray-200/50 transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm"
      onClick={onClick}
    >
      {!isLast && (
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
  );
};