import { Asset, CommunityIdea } from "../types";

// Helper to generate a 30-day random walk history for recharts
export function generateHistory(
  basePrice: number,
  changePercent: number,
  pointsCount = 30
) {
  const history = [];
  let currentPrice = basePrice;
  const now = new Date();
  
  // Create history backwards from today
  for (let i = pointsCount - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateString = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    // Random walk calculation with bias based on actual changePercent
    const volatility = Math.abs(changePercent) * 0.003 + 0.008;
    const dailyBias = (changePercent / 100) / pointsCount;
    const randomFactor = (Math.random() - 0.48) * 2; // slight upward bias potential
    const priceChange = currentPrice * (dailyBias + randomFactor * volatility);
    
    currentPrice += priceChange;
    // ensure price is never negative
    if (currentPrice <= 0) currentPrice = 0.01;

    history.push({
      date: dateString,
      price: parseFloat(currentPrice.toFixed(basePrice < 10 ? 4 : 2)),
      volume: Math.floor(Math.random() * 500000 + 100000),
    });
  }

  // Set the last point's price to exactly basePrice
  if (history.length > 0) {
    history[history.length - 1].price = basePrice;
  }
  
  return history;
}

export const INITIAL_ASSETS: Asset[] = [
  // INDICES
  {
    symbol: "S&P 500",
    name: "S&P 500 Index",
    exchange: "SPX · TVC",
    price: 5123.44,
    change: 62.83,
    changePercent: 1.24,
    category: "indices",
    history: generateHistory(5123.44, 1.24),
    details: "The Standard & Poor's 500 Index is a market-capitalization-weighted index of 500 leading publicly traded companies in the U.S.",
  },
  {
    symbol: "Nasdaq 100",
    name: "Nasdaq 100 Index",
    exchange: "NDX · TVC",
    price: 18200.50,
    change: 295.60,
    changePercent: 1.65,
    category: "indices",
    history: generateHistory(18200.50, 1.65),
    details: "The Nasdaq-100 is a stock market index made up of 101 non-financial equity securities issued by the 100 largest non-financial companies listed on the Nasdaq.",
  },
  {
    symbol: "Japan 225",
    name: "Nikkei 225 Index",
    exchange: "NI225 · TVC",
    price: 38450.00,
    change: -162.25,
    changePercent: -0.42,
    category: "indices",
    history: generateHistory(38450.00, -0.42),
    details: "The Nikkei 225 is a stock market index for the Tokyo Stock Exchange (TSE), representing Japan's top blue-chip companies.",
  },
  {
    symbol: "FTSE 100",
    name: "FTSE 100 Index",
    exchange: "UKX · TVC",
    price: 7920.10,
    change: 8.70,
    changePercent: 0.11,
    category: "indices",
    history: generateHistory(7920.10, 0.11),
    details: "The FTSE 100 Index is a share index of the 100 companies listed on the London Stock Exchange with the highest market capitalization.",
  },

  // CRYPTO
  {
    symbol: "TOTAL",
    name: "Crypto Market Cap",
    exchange: "CRYPTOCAP",
    price: 2430000000000, // 2.43T
    change: 57120000000,
    changePercent: 2.41,
    category: "crypto",
    history: generateHistory(2.43, 2.41).map(p => ({ ...p, price: p.price * 1000000000000 })),
    details: "The total cryptocurrency market capitalization index tracking the aggregate value of all crypto assets combined in USD.",
  },
  {
    symbol: "Bitcoin",
    name: "Bitcoin / U.S. Dollar",
    exchange: "BTCUSD · COINBASE",
    price: 67420.00,
    change: 1860.50,
    changePercent: 2.84,
    category: "crypto",
    history: generateHistory(67420.00, 2.84),
    details: "Bitcoin is the world's first decentralized digital currency, operating on a peer-to-peer blockchain network without central authority.",
  },
  {
    symbol: "Ethereum",
    name: "Ethereum / U.S. Dollar",
    exchange: "ETHUSD · COINBASE",
    price: 3510.20,
    change: 66.20,
    changePercent: 1.92,
    category: "crypto",
    history: generateHistory(3510.20, 1.92),
    details: "Ethereum is a decentralized, open-source blockchain with smart contract functionality, with Ether (ETH) being its native token.",
  },

  // CURRENCIES
  {
    symbol: "DXY",
    name: "US Dollar Index",
    exchange: "DXY · TVC",
    price: 104.22,
    change: -0.32,
    changePercent: -0.31,
    category: "currencies",
    history: generateHistory(104.22, -0.31),
    details: "The U.S. Dollar Index measures the value of the United States dollar relative to a basket of foreign currencies.",
  },
  {
    symbol: "EURUSD",
    name: "Euro / U.S. Dollar",
    exchange: "EURUSD · FX_IDC",
    price: 1.0854,
    change: 0.0006,
    changePercent: 0.06,
    category: "currencies",
    history: generateHistory(1.0854, 0.06),
    details: "The exchange rate of the Euro against the United States Dollar. One of the most actively traded currency pairs in the global forex market.",
  },
  {
    symbol: "GBPUSD",
    name: "British Pound / U.S. Dollar",
    exchange: "GBPUSD · FX_IDC",
    price: 1.2678,
    change: -0.0031,
    changePercent: -0.24,
    category: "currencies",
    history: generateHistory(1.2678, -0.24),
    details: "The exchange rate of the British Pound Sterling against the United States Dollar, historically nicknamed 'the Cable'.",
  },
  {
    symbol: "USDJPY",
    name: "U.S. Dollar / Japanese Yen",
    exchange: "USDJPY · FX_IDC",
    price: 151.45,
    change: 0.27,
    changePercent: 0.18,
    category: "currencies",
    history: generateHistory(151.45, 0.18),
    details: "The exchange rate of the United States Dollar against the Japanese Yen. Representing a bridge between Western and Asian economic centers.",
  },

  // FUTURES / YIELDS
  {
    symbol: "US10Y",
    name: "US 10 Year Government Bond Yield",
    exchange: "US10Y · TVC",
    price: 4.215,
    change: 0.05,
    changePercent: 1.20, // relative increase
    category: "futures",
    history: generateHistory(4.215, 1.20),
    details: "The yield on 10-year United States Treasury notes. This bond yield serves as a benchmark for mortgage rates and global economic confidence.",
  },
  {
    symbol: "Gold",
    name: "Gold Spot / U.S. Dollar",
    exchange: "GOLD · TVC",
    price: 2180.50,
    change: 18.35,
    changePercent: 0.85,
    category: "futures",
    history: generateHistory(2180.50, 0.85),
    details: "Gold is the premier precious metal, acting as a historical store of value and safe-haven asset during times of geopolitical or inflation uncertainty.",
  },
  {
    symbol: "Light Crude Oil",
    name: "Crude Oil Light Sweet Futures",
    exchange: "USOIL · TVC",
    price: 81.35,
    change: -0.99,
    changePercent: -1.21,
    category: "futures",
    history: generateHistory(81.35, -1.21),
    details: "The price of West Texas Intermediate (WTI) light sweet crude oil, which is a major global benchmark for oil pricing.",
  },
  {
    symbol: "Natural Gas",
    name: "Natural Gas Futures",
    exchange: "NGAS · TVC",
    price: 1.780,
    change: 0.070,
    changePercent: 4.10,
    category: "futures",
    history: generateHistory(1.780, 4.10),
    details: "The price of Natural Gas futures contract traded on NYMEX, reflecting heating and electrical energy production demands.",
  },
];

