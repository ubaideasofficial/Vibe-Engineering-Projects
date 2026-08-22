"use client";

import React, { useState, useEffect } from "react";
import { X, Trophy, RefreshCw, Medal } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  distance: number;
  date: string;
  mode: string;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<"ALL" | "ENDLESS" | "DAILY">("ALL");
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?mode=${filter}`);
      const data = await res.json();
      if (data.leaderboard) {
        setEntries(data.leaderboard);
      }
    } catch (err) {
      console.error("Failed to load leaderboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen, filter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-mono animate-in fade-in zoom-in-95 duration-200">
      <div className="max-w-xl w-full bg-[#080c20]/95 border border-cyan-500/50 rounded-3xl p-6 shadow-neon-cyan flex flex-col gap-5 max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div>
              <h3 className="text-xl font-black text-white tracking-wider">HALL OF FAME</h3>
              <p className="text-[11px] text-cyan-300">Top Global Cyber Runners</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex bg-black/60 p-1 rounded-xl border border-white/10">
            {(["ALL", "ENDLESS", "DAILY"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === tab
                    ? "bg-cyan-500 text-black shadow-neon-cyan"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={fetchLeaderboard}
            aria-label="Refresh"
            disabled={loading}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-cyan-300 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
          </button>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 min-h-[220px]">
          {loading && entries.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-cyan-400 text-sm animate-pulse">
              SYNCING MAINFRAME...
            </div>
          ) : entries.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-500 text-xs">
              NO RECORDS DETECTED YET. BE THE FIRST!
            </div>
          ) : (
            entries.map((entry, index) => {
              const isTop3 = index < 3;
              const medalColor =
                index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : "text-amber-600";

              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                    isTop3
                      ? "bg-white/10 border-cyan-500/40 shadow-sm"
                      : "bg-black/40 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 flex items-center justify-center font-black text-xs">
                      {isTop3 ? <Medal className={`w-4 h-4 ${medalColor}`} /> : `#${index + 1}`}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">{entry.name}</span>
                      <span className="text-[10px] text-gray-400">
                        {entry.mode} • {entry.distance}m • {entry.date}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-cyan-300">
                      {entry.score.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-gray-400 block uppercase">PTS</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
