import type { ChatMessage, UserRole } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getDemoToken(role: UserRole) {
  const response = await fetch(`${API_URL}/api/v1/auth/demo-token/${role}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to create demo token");
  }
  return response.json() as Promise<{ access_token: string; token_type: string; role: UserRole }>;
}

export async function askAssistant(messages: ChatMessage[], token?: string) {
  const response = await fetch(`${API_URL}/api/v1/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ messages: messages.map(({ role, content }) => ({ role, content })) })
  });
  if (!response.ok) {
    throw new Error("Assistant request failed");
  }
  return response.json() as Promise<{ answer: string; actions: string[] }>;
}

export async function getDashboardData(token?: string) {
  const response = await fetch(`${API_URL}/api/v1/analytics/dashboard`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!response.ok) {
    throw new Error("Dashboard request failed");
  }
  return response.json();
}
