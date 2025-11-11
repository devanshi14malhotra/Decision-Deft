
export interface ChatMessage {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export interface Conversation {
  id: string;
  title: string;
  history: ChatMessage[];
  createdAt: string;
}
