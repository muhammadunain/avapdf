import { DocumentData, PDFElement } from "@/types/type";
import { FileText, Heading1, Heading2, List, Search, Table, Type } from "lucide-react";
import { ElementCard } from "./ElementCard";

export const ElementsTab = ({
  documentData,
  searchTerm,
  setSearchTerm,
  selectedElement,
  handleElementClick
}: {
  documentData: DocumentData;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedElement: string | null;
  handleElementClick: (element: PDFElement) => void;
}) => {
  const getFilteredElements = () => {
    let filtered = documentData.elements;
    if (searchTerm) {
      filtered = filtered.filter(el =>
        el.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const getElementIcon = (type: PDFElement['type']) => {
    switch (type) {
      case 'heading1': return <Heading1 className="w-4 h-4" />;
      case 'heading2': return <Heading2 className="w-4 h-4" />;
      case 'heading3': return <Heading2 className="w-4 h-4" />;
      case 'paragraph': return <Type className="w-4 h-4" />;
      case 'table': return <Table className="w-4 h-4" />;
      case 'list': return <List className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredElements = getFilteredElements();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Document Elements</h3>
            <p className="text-sm text-gray-500 mt-1">Browse and search document structure</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Total:</span>
            <span className="inline-flex items-center justify-center min-w-[28px] h-6 bg-gray-100 text-gray-700 text-xs font-medium rounded-md px-2">
              {filteredElements.length}
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm transition-colors"
          />
        </div>
      </div>

      {/* Elements List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {filteredElements.length > 0 ? (
            <div className="space-y-2">
              {filteredElements.map((element) => (
                <ElementCard
                  key={element.id}
                  element={element}
                  isSelected={selectedElement === element.id}
                  onClick={() => handleElementClick(element)}
                  getElementIcon={getElementIcon}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">No elements found</h4>
              <p className="text-xs text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'No document elements available'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};