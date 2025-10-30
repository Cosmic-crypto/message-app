
import React from 'react';
import { Message, MessageSender } from '../types';

interface MessageProps {
  message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;

  return (
    <div className={`flex animate-fade-in-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl ${isUser ? 'bg-blue-600 rounded-br-lg' : 'bg-gray-700 rounded-bl-lg'}`}>
        <p className="text-white text-sm">{message.text}</p>
      </div>
    </div>
  );
};

export default MessageComponent;
   