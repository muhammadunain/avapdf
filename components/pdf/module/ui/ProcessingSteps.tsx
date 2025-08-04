import { ProcessingStep } from "@/types/type";
import { Check, ChevronRight } from "lucide-react";

export const ProcessingSteps = ({ steps, currentStep }: { steps: ProcessingStep[]; currentStep: number }) => {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
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
          {index < steps.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
          )}
        </div>
      ))}
    </div>
  );
};