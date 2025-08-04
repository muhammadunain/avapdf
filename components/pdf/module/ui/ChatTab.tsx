'use client'
import { ChatMessage, DocumentData } from "@/types/type";
import { Bot, Loader2, MessageSquare, Send } from "lucide-react";
import { useEffect, useRef } from "react";
import { ChatMessageComponent } from "./ChatMessage";

export const ChatTab = ({ 
  chatMessages, 
  chatInput, 
  setChatInput, 
  handleChatSubmit, 
  isChatLoading, 
  documentData 
}: {
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (input: string) => void;
  handleChatSubmit: (e: React.FormEvent) => void;
  isChatLoading: boolean;
  documentData: DocumentData;
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Assistant</h3>
            <p className="text-sm text-gray-600">Ask questions about your document</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Start a conversation</h4>
            <p className="text-sm text-gray-600">Ask me anything about your document!</p>
          </div>
        )}
        
        {chatMessages.map((message) => (
          <ChatMessageComponent key={message.id} message={message} />
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200/50">
        <form onSubmit={handleChatSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about your document..."
              className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm pr-12"
              disabled={isChatLoading}
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
            >
              {isChatLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};