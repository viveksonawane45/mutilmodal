export type WeatherData = {
  temp: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  description: string;
  icon: string;
  location: string;
};

export async function fetchWeather(lat: number, lng: number, location: string): Promise<WeatherData> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    // Return mock data in demo mode
    return mockWeather(location);
  }
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`
    );
    if (!res.ok) throw new Error("Weather API error");
    const data = await res.json();
    return {
      temp: Math.round(data.main.temp * 10) / 10,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6 * 10) / 10,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      location,
    };
  } catch {
    return mockWeather(location);
  }
}

function mockWeather(location: string): WeatherData {
  const r = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) * 10) / 10;
  return {
    temp: r(18, 40),
    humidity: r(40, 95),
    windSpeed: r(5, 60),
    pressure: r(1000, 1025),
    description: ["clear sky", "light rain", "overcast clouds", "haze", "thunderstorm"][Math.floor(Math.random() * 5)],
    icon: "01d",
    location,
  };
}
