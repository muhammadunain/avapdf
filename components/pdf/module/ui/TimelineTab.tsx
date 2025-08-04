import { TimelineEvent } from "@/types/type";
import { TimelineEventCard } from "./TimelineEvent";

export const TimelineTab = ({ 
  timelineEvents, 
  handleTimelineClick 
}: {
  timelineEvents: TimelineEvent[];
  handleTimelineClick: (event: any) => void;
}) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-200/50">
        <h3 className="text-lg font-bold text-gray-900">Timeline Events</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {timelineEvents.map((event, index) => (
          <TimelineEventCard
            key={event.id}
            event={event}
            isLast={index === timelineEvents.length - 1}
            onClick={() => handleTimelineClick(event)}
          />
        ))}
      </div>
    </div>
  );
};