export const INITIAL_IDEAS: CommunityIdea[] = [
  {
    id: "idea-1",
    title: "RKLB - Trend-Following Opportunity Under Watch!",
    description: "RKLB (Rocket Lab) is a leading space technology company specializing in satellite launches, spacecraft manufacturing, and space systems components. Looking at the daily chart, a solid bullish structure has formed around the demand zone. It is a fantastic breakout target for space tech bulls.",
    author: "Rayannsr",
    ticker: "NASDAQ:RKLB",
    sentiment: "Long",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsub0HArgsRCiAXhzV99JwYnq89RmQM0NsYHx_qK3_s0CQWvPdHNW4Fn_eONpEqJt4thIyIi80oUkXnIsse8rZMzQZFOUEseYxYYr51Ork5Igw-Uw6pUx-bBDhhOPjrdm74_KoxB00iKWrnyrcNUg9L0xvToBXFrF7_3DrTZnbta0kisIK_Z60M-OY2l0TA4sOP-UeYP9AWyiByCdgskLr-bZw6Gynq_6U0aMftUV531vECWjzSW9YRFTfy",
    avatarColor: "from-blue-500 to-indigo-600",
    likes: 342,
    comments: 48,
    createdAt: "Jul 18, 2026",
  },
  {
    id: "idea-2",
    title: "Apple Preparing Next Breakout? | Through Bitget rToken",
    description: "Apple (NASDAQ:AAPL) continues to be one of the strongest large-cap stocks in the market, and the 4-hour chart is showing a consolidating flag setup immediately beneath historical resistance. A clean breakout with high volume confirms a march towards $200+.",
    author: "Torik2x",
    ticker: "NASDAQ:AAPL",
    sentiment: "Long",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLtvPqqNijGWPLcicoe1kUfgBdUQrGiwfOCWH6fbZsSUBSh131qJ20P5ZU1QLzMuoVyFy0_rx-hMffa8mkfADTvF2-gEcBwc1c048Oe4C7xGnSuGYg7EWrP0yJ2l6-WhSBQVGMIFk3MuP3KKSGq2a7SuSWo8VRGD8r0sXfpKOvxOV7wrfAp-Rrh2chz_YSSBhlwY3a02mCa7Uf40-lTltAFlVpaHHyYAYYMJhXdVnBn1Nwq1DRwJzY6YZ1vT",
    avatarColor: "from-amber-400 to-orange-500",
    likes: 219,
    comments: 19,
    createdAt: "Jul 19, 2026",
  },
  {
    id: "idea-3",
    title: "The Next $SPCX Move Could Be HUGE",
    description: "NASDAQ:SPCX is approaching a key decision point after days of printing lower highs and lower lows. While the overall trend has been neutral to slightly bearish, watch the RSI divergence. A double bottom at the support line can signal a multi-week relief rally.",
    author: "Ellacutie",
    ticker: "NASDAQ:SPCX",
    sentiment: "Neutral",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsDVWS2rh1EixuIGHIOmPdiaemTO31pgxlS5g2G8c5rmOhCh_2St1W2PGf3ehIuHckpzlBIUETJ7Pa_PP95Pyya-bthpa-ud230QQfQ_CfBOTi4lbNUZbefprSdUyCRgIhoUKtTK1luICSSQS6iPi9xr4Kytvn4z3xO0GbrUp_I8rH3YULakNu7ROmw533OBWS0i4BPn32ZHEx0fTjKrq7Rh-7j2bdHY9X_kiheQcIr5Tu-rJiCNSloCJr4",
    avatarColor: "from-pink-500 to-rose-600",
    likes: 184,
    comments: 31,
    createdAt: "Jul 20, 2026",
  },
];
