
import React, { useState, useRef, useEffect } from 'react';
import { Contact, Message } from '../types';
import MessageComponent from './Message';
import SendIcon from './icons/SendIcon';
import UserIcon from './icons/UserIcon';
import RobotIcon from './icons/RobotIcon';

interface ChatViewProps {
  contact: Contact | undefined;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isAiTyping: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({ contact, messages, onSendMessage, isAiTyping }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-lg">Select a contact to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex items-center p-3 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
          {contact.type === 'ai' ? <RobotIcon className="w-6 h-6"/> : <UserIcon className="w-6 h-6"/>}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{contact.name}</h2>
          {contact.type === 'ai' && <p className="text-xs text-green-400">AI Assistant</p>}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageComponent key={msg.id} message={msg} />
        ))}
        {isAiTyping && (
             <div className="flex justify-start">
                <div className="bg-gray-700 rounded-2xl rounded-bl-lg px-4 py-3 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800 sticky bottom-0 bg-gray-900">
        <form onSubmit={handleSendMessage} className="flex items-center bg-gray-800 rounded-full p-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-white px-4 focus:outline-none"
          />
          <button type="submit" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed" disabled={!inputText.trim()}>
            <SendIcon className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
   