"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, X } from "lucide-react";
import { User } from "@/lib/types";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedUser: User | null;
  onSendMessage: () => void;
}

export function MatchModal({ isOpen, onClose, matchedUser, onSendMessage }: MatchModalProps) {
  if (!matchedUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-pink-50 to-rose-50 border-none p-0 overflow-hidden">
        <div className="relative">
          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Conteúdo */}
          <div className="p-8 text-center space-y-6">
            {/* Ícone de match */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white fill-white" />
                </div>
              </div>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                É um Match! 🎉
              </h2>
              <p className="text-gray-600">
                Você e <span className="font-semibold text-gray-800">{matchedUser.name}</span> curtiram um ao outro!
              </p>
            </div>

            {/* Foto do match */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-md opacity-30" />
                <img
                  src={matchedUser.photo}
                  alt={matchedUser.name}
                  className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                />
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-600 text-sm max-w-xs mx-auto">
              {matchedUser.bio}
            </p>

            {/* Botões de ação */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 h-12 rounded-full border-2 hover:bg-gray-50"
              >
                Continuar explorando
              </Button>
              <Button
                onClick={onSendMessage}
                className="flex-1 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Enviar mensagem
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
