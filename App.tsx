import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ChatWindow from './components/ChatWindow';
import SavedConversations from './components/SavedConversations';
import { createChatSession } from './services/geminiService';
import type { Conversation, ChatMessage } from './types';
import { BotIcon, PlusIcon } from './components/Icons';
import type { Chat } from '@google/genai';

// Make uuid available on the window object
declare global {
  interface Window {
    uuid: {
      v4: () => string;
    };
  }
}

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Load conversations from localStorage on initial render
  useEffect(() => {
    if (!isAnonymous) {
      try {
        const savedConversations = localStorage.getItem('decision-deft-conversations');
        if (savedConversations) {
          setConversations(JSON.parse(savedConversations));
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
        setConversations([]);
      }
    }
  }, [isAnonymous]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (!isAnonymous) {
      try {
        localStorage.setItem('decision-deft-conversations', JSON.stringify(conversations));
      } catch (error) {
        console.error("Failed to save conversations:", error);
      }
    }
  }, [conversations, isAnonymous]);
  
  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: window.uuid.v4(),
      title: 'New Decision',
      history: [],
      createdAt: new Date().toISOString(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };
  
  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      const remainingConversations = conversations.filter(c => c.id !== id);
      setActiveConversationId(remainingConversations.length > 0 ? remainingConversations[0].id : null);
    }
  };

  const handleExportConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (!conversation) return;

    const formattedContent = `# Decision Log: ${conversation.title}\n\n**Saved on:** ${new Date(conversation.createdAt).toLocaleString()}\n\n---\n\n${conversation.history
      .map(msg => `### ${msg.role === 'user' ? 'You' : 'DecisionDeft'}\n\n${msg.parts[0].text}\n\n---`)
      .join('\n')}`;
      
    const blob = new Blob([formattedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `decision_log_${safeTitle}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!activeConversation) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: messageText }] };
    
    let updatedHistory = [...activeConversation.history, userMessage];
    let updatedTitle = activeConversation.title;

    // If it's the first user message, update the conversation title
    if (activeConversation.history.length === 0 && messageText.length > 0) {
      updatedTitle = messageText.length > 30 ? messageText.substring(0, 27) + '...' : messageText;
    }
    
    setConversations(prev =>
      prev.map(c =>
        c.id === activeConversationId ? { ...c, history: updatedHistory, title: updatedTitle } : c
      )
    );
    setIsLoading(true);

    try {
        const chat: Chat = createChatSession(activeConversation.history);
        const result = await chat.sendMessage({ message: messageText });
        const botMessage: ChatMessage = { role: 'model', parts: [{ text: result.text }] };
        updatedHistory = [...updatedHistory, botMessage];

        setConversations(prev =>
            prev.map(c =>
                c.id === activeConversationId ? { ...c, history: updatedHistory } : c
            )
        );
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        const errorMessage: ChatMessage = {
            role: 'model',
            parts: [{ text: "I'm sorry, I encountered an error. Please check your API key and try again." }],
        };
        updatedHistory = [...updatedHistory, errorMessage];
        setConversations(prev =>
            prev.map(c =>
                c.id === activeConversationId ? { ...c, history: updatedHistory } : c
            )
        );
    } finally {
        setIsLoading(false);
    }
  }, [activeConversation, activeConversationId]);

  const handleToggleAnonymous = () => {
    const nextIsAnonymous = !isAnonymous;
    setIsAnonymous(nextIsAnonymous);
    if (nextIsAnonymous) {
      // Entering anonymous mode
      setActiveConversationId(null);
      setConversations([]);
      localStorage.removeItem('decision-deft-conversations');
    }
    // On exiting anonymous mode, the useEffect will reload from localStorage
  };
  
  return (
    <div className="flex h-screen w-screen text-gray-200">
      <SavedConversations
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onExportConversation={handleExportConversation}
        isAnonymous={isAnonymous}
        onToggleAnonymous={handleToggleAnonymous}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <main className="flex-1 flex flex-col h-full transition-all duration-300">
        <div className="flex-1 flex flex-col min-w-0">
          {activeConversation ? (
            <ChatWindow
              conversation={activeConversation}
              onSendMessage={handleSendMessage}
              onExportConversation={handleExportConversation}
              isLoading={isLoading}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="relative mb-6">
                    <div className="absolute -inset-2 bg-indigo-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative inline-block p-4 bg-gray-800 border border-gray-700 rounded-full">
                        <BotIcon className="w-24 h-24 text-indigo-400" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Decision Deft</h1>
                <p className="text-lg text-gray-400 max-w-lg">Your AI co-pilot for navigating life's choices. Stuck on a dilemma? Let's break it down together.</p>
                <button 
                    onClick={handleNewChat}
                    className="mt-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5"/>
                    Start a New Decision
                </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;