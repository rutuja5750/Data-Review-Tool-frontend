
import React, { useState, useEffect, useRef } from 'react'
import { Send, Database, Bot, User } from 'lucide-react'
import { Message, chatService, ModelType } from '../services/chatService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function MainContent() {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>('openAI');
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

      const response = await chatService.sendQuery(query, selectedModel);
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const renderMessageContent = (message: Message) => {
    if (message.role === 'user') {
      return <p className="text-sm">{message.content}</p>;
    }

    return (
      <div className="space-y-4">
        {/* Display normal content or answer if available */}
        {message.answer ? (
          // <p className="text-sm">{message.answer}</p>
          <Markdown remarkPlugins={[remarkGfm]}>{message.answer}</Markdown>

        ) : (
          // <p className="text-sm">{message.content}</p>
          <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>

        )}

        {message.sql_query && (
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <Database size={16} />
              <span>SQL Query</span>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono bg-background p-2 rounded">
              {message.sql_query}
            </pre>
          </div>
        )}

        {message.data && message.data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  {Object.keys(message.data[0]).map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {message.data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td
                        key={i}
                        className="px-6 py-4 whitespace-nowrap text-sm text-foreground"
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
          <p className="text-sm text-muted-foreground">
            Returned {message.rowcount} rows
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">      
      {/* Conversation Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 mx-auto max-w-6xl">
            {conversations.map((message, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex gap-3 mb-6",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <Avatar className="size-8">
                  {message.role === "user" ? (
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User size={16} />
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <Bot size={16} />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className={cn(
                  "rounded-lg px-4 py-3 max-w-[80%]",
                  message.role === "assistant" 
                    ? "bg-muted" 
                    : "bg-primary text-primary-foreground"
                )}>
                  {renderMessageContent(message)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 mb-6">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      
      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Select
              value={selectedModel}
              onValueChange={(value: string) => setSelectedModel(value as ModelType)}
            >
              <SelectTrigger className="w-[140px] text-white">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sqlCoder">SQL Coder</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="openAI">OpenAI</SelectItem>
                <SelectItem value="langchain">Langchain</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="rag">RAG</SelectItem>
              </SelectContent>
            </Select>
            <Input
              className="flex-1"
              placeholder="Enter your SQL query request..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MainContent