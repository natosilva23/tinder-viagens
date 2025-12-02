// MeetTrip - Types & Interfaces

export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  photo: string;
  location?: string;
}

export interface Trip {
  id: string;
  userId: string;
  destination: string;
  startDate: string;
  endDate: string;
  style: TripStyle;
  description?: string;
}

export type TripStyle = 
  | "Aventura" 
  | "Relaxamento" 
  | "Cultural" 
  | "Festa" 
  | "Gastronomia" 
  | "Natureza";

export interface TravelCard {
  user: User;
  trip: Trip;
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  tripId: string;
  matchedAt: string;
  messages: Message[];
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface UserProfile extends User {
  trips: Trip[];
  matches: Match[];
}
