import { PDFElement } from "@/types/type";

export const ElementCard = ({ 
  element, 
  isSelected, 
  onClick, 
  getElementIcon 
}: {
  element: PDFElement;
  isSelected: boolean;
  onClick: () => void;
  getElementIcon: (type: PDFElement['type']) => React.ReactNode;
}) => {
  return (
    <div
      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
        isSelected
          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg'
          : 'border-gray-200/50 hover:border-gray-300 bg-white/80 backdrop-blur-sm'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          element.type === 'heading1' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
          element.type === 'heading2' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' :
          element.type === 'paragraph' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
          element.type === 'table' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
          element.type === 'list' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
          'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
        } shadow-sm`}>
          {getElementIcon(element.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              {element.type.replace(/(\d)/, ' $1')}
            </span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              Page {element.page}
            </span>
          </div>
          
          <p className="text-sm text-gray-900 line-clamp-2 leading-relaxed">
            {element.content}
          </p>
          
          {element.confidence && (
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500 font-medium">
                {Math.round(element.confidence * 100)}% confidence
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};