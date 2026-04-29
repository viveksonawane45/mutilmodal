import type { ChatMessage } from "@/lib/types";

export function localAssistantAnswer(messages: ChatMessage[]) {
  const prompt = messages.at(-1)?.content.toLowerCase() ?? "";

  if (prompt.includes("pune") || prompt.includes("flood")) {
    return {
      answer:
        "Flood risk in Pune is high. Water-level acceleration, 24-hour rainfall, road-closure reports, and satellite water-mask expansion support a 22 km priority monitoring radius. Recommended actions: stage rescue boats near Sangamwadi, open west-side shelters, and verify two drifting gauges with satellite imagery.",
      actions: ["Open GIS flood layer", "Stage rescue boats", "Generate situation brief"]
    };
  }

  if (prompt.includes("earthquake") || prompt.includes("impact zone")) {
    return {
      answer:
        "Earthquake impact should be modeled from magnitude, depth, soil amplification, hospital access, and building vulnerability. For the current Bay cluster, use a 36 km first-pass response radius, then narrow with aftershock probability and infrastructure fragility layers.",
      actions: ["Run impact radius model", "Prioritize hospitals", "Notify rescue teams"]
    };
  }

  if (prompt.includes("wildfire") || prompt.includes("fire")) {
    return {
      answer:
        "Wildfire spread risk is elevated where hotspot confidence overlaps low humidity and high wind. Dispatch drone validation, stage crews upwind, and monitor AQI for respiratory shelter routing.",
      actions: ["Enable hotspot layer", "Check air quality", "Optimize crew routing"]
    };
  }

  if (prompt.includes("hurricane") || prompt.includes("storm")) {
    return {
      answer:
        "Storm tracking indicates pre-impact staging is the strongest action. Prioritize surge-zone evacuation, power restoration crews, medical cache placement, and post-impact satellite damage comparison.",
      actions: ["Open storm track", "Stage resources", "Prepare damage report"]
    };
  }

  if (prompt.includes("resource") || prompt.includes("shelter") || prompt.includes("evacuation")) {
    return {
      answer:
        "Resource optimization recommends keeping shelter load below 85 percent, moving boats and medical kits toward low-congestion access points, and routing evacuation away from bridges with social-confirmed closures.",
      actions: ["Rebalance shelters", "Move medical kits", "Update evacuation routes"]
    };
  }

  if (prompt.includes("report") || prompt.includes("summary")) {
    return {
      answer:
        "Report summary: multimodal evidence shows elevated disaster risk, strongest confidence comes from cross-confirmed sensor and satellite signals, and the key operational need is faster field validation plus resource pre-positioning.",
      actions: ["Draft report", "Attach confidence notes", "Run QA checklist"]
    };
  }

  return {
    answer:
      "I can answer operational questions about floods, earthquakes, wildfires, hurricanes, anomaly detection, resources, shelters, maps, and reports. Try: \"Show flood risk in Pune\" or \"Predict earthquake impact zone\".",
    actions: ["Retrieve context", "Score risk", "Recommend actions"]
  };
}
