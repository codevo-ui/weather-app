// src/hooks/useWeather.js
import { useState } from "react";
import {
  getCurrentWeather,
  getCurrentWeatherByCoords,
  getWeatherForecast,
} from "../services/WeatherAPI"; // <-- adjust path if needed

export function useWeather() {
  // 1) Declare all state FIRST
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric"); // UI toggle; your API is metric right now
  const [lastQuery, setLastQuery] = useState(null); // remember last fetch to optionally refetch

  // 2) Fetch by city name
  const fetchWeatherByCity = async (city) => {
    if (!city) return;
    setLoading(true);
    try {
      const cw = await getCurrentWeather(city);
      setCurrentWeather(cw);

      const fc = await getWeatherForecast(city);
      setForecast(fc);

      setError(null);
      setLastQuery({ type: "city", value: city });
    } catch (err) {
      setError(err.message || "Something went wrong");
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  // 3) Fetch by coordinates
  const fetchWeatherByLocation = async (lat, lon) => {
    if (lat == null || lon == null) return;
    setLoading(true);
    try {
      const cw = await getCurrentWeatherByCoords(lat, lon);
      setCurrentWeather(cw);

      // get forecast using the city name returned by current weather
      if (cw && cw.name) {
        const fc = await getWeatherForecast(cw.name);
        setForecast(fc);
      } else {
        setForecast(null);
      }

      setError(null);
      setLastQuery({ type: "coords", value: { lat, lon } });
    } catch (err) {
      setError(err.message || "Something went wrong");
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  // 4) Unit toggle (optional refetch)
  const toggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
    // NOTE: your WeatherAPI.js hardcodes units=metric.
    // If you later add a `unit` param to those API functions, refetch here:
    if (lastQuery?.type === "city") {
      fetchWeatherByCity(lastQuery.value);
    } else if (lastQuery?.type === "coords") {
      fetchWeatherByLocation(lastQuery.value.lat, lastQuery.value.lon);
    }
  };

  // 5) Expose everything App.jsx expects
  return {
    currentWeather,
    forecast,
    loading,
    error,
    unit,
    fetchWeatherByCity,
    fetchWeatherByLocation,
    toggleUnit,
  };
}


