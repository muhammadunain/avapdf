import { Deadline } from "@/types/type";
import { Plus } from "lucide-react";
import { DeadlineCard } from "./DeadlineCard";

export const DeadlinesTab = ({ 
  deadlines, 
  setShowDeadlineForm 
}: {
  deadlines: Deadline[];
  setShowDeadlineForm: (show: boolean) => void;
}) => {
  return (
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
          <DeadlineCard key={deadline.id} deadline={deadline} />
        ))}
      </div>
    </div>
  );
};