import React, { useState, useRef, useEffect } from 'react';
import type { Conversation, ChatMessage } from '../types';
import Message from './Message';
import { SendIcon, BotIcon, BalanceIcon, DownloadIcon, RegretIcon } from './Icons';

interface ChatWindowProps {
  conversation: Conversation;
  onSendMessage: (message: string) => void;
  onExportConversation: (id: string) => void;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onSendMessage, onExportConversation, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.history, isLoading]);

  useEffect(() => {
    // Auto-resize textarea on input
    if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const handleGenerateProsCons = () => {
    const prompt = "Based on our conversation so far, please generate a detailed list of pros and cons for the decision I'm trying to make. Please format it clearly using Markdown with headers for 'Pros' and 'Cons'.";
    onSendMessage(prompt);
  }

  const handleRegretAnalysis = () => {
    const prompt = `Please act as a compassionate psychologist. Analyze our conversation and the decision I'm facing.
1.  **Estimate a 'Potential Regret Score'** on a scale of Low, Medium, or High.
2.  **Provide a Rationale:** Briefly explain the psychological factors from our discussion that contribute to this score (e.g., emotional stakes, uncertainty, external pressures).
3.  **Offer a 'Regret Management Plan':** Give me 3-4 actionable, bullet-pointed strategies to help me manage and reduce potential regret *after* I've made my choice. This is the most important part. Frame it as proactive advice.

Please format the entire response clearly using Markdown, with the score being prominent.`;
    onSendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const initialMessage: ChatMessage = {
    role: 'model',
    parts: [{ text: "Hello! I'm DecisionDeft. What's on your mind today? Tell me about a decision you're trying to make." }]
  };

  return (
    <div className="flex flex-col h-full bg-gray-900/70">
      <header className="p-4 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white truncate">{conversation.title}</h2>
        <button
          onClick={() => onExportConversation(conversation.id)}
          disabled={conversation.history.length === 0}
          className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors"
          aria-label="Export conversation"
          title="Export conversation"
        >
          <DownloadIcon className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {conversation.history.length === 0 && <Message message={initialMessage} />}
        {conversation.history.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
              <BotIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-2 p-4 bg-gray-800/80 rounded-lg rounded-tl-none">
                <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse delay-0"></div>
                <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse delay-400"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10 bg-gray-900/50">
        <div className="relative bg-gray-800/80 rounded-xl">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              onClick={handleRegretAnalysis}
              disabled={isLoading}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors"
              aria-label="Analyze Regret Score"
              title="Analyze Regret Score"
            >
              <RegretIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleGenerateProsCons}
              disabled={isLoading}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors"
              aria-label="Generate Pros and Cons"
              title="Generate Pros and Cons"
            >
              <BalanceIcon className="w-5 h-5" />
            </button>
          </div>
          <textarea
            ref={textAreaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Tell me about your dilemma..."
            className="w-full bg-transparent rounded-xl p-4 pl-24 pr-16 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-y-hidden"
            rows={1}
            style={{ minHeight: '52px', maxHeight: '200px' }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;