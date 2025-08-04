import { ChatMessage } from "@/types/type";
import { Bot, Loader2, Users } from "lucide-react";

export const ChatMessageComponent = ({ message }: { message: ChatMessage }) => {
  return (
    <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.type === 'assistant' && (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] p-3 rounded-2xl ${
        message.type === 'user' 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
          : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-900'
      } shadow-sm`}>
        {message.isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}
        <div className={`text-xs mt-2 opacity-70 ${
          message.type === 'user' ? 'text-white' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
      
      {message.type === 'user' && (
        <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Users className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};