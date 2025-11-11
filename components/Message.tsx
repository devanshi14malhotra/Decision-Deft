import React from 'react';
import type { ChatMessage } from '../types';
import { BotIcon, UserIcon } from './Icons';

// Make marked available on the window object
declare global {
  interface Window {
    marked: {
      parse: (markdown: string, options?: object) => string;
    };
  }
}

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isBot = message.role === 'model';
  const htmlContent = window.marked.parse(message.parts[0].text, { gfm: true, breaks: true });

  return (
    <div className={`flex items-start gap-4 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${
          isBot ? 'bg-indigo-500 border-indigo-400/50' : 'bg-gray-700 border-gray-600'
        }`}
      >
        {isBot ? (
          <BotIcon className="w-6 h-6 text-white" />
        ) : (
          <UserIcon className="w-6 h-6 text-white" />
        )}
      </div>
      <div
        className={`max-w-xl p-4 rounded-lg shadow-md ${
          isBot
            ? 'bg-gray-800/80 text-gray-200 rounded-tl-none'
            : 'bg-indigo-600 text-white rounded-tr-none'
        }`}
      >
        <div
          className="prose prose-invert prose-sm max-w-none 
                     prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-li:my-0 prose-ol:my-2 
                     prose-strong:text-white
                     prose-blockquote:border-indigo-400 prose-blockquote:text-gray-300"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
};

export default Message;