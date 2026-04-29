export type UserRole = "researcher" | "emergency_manager" | "admin";

export type DisasterType = "earthquake" | "flood" | "wildfire" | "hurricane";

export type LiveMetric = {
  id: string;
  label: string;
  value: string;
  trend: string;
  severity: "stable" | "watch" | "critical";
};

export type DisasterEvent = {
  id: string;
  type: DisasterType;
  name: string;
  location: string;
  riskScore: number;
  lat: number;
  lng: number;
  radiusKm: number;
  status: "monitoring" | "active" | "contained" | "recovery";
  territory?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
