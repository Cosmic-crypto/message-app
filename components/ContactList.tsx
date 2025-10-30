import React from 'react';
import { Contact, ContactType } from '../types';
import PlusIcon from './icons/PlusIcon';
import UserIcon from './icons/UserIcon';
import RobotIcon from './icons/RobotIcon';
import LogoutIcon from './icons/LogoutIcon';
import TrashIcon from './icons/TrashIcon';

interface ContactListProps {
  contacts: Contact[];
  activeContactId: string | null;
  onSelectContact: (id: string) => void;
  onAddContact: () => void;
  onLogout: () => void;
  onDeleteContact: (id: string) => void;
  currentUserEmail: string;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, activeContactId, onSelectContact, onAddContact, onLogout, onDeleteContact, currentUserEmail }) => {
  return (
    <div className="bg-gray-800 flex flex-col h-full border-r border-gray-700">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
        <h1 className="text-xl font-bold">Chats</h1>
        <button onClick={onAddContact} className="p-2 rounded-full hover:bg-gray-700 transition-colors" title="Add new contact">
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className={`group flex items-center p-3 m-2 rounded-lg cursor-pointer transition-colors ${
              activeContactId === contact.id ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${activeContactId === contact.id ? 'bg-blue-500' : 'bg-gray-600'}`}>
              {contact.type === ContactType.AI ? <RobotIcon className="w-6 h-6 text-white"/> : <UserIcon className="w-6 h-6 text-white"/>}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-white truncate">{contact.name}</p>
            </div>
            {contact.type === ContactType.AI && (
                <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full ml-2">AI</span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteContact(contact.id);
              }}
              className="ml-2 p-1 rounded-full text-gray-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              title={`Delete ${contact.name}`}
              aria-label={`Delete ${contact.name}`}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="text-center text-gray-400 p-8">
            <p>No contacts yet.</p>
            <p>Click the '+' icon to add one!</p>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-gray-700 mt-auto sticky bottom-0 bg-gray-800">
        <div className="flex items-center justify-between">
            <div className="flex items-center overflow-hidden">
                <UserIcon className="w-8 h-8 rounded-full bg-gray-600 p-1 mr-3 flex-shrink-0"/>
                <span className="font-semibold text-sm truncate">{currentUserEmail}</span>
            </div>
            <button onClick={onLogout} title="Logout" className="p-2 rounded-full hover:bg-gray-700 transition-colors flex-shrink-0">
                <LogoutIcon className="w-6 h-6"/>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ContactList;