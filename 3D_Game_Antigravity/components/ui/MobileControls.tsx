"use client";

import React, { useEffect, useRef } from "react";
import { useGameStore } from "@/lib/store/useGameStore";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";

export function MobileControls() {
  const gameState = useGameStore((s) => s.gameState);
  const moveLeft = useGameStore((s) => s.moveLeft);
  const moveRight = useGameStore((s) => s.moveRight);
  const jump = useGameStore((s) => s.jump);
  const slide = useGameStore((s) => s.slide);

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStart.current.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      const SWIPE_THRESHOLD = 30;

      if (Math.max(absX, absY) > SWIPE_THRESHOLD) {
        if (absX > absY) {
          // Horizontal Swipe
          if (deltaX > 0) moveRight();
          else moveLeft();
        } else {
          // Vertical Swipe
          if (deltaY < 0) jump();
          else slide();
        }
      }

      touchStart.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gameState, moveLeft, moveRight, jump, slide]);

  if (gameState !== "PLAYING") return null;

  return (
    <div className="absolute inset-x-0 bottom-6 z-20 pointer-events-none flex justify-between px-6 md:hidden">
      {/* Left/Right Directional Buttons */}
      <div className="flex gap-2 pointer-events-auto">
        <button
          onClick={moveLeft}
          aria-label="Move Left"
          className="w-14 h-14 rounded-2xl bg-black/60 border border-cyan-500/40 backdrop-blur-md flex items-center justify-center text-cyan-300 active:scale-90 active:bg-cyan-500 active:text-black transition-all shadow-neon-cyan"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>
        <button
          onClick={moveRight}
          aria-label="Move Right"
          className="w-14 h-14 rounded-2xl bg-black/60 border border-cyan-500/40 backdrop-blur-md flex items-center justify-center text-cyan-300 active:scale-90 active:bg-cyan-500 active:text-black transition-all shadow-neon-cyan"
        >
          <ArrowRight className="w-7 h-7" />
        </button>
      </div>

      {/* Jump/Slide Action Buttons */}
      <div className="flex gap-2 pointer-events-auto">
        <button
          onClick={jump}
          aria-label="Jump"
          className="w-14 h-14 rounded-2xl bg-black/60 border border-pink-500/40 backdrop-blur-md flex items-center justify-center text-pink-300 active:scale-90 active:bg-pink-500 active:text-black transition-all shadow-neon-magenta"
        >
          <ArrowUp className="w-7 h-7" />
        </button>
        <button
          onClick={slide}
          aria-label="Slide"
          className="w-14 h-14 rounded-2xl bg-black/60 border border-yellow-500/40 backdrop-blur-md flex items-center justify-center text-yellow-300 active:scale-90 active:bg-yellow-500 active:text-black transition-all shadow-neon-yellow"
        >
          <ArrowDown className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
