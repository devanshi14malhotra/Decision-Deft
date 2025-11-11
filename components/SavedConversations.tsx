import React from 'react';
import type { Conversation } from '../types';
import { PlusIcon, TrashIcon, PrivacyIcon, HistoryIcon, MenuIcon, BotIcon, DownloadIcon } from './Icons';

interface SavedConversationsProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onExportConversation: (id: string) => void;
  isAnonymous: boolean;
  onToggleAnonymous: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SavedConversations: React.FC<SavedConversationsProps> = ({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onExportConversation,
  isAnonymous,
  onToggleAnonymous,
  isOpen,
  setIsOpen,
}) => {
    
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <button 
        className="fixed top-4 left-4 z-30 lg:hidden p-2 bg-gray-800/80 backdrop-blur-sm rounded-md border border-white/10"
        onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon className="w-6 h-6"/>
      </button>
      <aside className={`absolute lg:relative z-20 flex flex-col h-full bg-black/30 backdrop-blur-lg border-r border-white/10 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-80`}>
        <div className="p-4 flex items-center gap-3 border-b border-white/10">
          <BotIcon className="w-8 h-8 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white">Decision Deft</h1>
        </div>
        
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors shadow-md"
          >
            <PlusIcon className="w-5 h-5" />
            New Decision
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {conversations.map(convo => (
            <div
              key={convo.id}
              onClick={() => onSelectConversation(convo.id)}
              className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                activeConversationId === convo.id ? 'bg-indigo-600/40' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex-1 truncate pr-2">
                <p className="font-medium text-white truncate">{convo.title}</p>
                <p className="text-xs text-gray-400">{formatDate(convo.createdAt)}</p>
              </div>
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExportConversation(convo.id);
                  }}
                  className="p-1.5 text-gray-500 rounded-md hover:text-indigo-400 hover:bg-white/10"
                  aria-label="Export conversation"
                  title="Export conversation"
                >
                  <DownloadIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(convo.id);
                  }}
                  className="p-1.5 text-gray-500 rounded-md hover:text-red-400 hover:bg-white/10"
                  aria-label="Delete conversation"
                  title="Delete conversation"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
            <button
                onClick={onToggleAnonymous}
                className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium border ${
                    isAnonymous 
                    ? 'bg-green-500/10 text-green-300 border-green-500/20 hover:bg-green-500/20' 
                    : 'bg-gray-700/50 text-gray-300 border-white/10 hover:bg-gray-700'
                }`}
            >
                {isAnonymous ? <PrivacyIcon className="w-5 h-5"/> : <HistoryIcon className="w-5 h-5"/>}
                <span>{isAnonymous ? 'Private Mode Active' : 'Conversation History On'}</span>
            </button>
        </div>
      </aside>
    </>
  );
};

export default SavedConversations;