"use client";

import { TravelCard as TravelCardType } from "@/lib/types";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TravelCardProps {
  card: TravelCardType;
  style?: React.CSSProperties;
}

export function TravelCard({ card, style }: TravelCardProps) {
  const { user, trip } = card;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const getTripStyleColor = (style: string) => {
    const colors: Record<string, string> = {
      "Aventura": "from-orange-500 to-red-500",
      "Relaxamento": "from-blue-400 to-cyan-400",
      "Cultural": "from-purple-500 to-pink-500",
      "Festa": "from-pink-500 to-rose-500",
      "Gastronomia": "from-amber-500 to-orange-500",
      "Natureza": "from-green-500 to-emerald-500"
    };
    return colors[style] || "from-gray-500 to-gray-600";
  };

  return (
    <div 
      className="absolute w-full h-full rounded-3xl overflow-hidden shadow-2xl"
      style={style}
    >
      {/* Imagem de fundo */}
      <div className="relative w-full h-full">
        <img 
          src={user.photo} 
          alt={user.name}
          className="w-full h-full object-cover"
        />
        
        {/* Gradiente overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Badge de estilo da viagem */}
        <div className="absolute top-6 right-6">
          <div className={`bg-gradient-to-r ${getTripStyleColor(trip.style)} px-4 py-2 rounded-full shadow-lg`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-sm">{trip.style}</span>
            </div>
          </div>
        </div>

        {/* Informações do usuário */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="space-y-3">
            {/* Nome e idade */}
            <div>
              <h2 className="text-4xl font-bold mb-1">
                {user.name}, {user.age}
              </h2>
              {user.location && (
                <p className="text-white/80 text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </p>
              )}
            </div>

            {/* Bio */}
            <p className="text-white/90 text-base leading-relaxed">
              {user.bio}
            </p>

            {/* Informações da viagem */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 space-y-2 border border-white/20">
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-lg">{trip.destination}</span>
              </div>
              
              <div className="flex items-center gap-2 text-white/90">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="text-sm">
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </span>
              </div>

              {trip.description && (
                <p className="text-white/80 text-sm pt-2 border-t border-white/20">
                  {trip.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
