import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts";
import { Sparkles, X, Plus, Check, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { Asset } from "../types";

interface TradingChartProps {
  asset: Asset;
  onClose: () => void;
  isWatched: boolean;
  onToggleWatch: () => void;
}

export function TradingChart({ asset, onClose, isWatched, onToggleWatch }: TradingChartProps) {
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "1Y">("1M");
  const [chartType, setChartType] = useState<"area" | "line" | "bar">("area");
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [copied, setCopied] = useState(false);

  // Clear AI report when switching asset
  useEffect(() => {
    setAiReport(null);
  }, [asset]);

  // Adjust mock data multiplier for different timeframes
  const getFilteredData = () => {
    const history = asset.history;
    if (timeframe === "1D") return history.slice(-7);
    if (timeframe === "1W") return history.slice(-14);
    if (timeframe === "1M") return history;
    return history; // default
  };

  const currentData = getFilteredData();
  const priceIsPositive = asset.changePercent >= 0;
  const strokeColor = priceIsPositive ? "#16a34a" : "#dc2626";
  const fillColor = priceIsPositive ? "rgba(22, 163, 74, 0.1)" : "rgba(220, 38, 38, 0.1)";

  const fetchAiAnalysis = async () => {
    setLoadingAi(true);
    setAiReport(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker: asset.symbol,
          name: asset.name,
          price: asset.price,
          changePercent: asset.changePercent,
          category: asset.category,
          history: currentData,
        }),
      });
      const data = await response.json();
      if (data.analysis) {
        setAiReport(data.analysis);
      } else {
        setAiReport("Unable to fetch report. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setAiReport("Analysis failed to load. Please configure GEMINI_API_KEY or check server logs.");
    } finally {
      setLoadingAi(false);
    }
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const renderSimpleMarkdown = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={index} className="text-sm font-mono font-black text-black mt-5 mb-2 flex items-center gap-2 border-b-2 border-black pb-1 uppercase">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={index} className="text-xs text-black font-mono ml-4 list-disc mb-1 text-left">
            {line.substring(2)}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={index} className="h-2" />;
      }
      
      // Simple bold replacements **text** -> <strong>text</strong>
      const boldRegex = /\*\*(.*?)\*\*/g;
      let match;
      const elements: React.ReactNode[] = [];
      let lastIndex = 0;
      
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          elements.push(line.substring(lastIndex, match.index));
        }
        elements.push(<strong key={match.index} className="text-black font-black font-mono">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < line.length) {
        elements.push(line.substring(lastIndex));
      }

      return (
        <p key={index} className="text-xs text-gray-800 leading-relaxed mb-1.5 font-sans text-left">
          {elements.length > 0 ? elements : line}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-6xl overflow-hidden flex flex-col h-[90vh] shadow-[10px_10px_0px_0px_#000000]">
        {/* Header */}
        <div className="p-5 border-b-4 border-black flex items-center justify-between bg-yellow-200">
          <div className="flex flex-wrap items-center gap-4 text-left">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-black tracking-tight uppercase">{asset.symbol}</span>
                <span className="text-[9px] text-black font-mono font-black bg-white border border-black px-2 py-0.5 uppercase">
                  {asset.exchange}
                </span>
              </div>
              <h3 className="text-xs text-gray-700 font-mono font-bold mt-0.5 uppercase">{asset.name}</h3>
            </div>
            
            <div className="h-8 w-0.5 bg-black hidden md:block"></div>

            {/* Current Price and Change */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-black text-black">
                {asset.symbol === "TOTAL" ? formatLargeNumber(asset.price) : `$${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.price < 10 ? 4 : 2 })}`}
              </span>
              <span className={`text-sm font-black font-mono flex items-center ${priceIsPositive ? "text-green-600" : "text-red-600"}`}>
                {priceIsPositive ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                {priceIsPositive ? "+" : ""}{asset.changePercent}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleWatch}
              className={`flex items-center gap-1.5 text-xs font-black py-1.5 px-3 uppercase border-2 border-black transition-all brutalist-shadow cursor-pointer ${
                isWatched
                  ? "bg-green-100 text-black"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {isWatched ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {isWatched ? "In Watchlist" : "Watchlist"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area - split into Chart and Gemini AI Panel */}
        <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
          {/* Main Chart Column */}
          <div className="flex-grow flex flex-col p-5 overflow-y-auto">
            {/* Chart Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-white p-2 border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
              {/* Chart Style Toggles */}
              <div className="flex border-2 border-black bg-white p-0.5">
                {(["area", "line", "bar"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`text-[10px] font-mono font-black py-1 px-3 uppercase transition-all cursor-pointer ${
                      chartType === type
                        ? "bg-black text-white"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Timeframe Toggles */}
              <div className="flex border-2 border-black bg-white p-0.5">
                {(["1D", "1W", "1M", "1Y"] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`text-[10px] font-mono font-black py-1 px-3 transition-all cursor-pointer ${
                      timeframe === tf
                        ? "bg-black text-white"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Render Container */}
            <div className="flex-grow min-h-[300px] bg-[#fbfbfa] border-2 border-black p-3 flex flex-col justify-between">
              <ResponsiveContainer width="100%" height="90%">
                {chartType === "line" ? (
                  <LineChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="date" stroke="#000000" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#000000"
                      fontSize={11}
                      tickLine={false}
                      domain={["auto", "auto"]}
                      tickFormatter={(v) => (asset.symbol === "TOTAL" ? formatLargeNumber(v) : v.toString())}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#000000", borderHeight: "2px", borderStyle: "solid" }}
                      labelStyle={{ color: "#000000", fontSize: "11px", fontFamily: "monospace", fontWeight: "bold" }}
                      itemStyle={{ color: "#000000", fontSize: "12px", fontFamily: "monospace" }}
                    />
                    <Line type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={3} dot={false} />
                  </LineChart>
                ) : chartType === "bar" ? (
                  <BarChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="date" stroke="#000000" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#000000"
                      fontSize={11}
                      tickLine={false}
                      domain={["auto", "auto"]}
                      tickFormatter={(v) => (asset.symbol === "TOTAL" ? formatLargeNumber(v) : v.toString())}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#000000", borderHeight: "2px", borderStyle: "solid" }}
                      labelStyle={{ color: "#000000", fontSize: "11px", fontFamily: "monospace", fontWeight: "bold" }}
                      itemStyle={{ color: "#000000", fontSize: "12px", fontFamily: "monospace" }}
                    />
                    <Bar dataKey="price" fill={strokeColor} stroke="#000000" strokeWidth={1} radius={0} />
                  </BarChart>
                ) : (
                  <AreaChart data={currentData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={strokeColor} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="date" stroke="#000000" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#000000"
                      fontSize={11}
                      tickLine={false}
                      domain={["auto", "auto"]}
                      tickFormatter={(v) => (asset.symbol === "TOTAL" ? formatLargeNumber(v) : v.toString())}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#000000", borderHeight: "2px", borderStyle: "solid" }}
                      labelStyle={{ color: "#000000", fontSize: "11px", fontFamily: "monospace", fontWeight: "bold" }}
                      itemStyle={{ color: "#000000", fontSize: "12px", fontFamily: "monospace" }}
                    />
                    <Area type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
              <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 px-2 pt-1.5 border-t border-black uppercase font-bold text-left">
                <span>Data refreshed continuously</span>
                <span>All prices in USD</span>
              </div>
            </div>

            {/* Fundamental Details Card */}
            <div className="mt-5 p-4 bg-yellow-50 border-2 border-black text-left">
              <h4 className="text-xs font-mono font-black text-black mb-1.5 uppercase tracking-wider">About {asset.name}</h4>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">{asset.details}</p>
            </div>
          </div>

          {/* Gemini AI Side Panel */}
          <div className="w-full lg:w-[380px] border-t-2 lg:border-t-0 lg:border-l-2 border-black bg-white flex flex-col overflow-hidden h-[45vh] lg:h-auto">
            {/* AI Panel Header */}
            <div className="p-4 border-b-2 border-black flex items-center justify-between bg-yellow-200">
              <div className="flex items-center gap-2 text-left">
                <div className="bg-black p-1">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-black uppercase text-black">Gemini AI Analyst</h4>
                  <p className="text-[9px] text-gray-600 font-mono uppercase">Real-time intelligent report</p>
                </div>
              </div>
              
              {!aiReport && !loadingAi && (
                <button
                  onClick={fetchAiAnalysis}
                  className="bg-black hover:bg-white text-white hover:text-black border-2 border-black text-xs font-black py-1.5 px-3 uppercase tracking-wider transition-all brutalist-shadow cursor-pointer"
                >
                  Analyze
                </button>
              )}
            </div>

            {/* AI Panel Body */}
            <div className="flex-grow p-4 overflow-y-auto bg-white">
              {loadingAi ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <Loader2 className="w-8 h-8 text-black animate-spin mb-3" />
                  <p className="text-sm font-mono font-black text-black uppercase">Generating AI Report...</p>
                  <p className="text-xs text-gray-600 mt-1.5 font-sans leading-relaxed">
                    Gemini is processing chart metrics, price momentum, and key moving averages.
                  </p>
                </div>
              ) : aiReport ? (
                <div className="space-y-4 pr-1">
                  {renderSimpleMarkdown(aiReport)}
                  
                  {/* Copy or Regenerate */}
                  <div className="pt-4 border-t-2 border-black flex gap-2">
                    <button
                      onClick={fetchAiAnalysis}
                      className="flex-grow bg-white hover:bg-gray-100 text-black border-2 border-black text-xs font-black py-2 uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Regenerate
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiReport);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="bg-black hover:bg-gray-900 text-white text-xs font-black py-2 px-4 uppercase tracking-wider transition-all brutalist-shadow cursor-pointer"
                    >
                      {copied ? "COPIED!" : "COPY REPORT"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <Sparkles className="w-10 h-10 text-gray-300 mb-3" />
                  <h5 className="text-xs font-mono font-black text-black uppercase">Get Deep Intelligence</h5>
                  <p className="text-xs text-gray-600 mt-2 max-w-[240px] leading-relaxed font-sans">
                    Unleash Gemini AI to evaluate 30 days of trading velocity, calculate exponential moving averages, find horizontal pivot levels, and output a detailed trade strategy!
                  </p>
                  <button
                    onClick={fetchAiAnalysis}
                    className="mt-5 w-full bg-black hover:bg-white text-white hover:text-black border-2 border-black font-black py-2.5 px-4 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all brutalist-shadow cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    Request AI Analysis
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
