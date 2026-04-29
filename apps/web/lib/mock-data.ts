import type { DisasterEvent, LiveMetric } from "@/lib/types";

export const liveMetrics: LiveMetric[] = [
  { id: "risk", label: "Composite risk index", value: "78.4", trend: "+6.2", severity: "critical" },
  { id: "sensors", label: "Active data sources", value: "1,428", trend: "+114", severity: "stable" },
  { id: "alerts", label: "Open alerts", value: "37", trend: "-8", severity: "watch" },
  { id: "teams", label: "Response teams", value: "92", trend: "+11", severity: "stable" }
];

export const disasterEvents: DisasterEvent[] = [
  { id: "pune-flood", type: "flood", name: "Mula-Mutha Flood Watch", location: "Pune, India", riskScore: 82, lat: 18.5204, lng: 73.8567, radiusKm: 22, status: "active", territory: "Global" },
  { id: "sf-quake", type: "earthquake", name: "Bay Seismic Cluster", location: "San Francisco, USA", riskScore: 68, lat: 37.7749, lng: -122.4194, radiusKm: 36, status: "monitoring", territory: "Global" },
  { id: "aus-fire", type: "wildfire", name: "Blue Mountains Fireline", location: "NSW, Australia", riskScore: 75, lat: -33.7000, lng: 150.3000, radiusKm: 44, status: "active", territory: "Global" },
  { id: "gulf-hurricane", type: "hurricane", name: "Gulf Storm Delta", location: "Gulf Coast, USA", riskScore: 71, lat: 29.7604, lng: -95.3698, radiusKm: 88, status: "monitoring", territory: "Global" },
  
  // New Indian Use Cases
  { id: "himalayan-quake", type: "earthquake", name: "Himalayan Seismic Activity", location: "Uttarakhand, India", riskScore: 78, lat: 30.0668, lng: 79.0193, radiusKm: 45, status: "monitoring", territory: "North India" },
  { id: "yamuna-flood", type: "flood", name: "Yamuna River Flooding", location: "New Delhi, India", riskScore: 85, lat: 28.6139, lng: 77.2090, radiusKm: 15, status: "active", territory: "North India" },
  { id: "odisha-cyclone", type: "hurricane", name: "Bay of Bengal Cyclone", location: "Odisha, India", riskScore: 88, lat: 20.9517, lng: 85.0985, radiusKm: 120, status: "active", territory: "East India" },
  { id: "mumbai-flood", type: "flood", name: "Mumbai Urban Flooding", location: "Mumbai, Maharashtra, India", riskScore: 92, lat: 19.0760, lng: 72.8777, radiusKm: 30, status: "active", territory: "West India" },
  { id: "surat-fire", type: "wildfire", name: "Industrial Zone Fire", location: "Surat, Gujarat, India", riskScore: 74, lat: 21.1702, lng: 72.8311, radiusKm: 8, status: "active", territory: "West India" },
  { id: "kerala-flood", type: "flood", name: "Kerala Monsoonal Floods", location: "Kerala, India", riskScore: 81, lat: 10.8505, lng: 76.2711, radiusKm: 65, status: "active", territory: "South India" },
  { id: "chennai-surge", type: "hurricane", name: "Chennai Coastal Surge", location: "Chennai, Tamil Nadu, India", riskScore: 69, lat: 13.0827, lng: 80.2707, radiusKm: 40, status: "monitoring", territory: "South India" },
  { id: "mp-wildfire", type: "wildfire", name: "Central Heatwave & Forest Fire", location: "Madhya Pradesh, India", riskScore: 86, lat: 22.9734, lng: 78.6569, radiusKm: 95, status: "active", territory: "Central India" }
];

export const activityFeed = [
  "Satellite anomaly classifier raised flood confidence to 91 percent in Pune sector C.",
  "Emergency Manager Asha Rao approved 12 high-water rescue units for staging.",
  "USGS ingestion normalized 18 seismic tremors into Bay Seismic Cluster.",
  "AI report draft created for Regional Flood Resilience Study.",
  "Shelter capacity optimizer moved 480 evacuees to low-congestion sites."
];

export const resourcePlan = [
  { name: "Rescue boats", assigned: 48, requested: 64 },
  { name: "Medical kits", assigned: 620, requested: 700 },
  { name: "Drones", assigned: 19, requested: 24 },
  { name: "Shelter beds", assigned: 2840, requested: 3100 }
];

export const riskSeries = [
  { time: "00:00", flood: 58, earthquake: 31, wildfire: 44, hurricane: 37 },
  { time: "04:00", flood: 63, earthquake: 33, wildfire: 48, hurricane: 42 },
  { time: "08:00", flood: 71, earthquake: 38, wildfire: 56, hurricane: 47 },
  { time: "12:00", flood: 82, earthquake: 43, wildfire: 62, hurricane: 59 },
  { time: "16:00", flood: 79, earthquake: 48, wildfire: 75, hurricane: 66 },
  { time: "20:00", flood: 74, earthquake: 45, wildfire: 70, hurricane: 71 }
];
