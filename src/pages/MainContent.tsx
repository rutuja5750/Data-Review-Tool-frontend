import React, { useState, useEffect, useRef } from 'react'
import { Send, Database } from 'lucide-react'
import { Message, chatService } from '../services/chatService'

function MainContent() {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch initial greeting from AI when component mounts
  useEffect(() => {
    setConversations([{
      role: "assistant",
      content: "Hello! I can help you query your database. What would you like to know?"
    }]);
  }, []);

  // Function to send query to backend
  const sendQuery = async (query: string) => {
    setIsLoading(true);
    
    try {
      // Add user message to conversation
      setConversations(prev => [...prev, {
        role: "user",
        content: query
      }]);

      const response = await chatService.sendQuery(query);
      setConversations(prev => [...prev, response]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setConversations(prev => [...prev, {
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user message submission
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputMessage.trim() === '' || isLoading) return;
    
    const userMessage = inputMessage.trim();
    setInputMessage("");
    
    // Send the message to the backend
    sendQuery(userMessage);
  };

  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const renderMessageContent = (message: Message) => {
    if (message.role === 'user') {
      return <p>{message.content}</p>;
    }

    return (
      <div className="space-y-4">
        <p>{message.content}</p>
        
        {message.sql_query && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <Database size={16} />
              <span>SQL Query</span>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {message.sql_query}
            </pre>
          </div>
        )}

        {message.data && message.data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(message.data[0]).map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {message.data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td
                        key={i}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {message.rowcount && (
          <p className="text-sm text-gray-500">
            Returned {message.rowcount} rows
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">      
      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 mx-auto pt-6 pb-32">
          {conversations.map((message, index) => (
            <div key={index} className={`mb-6 ${message.role === "assistant" ? "pr-4" : "pl-4"}`}>
              <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-2xl px-4 py-3 max-w-3xl ${
                  message.role === "assistant" 
                    ? "bg-white border border-gray-100 shadow-sm mr-auto" 
                    : "bg-blue-500 text-white ml-auto"
                }`}>
                  {renderMessageContent(message)}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start pr-4 mb-6">
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 fixed bottom-0 w-full">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage} className="relative">
            <textarea 
              className="w-full border border-gray-300 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter your SQL query request..."
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className={`absolute right-3 bottom-3 ${isLoading ? 'text-gray-300' : 'text-gray-400 hover:text-blue-500'}`}
              disabled={isLoading}
            >
              <Send size={18} />
            </button>
          </form>
      
        </div>
      </div>
    </div>
  )
}

export default MainContent