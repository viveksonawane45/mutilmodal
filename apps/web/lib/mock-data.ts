import type { DisasterEvent, IncidentItem, LiveMetric, ResourceItem } from "@/lib/types";

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

export const kpiData = [
  { id: "risk", label: "Composite Risk Index", value: "78.4", change: "+6.2%", changeType: "up", severity: "critical", icon: "activity" },
  { id: "sources", label: "Active Data Sources", value: "1,428", change: "+114", changeType: "up", severity: "stable", icon: "database" },
  { id: "alerts", label: "Open Alerts", value: "37", change: "-8", changeType: "down", severity: "watch", icon: "bell" },
  { id: "teams", label: "Response Teams", value: "92", change: "+11", changeType: "up", severity: "stable", icon: "users" },
  { id: "resources", label: "Resources Deployed", value: "3,527", change: "+240", changeType: "up", severity: "stable", icon: "package" },
  { id: "affected", label: "Communities Affected", value: "18", change: "+3", changeType: "up", severity: "watch", icon: "map-pin" }
];

export const incidents: IncidentItem[] = [
  { id: "inc-001", title: "Mula-Mutha River Overflow", location: "Pune, Maharashtra", severity: "critical", status: "open", timestamp: "2026-06-26 08:30", description: "River water level exceeds danger mark by 2.4m. Evacuation underway.", type: "flood" },
  { id: "inc-002", title: "Himalayan Aftershock Series", location: "Uttarakhand", severity: "high", status: "investigating", timestamp: "2026-06-26 06:15", description: "Series of 12 tremors recorded in the last 4 hours. Monitoring active.", type: "earthquake" },
  { id: "inc-003", title: "Industrial Zone Chemical Fire", location: "Surat, Gujarat", severity: "critical", status: "open", timestamp: "2026-06-26 05:45", description: "Chemical fire reported in Surat industrial zone. Toxic smoke spreading.", type: "wildfire" },
  { id: "inc-004", title: "Chennai Coastal Erosion", location: "Chennai, Tamil Nadu", severity: "medium", status: "investigating", timestamp: "2026-06-25 22:00", description: "Coastal erosion accelerating due to high tides. Structures at risk.", type: "hurricane" },
  { id: "inc-005", title: "Kerala Landslide Warning", location: "Wayanad, Kerala", severity: "high", status: "open", timestamp: "2026-06-25 19:20", description: "Red alert issued for multiple landslide-prone zones in Wayanad.", type: "flood" },
  { id: "inc-006", title: "MP Forest Fire Expansion", location: "Balaghat, Madhya Pradesh", severity: "medium", status: "resolved", timestamp: "2026-06-25 14:00", description: "Forest fire contained after 48-hour operation. 200 hectares affected.", type: "wildfire" },
  { id: "inc-007", title: "Delhi Yamuna Bank Breach", location: "New Delhi", severity: "critical", status: "open", timestamp: "2026-06-25 11:30", description: "Yamuna river bank breached near ITO. Low-lying areas flooded.", type: "flood" },
  { id: "inc-008", title: "Odisha Cyclone Formation", location: "Bay of Bengal", severity: "high", status: "investigating", timestamp: "2026-06-25 09:00", description: "Deep depression intensifying into cyclonic storm. Path projection active.", type: "hurricane" }
];

export const resources: ResourceItem[] = [
  { id: "res-001", name: "Rescue Boats", category: "Marine", assigned: 48, available: 72, requested: 64, unit: "units" },
  { id: "res-002", name: "Medical Kits", category: "Medical", assigned: 620, available: 1200, requested: 700, unit: "kits" },
  { id: "res-003", name: "Drones", category: "Surveillance", assigned: 19, available: 32, requested: 24, unit: "units" },
  { id: "res-004", name: "Shelter Beds", category: "Logistics", assigned: 2840, available: 4500, requested: 3100, unit: "beds" },
  { id: "res-005", name: "Water Pumps", category: "Infrastructure", assigned: 86, available: 120, requested: 100, unit: "units" },
  { id: "res-006", name: "Food Packets", category: "Logistics", assigned: 12400, available: 20000, requested: 15000, unit: "packets" },
  { id: "res-007", name: "Communication Relay", category: "Communication", assigned: 12, available: 18, requested: 15, unit: "units" },
  { id: "res-008", name: "Field Hospitals", category: "Medical", assigned: 4, available: 8, requested: 6, unit: "units" }
];

export const userProfile = {
  name: "Dr. Asha Rao",
  role: "Emergency Manager",
  email: "asha.rao@disasterscope.gov",
  location: "Mumbai, India",
  avatar: "AR",
  joined: "January 2024",
  stats: {
    incidentsManaged: 147,
    reportsGenerated: 89,
    teamsCoordinated: 34,
    responseTime: "4.2m"
  },
  recentActivity: [
    "Approved 12 high-water rescue units for Pune staging",
    "Reviewed AI-generated report for Regional Flood Resilience",
    "Coordinated with NDMA for Kerala landslide response",
    "Updated resource allocation for Odisha cyclone prep",
    "Authorized drone surveillance for Surat fire zone"
  ]
};
