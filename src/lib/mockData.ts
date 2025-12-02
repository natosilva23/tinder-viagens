// MeetTrip - Mock Data para MVP

import { TravelCard, User, Trip } from "./types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Ana Silva",
    age: 28,
    bio: "Apaixonada por aventuras e novas culturas. Adoro conhecer pessoas autênticas!",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
    location: "São Paulo, SP"
  },
  {
    id: "2",
    name: "Carlos Mendes",
    age: 32,
    bio: "Fotógrafo viajante. Sempre em busca da próxima história para contar.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    location: "Rio de Janeiro, RJ"
  },
  {
    id: "3",
    name: "Juliana Costa",
    age: 25,
    bio: "Yoga, trilhas e pôr do sol. Vamos explorar o mundo juntos?",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
    location: "Belo Horizonte, MG"
  },
  {
    id: "4",
    name: "Pedro Santos",
    age: 30,
    bio: "Mergulhador e amante da natureza. Bora conhecer praias paradisíacas!",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
    location: "Florianópolis, SC"
  },
  {
    id: "5",
    name: "Mariana Oliveira",
    age: 27,
    bio: "Foodie e exploradora urbana. Vamos descobrir os melhores lugares!",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
    location: "Curitiba, PR"
  }
];

export const mockTrips: Trip[] = [
  {
    id: "t1",
    userId: "1",
    destination: "Paris, França",
    startDate: "2024-06-15",
    endDate: "2024-06-25",
    style: "Cultural",
    description: "Museus, cafés e muita arte!"
  },
  {
    id: "t2",
    userId: "2",
    destination: "Paris, França",
    startDate: "2024-06-16",
    endDate: "2024-06-24",
    style: "Aventura",
    description: "Fotografar cada cantinho dessa cidade incrível"
  },
  {
    id: "t3",
    userId: "3",
    destination: "Bali, Indonésia",
    startDate: "2024-07-10",
    endDate: "2024-07-20",
    style: "Relaxamento",
    description: "Yoga, meditação e praias paradisíacas"
  },
  {
    id: "t4",
    userId: "4",
    destination: "Paris, França",
    startDate: "2024-06-17",
    endDate: "2024-06-26",
    style: "Gastronomia",
    description: "Provar os melhores vinhos e queijos franceses"
  },
  {
    id: "t5",
    userId: "5",
    destination: "Paris, França",
    startDate: "2024-06-14",
    endDate: "2024-06-23",
    style: "Cultural",
    description: "Arte, história e muita cultura francesa"
  }
];

export const generateTravelCards = (destination?: string): TravelCard[] => {
  return mockUsers.map((user, index) => ({
    user,
    trip: mockTrips[index]
  })).filter(card => 
    !destination || card.trip.destination.toLowerCase().includes(destination.toLowerCase())
  );
};
