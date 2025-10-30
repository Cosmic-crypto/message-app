export enum ContactType {
  HUMAN = 'human',
  AI = 'ai',
}

export interface Contact {
  id: string;
  name: string;
  type: ContactType;
  avatar: string;
  systemInstruction?: string;
}

export enum MessageSender {
  USER = 'user',
  CONTACT = 'contact',
}

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: number;
}

export interface User {
  email: string;
}
