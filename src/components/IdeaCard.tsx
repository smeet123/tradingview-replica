import React from "react";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { CommunityIdea } from "../types";

interface IdeaCardProps {
  idea: CommunityIdea;
  onLike: (id: string) => void;
  onSelect: (idea: CommunityIdea) => void;
}

export function IdeaCard({ idea, onLike, onSelect }: IdeaCardProps) {
  const getSentimentBadge = (sentiment: "Long" | "Short" | "Neutral") => {
    switch (sentiment) {
      case "Long":
        return <span className="bg-[#22c55e] text-black border border-black text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">Long</span>;
      case "Short":
        return <span className="bg-[#ef4444] text-white border border-black text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">Short</span>;
      default:
        return <span className="bg-gray-200 text-black border border-black text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">Neutral</span>;
    }
  };

  return (
    <div className="bg-white border-2 border-black overflow-hidden flex flex-col h-full brutalist-shadow brutalist-shadow-hover transition-all duration-300">
      {/* Chart Image Panel with stark border underneath */}
      <div className="aspect-video w-full bg-gray-100 relative cursor-pointer overflow-hidden group border-b-2 border-black" onClick={() => onSelect(idea)}>
        <img
          alt={idea.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={idea.imageUrl}
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2 z-10">
          {getSentimentBadge(idea.sentiment)}
        </div>
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-xs bg-black text-white font-bold py-1.5 px-4 border border-white tracking-widest uppercase">View Idea</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5 flex-grow flex flex-col">
        <h4
          className="font-black text-lg text-black mb-2 line-clamp-2 hover:underline cursor-pointer uppercase tracking-tight"
          onClick={() => onSelect(idea)}
        >
          {idea.title}
        </h4>
        <p className="text-[#374151] text-xs line-clamp-3 mb-4 leading-relaxed font-sans">
          {idea.description}
        </p>

        {/* Footer info */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-black">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 bg-black border border-black rounded-full flex items-center justify-center font-bold text-[10px] text-white uppercase`}>
              {idea.author.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-black uppercase tracking-tight">{idea.author}</span>
              <span className="text-[9px] text-[#4b5563] font-mono">{idea.createdAt}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Likes count */}
            <button
              onClick={() => onLike(idea.id)}
              className="flex items-center gap-1.5 text-xs text-black font-bold hover:bg-gray-100 p-1 px-2 border border-transparent hover:border-black transition-colors cursor-pointer"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{idea.likes}</span>
            </button>

            {/* Comments count */}
            <div className="flex items-center gap-1 text-xs text-black font-medium">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{idea.comments}</span>
            </div>

            <span className="text-[10px] text-black bg-yellow-200 border border-black px-1.5 py-0.5 font-mono font-bold tracking-wider uppercase">
              {idea.ticker}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
