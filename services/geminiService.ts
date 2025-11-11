
import { GoogleGenAI, Chat } from '@google/genai';
import type { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this context, we assume it's set and valid.
  console.warn("API_KEY environment variable not set. App will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const SYSTEM_INSTRUCTION = `You are "DecisionDeft", an expert decision-making assistant. Your goal is to help users navigate their daily dilemmas with clarity and confidence.

Your process is as follows:
1.  **Understand the Dilemma:** Start by asking clarifying questions to fully grasp the user's situation, context, priorities, and constraints.
2.  **Generate Pros and Cons:** Based on the user's answers, create a balanced list of pros and cons for their options. Present this clearly using markdown.
3.  **Suggest Options:** If the user is unsure, suggest concrete, actionable options. Rank or frame these suggestions based on the user's stated priorities (e.g., "If speed is most important, Option A is best. If cost is the main concern, consider Option B.").
4.  **Maintain a Supportive Tone:** Be empathetic, encouraging, and non-judgmental. Your persona is a wise and patient guide.
5.  **Keep it Conversational:** Use natural language. Avoid being overly robotic.`;

export const createChatSession = (history: ChatMessage[]): Chat => {
  const chat: Chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
  return chat;
};
