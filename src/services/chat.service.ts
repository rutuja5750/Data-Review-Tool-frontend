import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface QueryResult {
  subject_id: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  sql_query?: string;
  data?: QueryResult[];
  rowcount?: number;
  answer?: string;
}

export type ModelType = 'sqlCoder' | 'gemini' | 'openAI' | 'rag' | 'langchain' | 'agent';

export const chatService = {
  sendQuery: async (prompt: string, model: ModelType): Promise<Message> => {
    console.log(prompt);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/query`, {
        prompt: prompt,
        model: model
      });
      
      const { data } = response.data;
      
      console.log("RESPONSE" , data);
      
      return {
        role: 'assistant',
        content: data.message,
        sql_query: data.sql_query,
        data: data.data,
        answer: data.answer,  
        rowcount: data.rowcount
      };
    } catch (error) {
      console.error('Error sending query:', error);
      return {
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your request. Please try again later."
      };
    }
  }
};