import React, { useState } from "react";
import { X, ThumbsUp, Send, MessageSquare } from "lucide-react";
import { CommunityIdea } from "../types";

interface Comment {
  author: string;
  text: string;
  createdAt: string;
}

interface IdeaDetailModalProps {
  idea: CommunityIdea;
  onClose: () => void;
  onLike: (id: string) => void;
}

export function IdeaDetailModal({ idea, onClose, onLike }: IdeaDetailModalProps) {
  const [comments, setComments] = useState<Comment[]>([
    { author: "AlphaTrader", text: "Agreed on this setup, the EMA support looks very solid.", createdAt: "2 hours ago" },
    { author: "BearHunter", text: "Watch out for false breakouts here. Volume is a bit low.", createdAt: "5 hours ago" },
    { author: "CryptoWhale", text: "Already long since the double bottom! Let's fly.", createdAt: "Yesterday" },
  ]);
  const [newComment, setNewComment] = useState("");
  const [commenterName, setCommenterName] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commenterName.trim()) return;

    const added: Comment = {
      author: commenterName,
      text: newComment,
      createdAt: "Just now",
    };

    setComments([added, ...comments]);
    setNewComment("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-3xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[75vh] shadow-[10px_10px_0px_0px_#000000]">
        {/* Left Side: Image & Content Analysis */}
        <div className="w-full md:w-3/5 flex flex-col overflow-y-auto border-r-2 border-black text-left">
          {/* Main Visual */}
          <div className="relative aspect-video w-full bg-black shrink-0 border-b-2 border-black">
            <img src={idea.imageUrl} alt={idea.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute top-3 left-3 bg-black border border-white text-white text-[10px] font-mono font-black uppercase px-2.5 py-1">
              {idea.sentiment}
            </div>
          </div>

          <div className="p-6 space-y-4">
            <span className="text-[10px] bg-yellow-200 border-2 border-black text-black font-mono font-black px-2.5 py-1 uppercase tracking-wider">
              {idea.ticker}
            </span>
            <h3 className="text-xl font-black text-black uppercase tracking-tight leading-snug">{idea.title}</h3>
            
            {/* Author */}
            <div className="flex items-center gap-3 py-1.5 border-y-2 border-black">
              <div className={`w-7 h-7 bg-black text-white flex items-center justify-center font-mono font-black text-xs`}>
                {idea.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-black text-black font-mono uppercase">{idea.author}</p>
                <p className="text-[10px] text-gray-500 font-mono">Published on {idea.createdAt}</p>
              </div>
            </div>

            {/* Main Text */}
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-sans">
              {idea.description}
            </p>
          </div>
        </div>

        {/* Right Side: Interactive comments & likes */}
        <div className="w-full md:w-2/5 flex flex-col bg-[#fbfbfa] overflow-hidden text-left">
          {/* Header */}
          <div className="p-4 border-b-2 border-black flex items-center justify-between bg-yellow-200">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-black" />
              <span className="text-xs font-mono font-black uppercase text-black">Discussion</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Likes counter area */}
          <div className="p-4 border-b-2 border-black flex justify-between items-center bg-white">
            <span className="text-[10px] font-mono uppercase text-gray-500 font-bold">Agree Setup?</span>
            <button
              onClick={() => onLike(idea.id)}
              className="flex items-center gap-1.5 bg-white hover:bg-black hover:text-white text-black text-xs font-black py-1.5 px-3 uppercase border-2 border-black transition-all brutalist-shadow cursor-pointer"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>AGREE ({idea.likes})</span>
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-[#fdfdfc]">
            {comments.map((comment, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-black text-black uppercase">{comment.author}</span>
                  <span className="text-[9px] text-gray-500 font-mono uppercase">{comment.createdAt}</span>
                </div>
                <p className="text-xs text-black bg-white p-2.5 border-2 border-black leading-relaxed">
                  {comment.text}
                </p>
              </div>
            ))}
          </div>

          {/* Post Comment Form */}
          <form onSubmit={handleAddComment} className="p-4 border-t-2 border-black bg-white space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Name"
                value={commenterName}
                onChange={(e) => setCommenterName(e.target.value)}
                className="w-1/3 bg-white border-2 border-black py-1.5 px-2.5 text-xs text-black font-mono focus:outline-none focus:bg-yellow-50 placeholder-gray-400"
              />
              <input
                type="text"
                required
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-2/3 bg-white border-2 border-black py-1.5 px-2.5 text-xs text-black font-mono focus:outline-none focus:bg-yellow-50 placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-black text-white hover:bg-white hover:text-black border-2 border-black p-2 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
