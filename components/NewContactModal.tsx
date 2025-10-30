import React, { useState } from 'react';
import { Contact, ContactType } from '../types';
import { AI_PERSONALITIES } from '../constants';

interface NewContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (contact: Omit<Contact, 'id' | 'avatar'>) => void;
}

const NewContactModal: React.FC<NewContactModalProps> = ({ isOpen, onClose, onAddContact }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<ContactType>(ContactType.HUMAN);
  const [systemInstruction, setSystemInstruction] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddContact({ name, type, systemInstruction });
    setName('');
    setSystemInstruction('');
    setType(ContactType.HUMAN);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Contact</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="contact-type" className="block text-sm font-medium text-gray-300 mb-2">Contact Type</label>
            <div className="flex rounded-lg bg-gray-900 p-1">
              <button type="button" onClick={() => setType(ContactType.HUMAN)} className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors ${type === ContactType.HUMAN ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>Human</button>
              <button type="button" onClick={() => setType(ContactType.AI)} className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors ${type === ContactType.AI ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>AI</button>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g. Jane Doe" required />
          </div>
          {type === ContactType.AI && (
            <>
              <div className="mb-4 animate-fade-in-up">
                <label className="block text-sm font-medium text-gray-300 mb-2">Choose a Personality</label>
                <div className="grid grid-cols-2 gap-2">
                  {AI_PERSONALITIES.map(p => (
                    <button type="button" key={p.name} onClick={() => setSystemInstruction(p.prompt)} className="text-left p-3 bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500">
                      <span className="font-semibold text-sm">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6 animate-fade-in-up">
                <label htmlFor="systemInstruction" className="block text-sm font-medium text-gray-300 mb-2">
                  AI Personality (System Prompt)
                  <span className="text-gray-400 text-xs ml-2">Select a preset or write your own.</span>
                </label>
                <textarea id="systemInstruction" value={systemInstruction} onChange={(e) => setSystemInstruction(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g. You are a helpful assistant that speaks like a pirate."></textarea>
              </div>
            </>
          )}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">Add Contact</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewContactModal;
