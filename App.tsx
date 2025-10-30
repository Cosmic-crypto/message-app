import React, { useState, useMemo, useEffect } from 'react';
import { Contact, Message, ContactType, MessageSender, User } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import ContactList from './components/ContactList';
import ChatView from './components/ChatView';
import NewContactModal from './components/NewContactModal';
import { getAiResponse, clearChatSessions, deleteChatSession } from './services/geminiService';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);

  const contactsKey = currentUser ? `contacts_${currentUser.email}` : 'contacts_guest';
  const messagesKey = currentUser ? `messages_${currentUser.email}` : 'messages_guest';

  const [contacts, setContacts] = useLocalStorage<Contact[]>(contactsKey, []);
  const [messages, setMessages] = useLocalStorage<Record<string, Message[]>>(messagesKey, {});
  
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiTypingStates, setAiTypingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // When user changes, reset active contact
    setActiveContactId(null);
  }, [currentUser]);

  const activeContact = useMemo(() => 
    contacts.find(c => c.id === activeContactId), 
    [contacts, activeContactId]
  );
  
  const activeMessages = useMemo(() => 
    (activeContactId && messages[activeContactId]) || [],
    [messages, activeContactId]
  );

  const handleAddContact = (contactData: Omit<Contact, 'id' | 'avatar'>) => {
    const newContact: Contact = {
      ...contactData,
      id: `contact-${Date.now()}`,
      avatar: '', 
    };
    setContacts(prev => [...prev, newContact]);
    setMessages(prev => ({ ...prev, [newContact.id]: [] }));
    setActiveContactId(newContact.id);
  };

  const handleDeleteContact = (contactId: string) => {
    const contactToDelete = contacts.find(c => c.id === contactId);
    if (!contactToDelete) return;

    if (window.confirm(`Are you sure you want to delete ${contactToDelete.name}? This action cannot be undone.`)) {
      setContacts(prev => prev.filter(c => c.id !== contactId));

      setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[contactId];
        return newMessages;
      });

      deleteChatSession(contactId);

      if (activeContactId === contactId) {
        setActiveContactId(null);
      }
    }
  };
  
  const handleSendMessage = async (text: string) => {
    if (!activeContactId) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      sender: MessageSender.USER,
      timestamp: Date.now(),
    };
    
    const updatedMessages = [...(messages[activeContactId] || []), userMessage];
    setMessages(prev => ({ ...prev, [activeContactId]: updatedMessages }));
    
    const currentContact = contacts.find(c => c.id === activeContactId);
    if (currentContact?.type === ContactType.AI) {
      setAiTypingStates(prev => ({ ...prev, [activeContactId]: true }));
      try {
        const aiResponseText = await getAiResponse(
          activeContactId,
          currentContact.systemInstruction,
          updatedMessages,
          text
        );
        
        const aiMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          text: aiResponseText,
          sender: MessageSender.CONTACT,
          timestamp: Date.now(),
        };

        setMessages(prev => ({
          ...prev,
          [activeContactId]: [...updatedMessages, aiMessage],
        }));
      } catch (error) {
        console.error("Failed to get AI response:", error);
        const errorMessage: Message = {
            id: `msg-err-${Date.now()}`,
            text: "I'm having trouble connecting right now. Please try again later.",
            sender: MessageSender.CONTACT,
            timestamp: Date.now(),
        };
        setMessages(prev => ({
            ...prev,
            [activeContactId]: [...updatedMessages, errorMessage],
        }));
      } finally {
        setAiTypingStates(prev => ({ ...prev, [activeContactId]: false }));
      }
    }
  };

  const handleLogout = () => {
    clearChatSessions();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Auth onAuthSuccess={setCurrentUser} />;
  }

  return (
    <>
      <div className="h-screen w-screen flex antialiased">
        <div className="w-full md:w-1/3 lg:w-1/4 max-w-sm h-full hidden md:flex">
          <ContactList 
            contacts={contacts}
            activeContactId={activeContactId}
            onSelectContact={setActiveContactId}
            onAddContact={() => setIsModalOpen(true)}
            onLogout={handleLogout}
            onDeleteContact={handleDeleteContact}
            currentUserEmail={currentUser.email}
          />
        </div>
        <div className="flex-1 h-full">
            <ChatView 
              contact={activeContact} 
              messages={activeMessages} 
              onSendMessage={handleSendMessage}
              isAiTyping={!!(activeContactId && aiTypingStates[activeContactId])}
            />
        </div>
      </div>
      <NewContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddContact={handleAddContact}
      />
    </>
  );
};

export default App;