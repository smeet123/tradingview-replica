import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Globe,
  User,
  Plus,
  Compass,
  X,
  PlusCircle,
  FolderHeart,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from "lucide-react";
import { Asset, CommunityIdea } from "./types";
import { INITIAL_ASSETS, INITIAL_IDEAS } from "./data/marketData";
import { TradingChart } from "./components/TradingChart";
import { IdeaCard } from "./components/IdeaCard";
import { PublishIdeaModal } from "./components/PublishIdeaModal";
import { SpaceStoryModal } from "./components/SpaceStoryModal";
import { IdeaDetailModal } from "./components/IdeaDetailModal";

export default function App() {
  // Financial Assets state (fluctuates dynamically)
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem("tv_assets");
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  // Community Ideas state
  const [ideas, setIdeas] = useState<CommunityIdea[]>(() => {
    const saved = localStorage.getItem("tv_ideas");
    return saved ? JSON.parse(saved) : INITIAL_IDEAS;
  });

  // Watchlist state (symbols list)
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("tv_watchlist");
    return saved ? JSON.parse(saved) : ["Bitcoin", "S&P 500", "Gold"];
  });

  // Active layouts/modals
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<CommunityIdea | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [isWatchlistSidebarOpen, setIsWatchlistSidebarOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Tabs for Community section
  const [communityTab, setCommunityTab] = useState<"Editors' picks" | "Popular" | "More">("Editors' picks");

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem("tv_assets", JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem("tv_ideas", JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem("tv_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Global hotkeys: Ctrl+K focuses search, ESC closes everything
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSelectedAsset(null);
        setSelectedIdea(null);
        setIsPublishModalOpen(false);
        setIsSpaceModalOpen(false);
        setIsWatchlistSidebarOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Simulate dynamic asset price ticking (continuous market moves)
  useEffect(() => {
    const timer = setInterval(() => {
      setAssets((prevAssets) => {
        return prevAssets.map((asset) => {
          // select a subset of assets to fluctuate to simulate volatility
          if (Math.random() > 0.4) {
            const vol = asset.symbol === "TOTAL" ? 0.0008 : 0.0015;
            const changeFactor = (Math.random() - 0.49) * 2 * vol;
            const delta = asset.price * changeFactor;
            const newPrice = asset.price + delta;

            const updatedHistory = [...asset.history];
            if (updatedHistory.length > 0) {
              const lastIndex = updatedHistory.length - 1;
              updatedHistory[lastIndex] = {
                ...updatedHistory[lastIndex],
                price: parseFloat(newPrice.toFixed(asset.price < 10 ? 4 : 2)),
              };
            }

            return {
              ...asset,
              price: parseFloat(newPrice.toFixed(asset.price < 10 ? 4 : 2)),
              change: asset.change + delta,
              changePercent: parseFloat((asset.changePercent + changeFactor * 100).toFixed(2)),
              history: updatedHistory,
            };
          }
          return asset;
        });
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Watchlist methods
  const handleToggleWatch = (symbol: string) => {
    if (watchlist.includes(symbol)) {
      setWatchlist(watchlist.filter((s) => s !== symbol));
    } else {
      setWatchlist([...watchlist, symbol]);
    }
  };

  // Like ideas method
  const handleLikeIdea = (id: string) => {
    setIdeas((prev) =>
      prev.map((idea) => (idea.id === id ? { ...idea, likes: idea.likes + 1 } : idea))
    );
    // Update active selected idea if open
    if (selectedIdea && selectedIdea.id === id) {
      setSelectedIdea((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
    }
  };

  // Publish dynamic custom idea
  const handlePublishIdea = (draft: Omit<CommunityIdea, "id" | "likes" | "comments" | "createdAt">) => {
    const newIdea: CommunityIdea = {
      ...draft,
      id: `custom-${Date.now()}`,
      likes: Math.floor(Math.random() * 12 + 3),
      comments: 0,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setIdeas([newIdea, ...ideas]);
    setIsPublishModalOpen(false);
  };

  // Category sorting
  const getCategorizedAssets = (category: "indices" | "crypto" | "currencies" | "futures") => {
    return assets.filter((asset) => asset.category === category);
  };

  // Search filter
  const filteredSearchAssets = searchQuery.trim()
    ? assets.filter(
        (asset) =>
          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  // Safe search click
  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  return (
    <div className="bg-white text-black min-h-screen flex flex-col font-sans select-none antialiased border-[12px] border-black">
      {/* HEADER BAR */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b-4 border-black px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Brand Logo */}
          <a className="flex items-center gap-2 group cursor-pointer" href="/">
            <svg fill="none" height="28" viewBox="0 0 36 28" width="36" xmlns="http://www.w3.org/2000/svg">
              <path className="stroke-black group-hover:stroke-gray-600 transition-colors" d="M14 2L4 24" strokeWidth="4" strokeLinecap="round" />
              <path className="stroke-black group-hover:stroke-gray-600 transition-colors" d="M22 2L32 24" strokeWidth="4" strokeLinecap="round" />
              <circle className="fill-black group-hover:fill-gray-600 transition-all" cx="18" cy="14" r="4" />
            </svg>
            <span className="font-black text-base uppercase tracking-wider hidden sm:inline text-black group-hover:text-gray-600 transition-colors">
              Studio_Archive
            </span>
          </a>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-[#4b5563]">
            <a className="hover:text-black hover:underline transition-colors" href="#market-summary">Products</a>
            <a className="hover:text-black hover:underline transition-colors" href="#community-ideas">Community</a>
            <a className="hover:text-black hover:underline transition-colors" href="#market-summary">Markets</a>
            <a className="hover:text-black hover:underline transition-colors cursor-pointer" onClick={() => setIsSpaceModalOpen(true)}>Brokers</a>
            <a className="hover:text-black hover:underline transition-colors cursor-pointer" onClick={() => setIsWatchlistSidebarOpen(true)}>Watchlist</a>
          </nav>
        </div>

        {/* Search bar & Quick Actions */}
        <div className="flex items-center gap-4">
          {/* Functional Search Bar */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-black" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="SEARCH ASSET (CTRL+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="bg-white text-black text-xs uppercase font-bold py-1.5 pl-10 pr-4 w-60 border-2 border-black focus:bg-gray-50 focus:outline-none transition-all placeholder-gray-500"
            />
            
            {/* Search Dropdown Results */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute top-10 left-0 right-0 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-2 max-h-60 overflow-y-auto space-y-1 z-50 animate-fade-in">
                {filteredSearchAssets.length > 0 ? (
                  filteredSearchAssets.map((asset) => (
                    <div
                      key={asset.symbol}
                      onMouseDown={() => handleSelectAsset(asset)}
                      className="p-2 hover:bg-black hover:text-white rounded-none cursor-pointer flex items-center justify-between text-left"
                    >
                      <div>
                        <p className="text-xs font-bold uppercase">{asset.symbol}</p>
                        <p className="text-[10px] uppercase opacity-80 line-clamp-1">{asset.name}</p>
                      </div>
                      <span className={`text-[11px] font-black ${asset.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {asset.changePercent >= 0 ? "+" : ""}{asset.changePercent}%
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 p-3 text-center uppercase font-bold">No assets found</p>
                )}
              </div>
            )}
          </div>

          {/* Watchlist Counter Widget */}
          <button
            onClick={() => setIsWatchlistSidebarOpen(true)}
            className="flex items-center gap-1.5 bg-white hover:bg-gray-100 text-xs font-black uppercase py-1.5 px-3 border-2 border-black transition-colors cursor-pointer"
          >
            <FolderHeart className="w-4 h-4 text-red-600" />
            <span className="hidden sm:inline">Watchlist</span>
            <span className="bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-none border border-red-300">
              {watchlist.length}
            </span>
          </button>

          {/* User & Lang Options */}
          <div className="flex items-center gap-3 text-xs font-bold uppercase">
            <button className="flex items-center gap-1 font-black text-black hover:underline transition-colors">
              <Globe className="w-4 h-4" />
              EN
            </button>
            <button className="p-1 text-black hover:bg-gray-100 border-2 border-transparent hover:border-black transition-colors">
              <User className="w-5 h-5" />
            </button>
            <a
              onClick={() => setIsWatchlistSidebarOpen(true)}
              className="bg-black hover:bg-gray-800 text-white font-black py-2 px-4 border-2 border-black text-xs transition-all cursor-pointer shadow-md uppercase tracking-wider"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* WATCHLIST DRAWER/SIDEBAR */}
      {isWatchlistSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-l-4 border-black w-full max-w-sm h-full flex flex-col shadow-2xl p-6">
            <div className="flex justify-between items-center pb-4 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <FolderHeart className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-black uppercase italic tracking-tight">Your Watchlist</h3>
              </div>
              <button
                onClick={() => setIsWatchlistSidebarOpen(false)}
                className="p-1.5 border-2 border-black hover:bg-black hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List items */}
            <div className="flex-grow overflow-y-auto py-4 space-y-2">
              {watchlist.length > 0 ? (
                assets
                  .filter((a) => watchlist.includes(a.symbol))
                  .map((asset) => {
                    const priceIsPositive = asset.changePercent >= 0;
                    return (
                      <div
                        key={asset.symbol}
                        className="bg-white border-2 border-black p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer transition-all brutalist-shadow"
                        onClick={() => {
                          setSelectedAsset(asset);
                          setIsWatchlistSidebarOpen(false);
                        }}
                      >
                        <div className="text-left">
                          <p className="text-xs font-black text-black uppercase">{asset.symbol}</p>
                          <p className="text-[10px] text-gray-500 uppercase line-clamp-1">{asset.name}</p>
                        </div>

                        <div className="text-right flex items-center gap-3">
                          <div>
                            <p className="text-xs font-bold text-black font-mono">
                              {asset.symbol === "TOTAL"
                                ? formatLargeNumber(asset.price)
                                : `$${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.price < 10 ? 4 : 2 })}`}
                            </p>
                            <p className={`text-[10px] font-black ${priceIsPositive ? "text-green-600" : "text-red-600"}`}>
                              {priceIsPositive ? "+" : ""}{asset.changePercent}%
                            </p>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleWatch(asset.symbol);
                            }}
                            className="p-1 border border-black hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                  <FolderHeart className="w-12 h-12 opacity-30 mb-3" />
                  <p className="text-sm font-black uppercase">Watchlist Empty</p>
                  <p className="text-xs mt-1 leading-relaxed">
                    Browse assets below and click the "+ Watchlist" button inside any asset's chart window to build your customizable live watch panel.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-100 border-2 border-black text-xs text-black leading-relaxed">
              <span className="font-black uppercase tracking-wider block mb-1">💡 Interactive Ticking</span>
              Markets fluctuation is live. Prices change realistically every few seconds. Click on any watchlist card to analyze the technical indicators.
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative min-h-[580px] flex flex-col items-center justify-center text-center overflow-hidden pt-24 pb-16 bg-[#fbfbfa] border-b-4 border-black">
        {/* Subtle grid paper pattern backdrop overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none select-none" style={{ backgroundImage: "radial-gradient(#000 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }}></div>

        <div className="relative z-10 px-6 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] mb-4 bg-yellow-200 border border-black px-3 py-1">
            Financial Identity / Archive 2026
          </span>
          <h1 className="text-6xl md:text-8xl font-black italic mb-6 tracking-tighter uppercase leading-[0.85] text-black">
            LOOK FIRST<br/>/ THEN LEAP.
          </h1>
          <p className="text-xs uppercase font-mono font-black tracking-widest text-[#4b5563] mb-10 max-w-lg leading-relaxed">
            The best trades require raw analytical research, then absolute commitment.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => {
                // Focus on S&P 500 or show chart
                const spx = assets.find((a) => a.symbol === "S&P 500");
                if (spx) setSelectedAsset(spx);
              }}
              className="bg-black hover:bg-white hover:text-black hover:border-black text-white font-black py-4 px-10 border-2 border-black text-xs tracking-wider uppercase transition-all duration-200 brutalist-shadow"
            >
              Get started for free
            </button>
            <button
              onClick={() => setIsSpaceModalOpen(true)}
              className="bg-white hover:bg-black hover:text-white text-black font-black py-4 px-10 border-2 border-black text-xs tracking-wider uppercase transition-all duration-200"
            >
              Learn Space Mission
            </button>
          </div>
          <p className="text-[#6b7280] font-mono text-[10px] uppercase font-bold tracking-wider mt-4">$0 forever, no credit card required</p>
        </div>

        {/* Space Mission brief bottom-right widget */}
        <div className="absolute bottom-6 right-6 z-10 hidden md:flex items-center gap-4 text-right bg-white p-3 border-2 border-black brutalist-shadow">
          <div className="text-black text-left">
            <p className="font-black text-[9px] uppercase tracking-wider text-black">Space Story 2026</p>
            <p className="text-[9px] text-gray-500 font-mono mt-0.5">Scott "Kidd" Poteet</p>
          </div>
          <button
            onClick={() => setIsSpaceModalOpen(true)}
            className="flex items-center gap-1 bg-black text-white px-3 py-1.5 border border-black text-[9px] font-black uppercase tracking-wider hover:bg-white hover:text-black transition-all cursor-pointer"
          >
            <Compass className="w-3 h-3 text-yellow-300" />
            Launch
          </button>
        </div>
      </section>

      {/* INTRO/MANTRA CARD */}
      <section className="bg-white py-16 px-6 border-b-4 border-black text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl font-black italic uppercase tracking-tight mb-4">
            WHERE THE WORLD DOES MARKETS.
          </h2>
          <p className="text-xs uppercase font-mono font-bold text-[#4b5563] mb-8 max-w-xl mx-auto leading-relaxed">
            Join 100 million traders and investors taking the financial future into their own hands with raw analytical precision.
          </p>
          <a
            onClick={() => {
              const btc = assets.find((a) => a.symbol === "Bitcoin");
              if (btc) setSelectedAsset(btc);
            }}
            className="text-black border-2 border-black bg-yellow-200 hover:bg-yellow-300 font-black text-xs px-6 py-2.5 inline-flex items-center gap-2 uppercase tracking-wider transition-all cursor-pointer brutalist-shadow"
          >
            Explore interactive charts
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* MARKET SUMMARY GRID */}
      <section id="market-summary" className="bg-white py-16 px-6 border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-1 cursor-pointer text-black hover:underline group">
            MARKET SUMMARY
            <ChevronRight className="w-6 h-6 text-black group-hover:translate-x-1 transition-transform" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* COLUMN 1: MAJOR INDICES */}
            <div className="bg-white border-2 border-black p-5 brutalist-shadow transition-all duration-300">
              {(() => {
                const spx = getCategorizedAssets("indices").find((a) => a.symbol === "S&P 500");
                const rest = getCategorizedAssets("indices").filter((a) => a.symbol !== "S&P 500");
                if (!spx) return null;
                const spxIsPositive = spx.changePercent >= 0;
                return (
                  <div className="flex flex-col h-full">
                    <div
                      onClick={() => setSelectedAsset(spx)}
                      className="flex justify-between items-start mb-6 cursor-pointer group/card text-left"
                    >
                      <div>
                        <h3 className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mb-1.5 font-bold">Major indices</h3>
                        <p className="text-lg font-black text-black group-hover/card:underline transition-all uppercase">{spx.symbol}</p>
                        <p className="text-gray-400 text-[9px] font-mono uppercase">{spx.exchange}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-base font-black font-mono ${spxIsPositive ? "text-green-600" : "text-red-600"}`}>
                          {spxIsPositive ? "+" : ""}{spx.changePercent}%
                        </p>
                        <p className="text-black text-[10px] font-mono">{spx.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>

                    <ul className="space-y-3.5 text-xs">
                      {rest.map((asset) => {
                        const isPos = asset.changePercent >= 0;
                        return (
                          <li
                            key={asset.symbol}
                            onClick={() => setSelectedAsset(asset)}
                            className="flex justify-between items-center cursor-pointer hover:bg-gray-100 py-1.5 px-2 border border-transparent hover:border-black transition-colors font-mono"
                          >
                            <span className="font-bold text-black uppercase">{asset.symbol}</span>
                            <span className={`font-black ${isPos ? "text-green-600" : "text-red-600"}`}>
                              {isPos ? "+" : ""}{asset.changePercent}%
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })()}
            </div>

            {/* COLUMN 2: CRYPTO */}
            <div className="bg-white border-2 border-black p-5 brutalist-shadow transition-all duration-300">
              {(() => {
                const total = getCategorizedAssets("crypto").find((a) => a.symbol === "TOTAL");
                const rest = getCategorizedAssets("crypto").filter((a) => a.symbol !== "TOTAL");
                if (!total) return null;
                const totalIsPositive = total.changePercent >= 0;
                return (
                  <div className="flex flex-col h-full">
                    <div
                      onClick={() => setSelectedAsset(total)}
                      className="flex justify-between items-start mb-6 cursor-pointer group/card text-left"
                    >
                      <div>
                        <h3 className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mb-1.5 font-bold">Crypto market cap</h3>
                        <p className="text-lg font-black text-black group-hover/card:underline transition-all uppercase">{total.symbol}</p>
                        <p className="text-gray-400 text-[9px] font-mono uppercase">{total.exchange}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-base font-black font-mono ${totalIsPositive ? "text-green-600" : "text-red-600"}`}>
                          {totalIsPositive ? "+" : ""}{total.changePercent}%
                        </p>
                        <p className="text-black text-[10px] font-mono">{formatLargeNumber(total.price)}</p>
                      </div>
                    </div>

                    <ul className="space-y-3.5 text-xs">
                      {rest.map((asset) => {
                        const isPos = asset.changePercent >= 0;
                        const symbolInitial = asset.symbol === "Bitcoin" ? "₿" : "Ξ";
                        const symbolColor = asset.symbol === "Bitcoin" ? "bg-orange-500" : "bg-blue-600";
                        return (
                          <li
                            key={asset.symbol}
                            onClick={() => setSelectedAsset(asset)}
                            className="flex justify-between items-center cursor-pointer hover:bg-gray-100 py-1.5 px-2 border border-transparent hover:border-black transition-colors font-mono"
                          >
                            <div className="flex items-center gap-1.5">
                              <div className={`w-4 h-4 ${symbolColor} rounded-full flex items-center justify-center text-[9px] text-white font-bold`}>
                                {symbolInitial}
                              </div>
                              <span className="font-bold text-black uppercase">{asset.symbol}</span>
                            </div>
                            <span className={`font-black ${isPos ? "text-green-600" : "text-red-600"}`}>
                              {isPos ? "+" : ""}{asset.changePercent}%
                            </span>
                          </li>
                        );
                      })}
                      <li
                        onClick={() => setSelectedAsset(rest[0])}
                        className="flex justify-between items-center text-black hover:underline transition-colors pt-1.5 cursor-pointer border-t border-black font-mono font-bold text-[10px] uppercase"
                      >
                        <span>See all coins</span>
                        <ChevronRight className="w-4 h-4" />
                      </li>
                    </ul>
                  </div>
                );
              })()}
            </div>

            {/* COLUMN 3: CURRENCIES */}
            <div className="bg-white border-2 border-black p-5 brutalist-shadow transition-all duration-300">
              {(() => {
                const dxy = getCategorizedAssets("currencies").find((a) => a.symbol === "DXY");
                const rest = getCategorizedAssets("currencies").filter((a) => a.symbol !== "DXY");
                if (!dxy) return null;
                const dxyIsPositive = dxy.changePercent >= 0;
                return (
                  <div className="flex flex-col h-full">
                    <div
                      onClick={() => setSelectedAsset(dxy)}
                      className="flex justify-between items-start mb-6 cursor-pointer group/card text-left"
                    >
                      <div>
                        <h3 className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mb-1.5 font-bold">US Dollar index</h3>
                        <p className="text-lg font-black text-black group-hover/card:underline transition-all uppercase">{dxy.symbol}</p>
                        <p className="text-gray-400 text-[9px] font-mono uppercase">{dxy.exchange}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-base font-black font-mono ${dxyIsPositive ? "text-green-600" : "text-red-600"}`}>
                          {dxyIsPositive ? "+" : ""}{dxy.changePercent}%
                        </p>
                        <p className="text-black text-[10px] font-mono">{dxy.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <ul className="space-y-3.5 text-xs">
                      {rest.map((asset) => {
                        const isPos = asset.changePercent >= 0;
                        return (
                          <li
                            key={asset.symbol}
                            onClick={() => setSelectedAsset(asset)}
                            className="flex justify-between items-center cursor-pointer hover:bg-gray-100 py-1.5 px-2 border border-transparent hover:border-black transition-colors font-mono"
                          >
                            <span className="font-bold text-black uppercase">{asset.symbol}</span>
                            <span className={`font-black ${isPos ? "text-green-600" : "text-red-600"}`}>
                              {isPos ? "+" : ""}{asset.changePercent}%
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })()}
            </div>

            {/* COLUMN 4: FUTURES / YIELDS */}
            <div className="bg-white border-2 border-black p-5 brutalist-shadow transition-all duration-300">
              {(() => {
                const bond = getCategorizedAssets("futures").find((a) => a.symbol === "US10Y");
                const rest = getCategorizedAssets("futures").filter((a) => a.symbol !== "US10Y");
                if (!bond) return null;
                const bondIsPositive = bond.changePercent >= 0;
                return (
                  <div className="flex flex-col h-full">
                    <div
                      onClick={() => setSelectedAsset(bond)}
                      className="flex justify-between items-start mb-6 cursor-pointer group/card text-left"
                    >
                      <div>
                        <h3 className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mb-1.5 font-bold">US 10Y yield</h3>
                        <p className="text-lg font-black text-black group-hover/card:underline transition-all uppercase">{bond.symbol}</p>
                        <p className="text-gray-400 text-[9px] font-mono uppercase">{bond.exchange}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-base font-black font-mono ${bondIsPositive ? "text-green-600" : "text-red-600"}`}>
                          {bondIsPositive ? "+" : ""}{bond.changePercent}%
                        </p>
                        <p className="text-black text-[10px] font-mono">{bond.price.toFixed(3)}%</p>
                      </div>
                    </div>

                    <ul className="space-y-3.5 text-xs">
                      {rest.map((asset) => {
                        const isPos = asset.changePercent >= 0;
                        return (
                          <li
                            key={asset.symbol}
                            onClick={() => setSelectedAsset(asset)}
                            className="flex justify-between items-center cursor-pointer hover:bg-gray-100 py-1.5 px-2 border border-transparent hover:border-black transition-colors font-mono"
                          >
                            <span className="font-bold text-black uppercase">{asset.symbol}</span>
                            <span className={`font-black ${isPos ? "text-green-600" : "text-red-600"}`}>
                              {isPos ? "+" : ""}{asset.changePercent}%
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY FEED SECTION */}
      <section id="community-ideas" className="bg-white py-16 px-6 border-t-4 border-black">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-3 flex items-center gap-1 cursor-pointer hover:underline text-black group">
                COMMUNITY IDEAS
                <ChevronRight className="w-6 h-6 text-black group-hover:translate-x-1 transition-transform" />
              </h2>
              <div className="flex gap-4 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                {(["Editors' picks", "Popular", "More"] as const).map((tab) => (
                  <span
                    key={tab}
                    onClick={() => setCommunityTab(tab)}
                    className={`cursor-pointer transition-colors pb-1 border-b-2 ${
                      communityTab === tab ? "text-black border-black font-black" : "hover:text-black border-transparent"
                    }`}
                  >
                    {tab}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsPublishModalOpen(true)}
                className="bg-black hover:bg-white hover:text-black border-2 border-black text-white font-black py-2.5 px-6 text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all brutalist-shadow grow sm:grow-0 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Publish Idea
              </button>
              <a
                onClick={() => setCommunityTab("Editors' picks")}
                className="text-black text-xs font-black uppercase tracking-wider hover:underline cursor-pointer"
              >
                See all picks
              </a>
            </div>
          </div>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <div key={idea.id}>
                <IdeaCard
                  idea={idea}
                  onLike={handleLikeIdea}
                  onSelect={(id) => setSelectedIdea(id)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#fbfbfa] border-t-4 border-black py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Products */}
          <div>
            <h5 className="font-black text-xs text-black uppercase tracking-wider mb-4">Products</h5>
            <ul className="space-y-3 text-xs text-gray-600 font-mono">
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer" onClick={() => setSelectedAsset(assets[0])}>Supercharts</a></li>
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer" onClick={() => setIsSpaceModalOpen(true)}>Pine Script™</a></li>
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer" onClick={() => setIsWatchlistSidebarOpen(true)}>Stock Screener</a></li>
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer">Economic Calendar</a></li>
            </ul>
          </div>
          {/* Community */}
          <div>
            <h5 className="font-black text-xs text-black uppercase tracking-wider mb-4">Community</h5>
            <ul className="space-y-3 text-xs text-gray-600 font-mono">
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer" onClick={() => setIsPublishModalOpen(true)}>Social network</a></li>
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer" onClick={() => setCommunityTab("Editors' picks")}>Ideas</a></li>
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer">Scripts</a></li>
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer">House Rules</a></li>
            </ul>
          </div>
          {/* Brokers */}
          <div>
            <h5 className="font-black text-xs text-black uppercase tracking-wider mb-4">Brokers</h5>
            <ul className="space-y-3 text-xs text-gray-600 font-mono">
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer">Featured</a></li>
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer">NinjaTrader</a></li>
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer">OKX</a></li>
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer">OANDA</a></li>
            </ul>
          </div>
          {/* About */}
          <div>
            <h5 className="font-black text-xs text-black uppercase tracking-wider mb-4">About</h5>
            <ul className="space-y-3 text-xs text-gray-600 font-mono">
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer" onClick={() => setIsSpaceModalOpen(true)}>Who we are</a></li>
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer" onClick={() => setIsSpaceModalOpen(true)}>Space mission</a></li>
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer">Careers</a></li>
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer">Media kit</a></li>
            </ul>
          </div>
          {/* Policy */}
          <div>
            <h5 className="font-black text-xs text-black uppercase tracking-wider mb-4">Policy</h5>
            <ul className="space-y-3 text-xs text-gray-600 font-mono">
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer">Terms of Use</a></li>
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer">Privacy Policy</a></li>
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer">Cookies Policy</a></li>
              <li><a className="hover:text-black hover:underline transition-colors cursor-pointer">Security</a></li>
            </ul>
          </div>
          {/* Social */}
          <div>
            <h5 className="font-black text-xs text-black uppercase tracking-wider mb-4">Social</h5>
            <div className="flex gap-4 flex-wrap">
              <a href="#" className="text-gray-500 hover:text-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t-2 border-black text-[10px] font-mono uppercase text-gray-500 gap-4">
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <p>© 2026 Studio_Archive. All rights reserved.</p>
            <p>Made by humans</p>
          </div>
          <div className="text-center md:text-right max-w-2xl font-bold leading-normal">
            Select market data provided by ICE Data Services. Select reference data provided by FactSet. Copyright © 2026 FactSet Research Systems Inc.
          </div>
        </div>
      </footer>

      {/* DYNAMIC MODALS AND DETAILS OVERLAYS */}
      
      {/* Interactive Chart & Gemini AI Modal */}
      {selectedAsset && (
        <TradingChart
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          isWatched={watchlist.includes(selectedAsset.symbol)}
          onToggleWatch={() => handleToggleWatch(selectedAsset.symbol)}
        />
      )}

      {/* Idea Detail Modal */}
      {selectedIdea && (
        <IdeaDetailModal
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
          onLike={handleLikeIdea}
        />
      )}

      {/* Publish Idea Modal */}
      {isPublishModalOpen && (
        <PublishIdeaModal
          onClose={() => setIsPublishModalOpen(false)}
          onPublish={handlePublishIdea}
        />
      )}

      {/* Space Mission brief Scott "Kidd" Poteet */}
      {isSpaceModalOpen && (
        <SpaceStoryModal
          onClose={() => setIsSpaceModalOpen(false)}
        />
      )}
    </div>
  );
}
