"use client";

import { X, Heart, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SwipeButtonsProps {
  onPass: () => void;
  onLike: () => void;
  onUndo?: () => void;
  disabled?: boolean;
}

export function SwipeButtons({ onPass, onLike, onUndo, disabled }: SwipeButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      {/* Botão Passar */}
      <Button
        onClick={onPass}
        disabled={disabled}
        size="lg"
        className="w-16 h-16 rounded-full bg-white hover:bg-gray-50 shadow-xl border-2 border-gray-200 hover:scale-110 transition-all duration-200 disabled:opacity-50"
      >
        <X className="w-8 h-8 text-red-500" />
      </Button>

      {/* Botão Desfazer (opcional) */}
      {onUndo && (
        <Button
          onClick={onUndo}
          disabled={disabled}
          size="lg"
          className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 shadow-lg border border-gray-200 hover:scale-110 transition-all duration-200 disabled:opacity-50"
        >
          <RotateCcw className="w-5 h-5 text-amber-500" />
        </Button>
      )}

      {/* Botão Like */}
      <Button
        onClick={onLike}
        disabled={disabled}
        size="lg"
        className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-xl hover:scale-110 transition-all duration-200 disabled:opacity-50"
      >
        <Heart className="w-8 h-8 text-white fill-white" />
      </Button>
    </div>
  );
}
