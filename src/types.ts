export type SentimentType = "Long" | "Short" | "Neutral";

export interface ChartDataPoint {
  date: string;
  price: number;
  volume?: number;
}

export interface Asset {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  category: "indices" | "crypto" | "currencies" | "futures";
  history: ChartDataPoint[];
  details: string;
}

export interface CommunityIdea {
  id: string;
  title: string;
  description: string;
  author: string;
  ticker: string;
  sentiment: SentimentType;
  imageUrl: string;
  avatarColor: string;
  likes: number;
  comments: number;
  createdAt: string;
}
