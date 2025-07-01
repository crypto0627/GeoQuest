'use client'

import React from "react";
import { formatWalletAddress } from "@/lib/utils";
import type { MapNode } from "@/types/nodeType";

interface InfoBoxProps {
  node: MapNode;
  pos: { x: number; y: number };
  onClose: () => void;
  onStart?: () => void;
}

export default function InfoBox({ node, pos, onClose, onStart }: InfoBoxProps) {
  return (
    <div
      className="absolute z-50 flex flex-col items-center"
      style={{
        left: pos.x,
        top: pos.y - 60,
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'auto',
      }}
    >
      <div className="relative bg-gradient-to-br from-white via-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-2xl px-5 py-4 min-w-[200px] max-w-xs text-sm animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold shadow"><span style={{fontSize:18}}>★</span></span>
          <span className="font-bold text-base text-blue-900 truncate" title={node.name}>{node.name}</span>
        </div>
        <div className="mb-1 text-blue-800"><span className="font-semibold">Creator:</span> {formatWalletAddress(node.creator)}</div>
        <div className="flex items-center gap-1 mb-1 text-blue-800">
          <span className="font-semibold">Difficulty:</span>
          <span className="flex items-center">
            {Array.from({ length: node.difficulty || 1 }).map((_, i) => (
              <span key={i} className="text-yellow-400" style={{fontSize:16}}>★</span>
            ))}
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          {node.gameUrl && (
            <button
              onClick={onStart}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs font-semibold shadow"
            >
              Start
            </button>
          )}
          <button
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-xs font-semibold border border-gray-300 shadow"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 