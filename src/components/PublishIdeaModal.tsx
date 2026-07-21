import React, { useState } from "react";
import { X } from "lucide-react";
import { CommunityIdea, SentimentType } from "../types";

interface PublishIdeaModalProps {
  onClose: () => void;
  onPublish: (idea: Omit<CommunityIdea, "id" | "likes" | "comments" | "createdAt">) => void;
}

export function PublishIdeaModal({ onClose, onPublish }: PublishIdeaModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ticker, setTicker] = useState("");
  const [sentiment, setSentiment] = useState<SentimentType>("Long");
  const [author, setAuthor] = useState("");
  const [selectedChartIndex, setSelectedChartIndex] = useState(0);

  // Pre-configured elegant trade chart screenshot links
  const chartOptions = [
    "https://lh3.googleusercontent.com/aida/AP1WRLsub0HArgsRCiAXhzV99JwYnq89RmQM0NsYHx_qK3_s0CQWvPdHNW4Fn_eONpEqJt4thIyIi80oUkXnIsse8rZMzQZFOUEseYxYYr51Ork5Igw-Uw6pUx-bBDhhOPjrdm74_KoxB00iKWrnyrcNUg9L0xvToBXFrF7_3DrTZnbta0kisIK_Z60M-OY2l0TA4sOP-UeYP9AWyiByCdgskLr-bZw6Gynq_6U0aMftUV531vECWjzSW9YRFTfy", // Rocket Lab / support/demand
    "https://lh3.googleusercontent.com/aida/AP1WRLtvPqqNijGWPLcicoe1kUfgBdUQrGiwfOCWH6fbZsSUBSh131qJ20P5ZU1QLzMuoVyFy0_rx-hMffa8mkfADTvF2-gEcBwc1c048Oe4C7xGnSuGYg7EWrP0yJ2l6-WhSBQVGMIFk3MuP3KKSGq2a7SuSWo8VRGD8r0sXfpKOvxOV7wrfAp-Rrh2chz_YSSBhlwY3a02mCa7Uf40-lTltAFlVpaHHyYAYYMJhXdVnBn1Nwq1DRwJzY6YZ1vT", // Apple Chart flag
    "https://lh3.googleusercontent.com/aida/AP1WRLsDVWS2rh1EixuIGHIOmPdiaemTO31pgxlS5g2G8c5rmOhCh_2St1W2PGf3ehIuHckpzlBIUETJ7Pa_PP95Pyya-bthpa-ud230QQfQ_CfBOTi4lbNUZbefprSdUyCRgIhoUKtTK1luICSSQS6iPi9xr4Kytvn4z3xO0GbrUp_I8rH3YULakNu7ROmw533OBWS0i4BPn32ZHEx0fTjKrq7Rh-7j2bdHY9X_kiheQcIr5Tu-rJiCNSloCJr4", // SPCX Channel index
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !ticker || !author) {
      alert("Please fill in all fields.");
      return;
    }

    // Determine random nice color gradient for avatar
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-pink-500 to-rose-600",
      "from-amber-400 to-orange-500",
      "from-emerald-400 to-teal-600",
      "from-purple-500 to-pink-600",
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    onPublish({
      title,
      description,
      ticker: ticker.toUpperCase().replace(/\s+/g, ""),
      sentiment,
      author,
      imageUrl: chartOptions[selectedChartIndex],
      avatarColor: randomGradient,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-lg overflow-hidden flex flex-col shadow-[8px_8px_0px_0px_#000000]">
        <div className="p-5 border-b-2 border-black flex items-center justify-between bg-yellow-200">
          <h3 className="text-lg font-black uppercase italic tracking-tight text-black">Publish Market Idea</h3>
          <button
            onClick={onClose}
            className="p-1.5 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Author Name */}
          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-1.5">Your Username</label>
            <input
              type="text"
              required
              placeholder="e.g. TradeMaster99"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-white border-2 border-black py-2 px-3 text-sm text-black focus:outline-none focus:bg-gray-50 placeholder-gray-400 font-mono"
            />
          </div>

          {/* Ticker & Sentiment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-black text-black uppercase mb-1.5">Asset Ticker</label>
              <input
                type="text"
                required
                placeholder="e.g. BTCUSD"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-full bg-white border-2 border-black py-2 px-3 text-sm text-black focus:outline-none focus:bg-gray-50 placeholder-gray-400 uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-black text-black uppercase mb-1.5">Stance</label>
              <select
                value={sentiment}
                onChange={(e) => setSentiment(e.target.value as SentimentType)}
                className="w-full bg-white border-2 border-black py-2 px-3 text-sm text-black focus:outline-none font-mono"
              >
                <option value="Long">🟢 Long / Bullish</option>
                <option value="Short">🔴 Short / Bearish</option>
                <option value="Neutral">⚪ Neutral</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-1.5">Idea Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Bitcoin Double Bottom Breakout Imminent!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border-2 border-black py-2 px-3 text-sm text-black focus:outline-none focus:bg-gray-50 placeholder-gray-400 font-sans"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-1.5">Detailed Analysis</label>
            <textarea
              required
              rows={4}
              placeholder="Explain your technical strategy, chart patterns, oscillators or fundamentals supporting this stance..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border-2 border-black py-2 px-3 text-sm text-black focus:outline-none focus:bg-gray-50 placeholder-gray-400 resize-none leading-relaxed font-sans"
            />
          </div>

          {/* Chart template picker */}
          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-2">Select Chart Template</label>
            <div className="grid grid-cols-3 gap-3">
              {chartOptions.map((chart, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedChartIndex(idx)}
                  className={`aspect-video overflow-hidden border-2 cursor-pointer relative group transition-all ${
                    selectedChartIndex === idx ? "border-black scale-95" : "border-gray-300 hover:border-black"
                  }`}
                >
                  <img src={chart} alt="Chart style" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[9px] bg-black text-white font-black uppercase px-1.5 py-0.5 border border-white font-mono">Style {idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex gap-3 border-t-2 border-black">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-white hover:bg-gray-100 text-black border-2 border-black font-black py-2.5 text-xs uppercase tracking-wider transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 bg-black hover:bg-gray-900 text-white font-black py-2.5 text-xs uppercase tracking-wider transition-all brutalist-shadow"
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
