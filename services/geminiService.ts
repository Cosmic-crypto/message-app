import { GoogleGenAI, Chat, Part } from "@google/genai";
import { Message, MessageSender } from '../types';

// The user may not have an API key, so we handle that gracefully.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

// Cache for active chat sessions
const chatSessions = new Map<string, Chat>();

export function clearChatSessions() {
    chatSessions.clear();
}

export function deleteChatSession(contactId: string) {
    chatSessions.delete(contactId);
}

function getChatSession(contactId: string, systemInstruction?: string, history: Message[] = []): Chat {
  if (chatSessions.has(contactId)) {
    return chatSessions.get(contactId)!;
  }
  
  if (!ai) {
    // This will be caught and displayed to the user.
    throw new Error("Gemini API key not configured.");
  }

  const geminiHistory: { role: 'user' | 'model'; parts: Part[] }[] = history.map(msg => ({
    role: msg.sender === MessageSender.USER ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));
  
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction || "You are a helpful assistant.",
    },
    history: geminiHistory,
  });

  chatSessions.set(contactId, chat);
  return chat;
}

export async function getAiResponse(
  contactId: string,
  systemInstruction: string | undefined,
  history: Message[],
  latestMessage: string
): Promise<string> {
  try {
    const chat = getChatSession(contactId, systemInstruction, history);
    const result = await chat.sendMessage({ message: latestMessage });
    return result.text;
  } catch (error) {
    console.error("Error getting AI response:", error);
    if (error instanceof Error) {
        chatSessions.delete(contactId); // Reset chat session on error
        return `Sorry, I encountered an error: ${error.message}. Please check your API key and network connection. Let's try again.`;
    }
    return "Sorry, I encountered an unknown error. Please try again.";
  }
}