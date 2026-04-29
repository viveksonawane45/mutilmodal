"use client";

import { useEffect, useState, useRef } from "react";

type Telemetry = {
  riskIndex: number;
  waterLevel: number;
  seismicMagnitude: number;
  airQuality: number;
  windSpeed: number;
  message: string;
};

const fallback: Telemetry = {
  riskIndex: 78,
  waterLevel: 5.8,
  seismicMagnitude: 3.6,
  airQuality: 142,
  windSpeed: 68,
  message: "Running deterministic demo telemetry while WebSocket connects."
};

export function useLiveTelemetry() {
  const [telemetry, setTelemetry] = useState<Telemetry>(fallback);
  const [connected, setConnected] = useState(false);
  const connectedRef = useRef(false);

  useEffect(() => {
    const wsBase = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000";
    const socket = new WebSocket(`${wsBase}/ws/telemetry`);

    socket.onopen = () => {
      setConnected(true);
      connectedRef.current = true;
    };
    socket.onclose = () => {
      setConnected(false);
      connectedRef.current = false;
    };
    socket.onerror = () => {
      setConnected(false);
      connectedRef.current = false;
    };
    socket.onmessage = (event) => {
      try {
        setTelemetry(JSON.parse(event.data) as Telemetry);
      } catch {
        setTelemetry((current) => ({ ...current, message: "Received malformed telemetry frame." }));
      }
    };

    const interval = setInterval(() => {
      setTelemetry((current) => {
        if (connectedRef.current) return current; // Don't perturb if WS is active
        return {
          ...current,
          riskIndex: Math.max(0, Math.min(100, current.riskIndex + (Math.random() * 4 - 2))),
          waterLevel: Math.max(0, current.waterLevel + (Math.random() * 0.4 - 0.2)),
          seismicMagnitude: Math.max(0, current.seismicMagnitude + (Math.random() * 0.2 - 0.1)),
          airQuality: Math.max(0, current.airQuality + (Math.random() * 10 - 5)),
          windSpeed: Math.max(0, current.windSpeed + (Math.random() * 6 - 3))
        };
      });
    }, 10000);

    return () => {
      socket.close();
      clearInterval(interval);
    };
  }, []);

  return { telemetry, connected };
}
