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

export type ViewType = "dashboard" | "projects" | "analysis" | "reports" | "response" | "map" | "profile" | "settings" | "incidents" | "resources";

export type IncidentItem = {
  id: string;
  title: string;
  location: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "investigating" | "resolved" | "closed";
  timestamp: string;
  description: string;
  type: DisasterType;
};

export type ResourceItem = {
  id: string;
  name: string;
  category: string;
  assigned: number;
  available: number;
  requested: number;
  unit: string;
};
