"use client";

import { useEffect, useState } from "react";
import { Cloud, Droplets, Thermometer, Wind } from "lucide-react";
import { fetchWeather, type WeatherData } from "@/lib/weather-api";

type Props = {
  lat: number;
  lng: number;
  location: string;
};

export function WeatherWidget({ lat, lng, location }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchWeather(lat, lng, location).then(setWeather);
  }, [lat, lng, location]);

  if (!weather) {
    return (
      <div className="glass rounded-xl p-4 md:p-6 border border-white/10">
        <p className="text-sm text-slate-400 animate-pulse">Loading weather...</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-4 md:p-6 border border-white/10 backdrop-blur-md">
      <div className="mb-3 flex items-center gap-2">
        <Cloud className="text-cyan" size={18} />
        <h3 className="text-sm font-semibold">Live Weather — {weather.location}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Thermometer size={12} /> Temperature
          </div>
          <span className="text-lg font-semibold">{weather.temp}°C</span>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Droplets size={12} /> Humidity
          </div>
          <span className="text-lg font-semibold">{weather.humidity}%</span>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Wind size={12} /> Wind
          </div>
          <span className="text-lg font-semibold">{weather.windSpeed} km/h</span>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 capitalize">
            <Cloud size={12} /> {weather.description}
          </div>
          <span className="text-lg font-semibold">{weather.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
}
