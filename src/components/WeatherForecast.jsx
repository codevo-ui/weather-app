import React from 'react'
import { Calendar, Droplets } from 'lucide-react'
import * as LucideIcons from "lucide-react";
import { formatDate, formatTemperature, getWeatherIcon } from '../utils/weatherutils';

function WeatherForecast({ forecast, unit }) {
  // ✅ Prevent error if forecast or forecast.list is missing
  if (!forecast || !forecast.list) {
    return <div className="text-white">Loading forecast...</div>;
  }

  // Group forecast data by date
  const dailyForecast = forecast.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!acc[date]) {
      acc[date] = item;
    }
    return acc;
  }, {});

  // Get 5 days only
  const dailyItems = Object.values(dailyForecast).slice(0, 5);

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 bg-white/10 rounded-full">
          <Calendar className="w-6 h-6 text-white/80" />
        </div>
        <h2 className="text-2xl font-bold text-white">5 Day Forecast</h2>
      </div>

      {/* Forecast List */}
      <div className="space-y-4">
        {dailyItems.map((item, index) => {
          const iconName = getWeatherIcon(item.weather[0]);
          const IconComponent = LucideIcons[iconName] || LucideIcons.Cloud;

          return (
            <div
              key={index}
              className="flex items-center justify-between p-5 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all duration-300 group border border-white/10"
            >
              <div className="flex items-center space-x-5 flex-1">
                <div className="text-white/90 group-hover:text-white transition-all transform group-hover:scale-110 duration-300">
                  {/* Dynamic Icon */}
                  <IconComponent size={40} />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-lg">
                    {/* Show Today for first item */}
                    {index === 0 ? "Today" : formatDate(item.dt)}
                  </div>
                  <div className="text-white/70 text-sm capitalize font-medium">
                    {item.weather[0].description}
                  </div>
                </div>
              </div>

              {/* Right side - Rain % and Temps */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-white/60">
                  <Droplets className="w-4 h-4 text-blue-300" />
                  <span className="text-sm font-medium">
                    {Math.round(item.pop * 100)}%
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-xl">
                    {formatTemperature(item.main.temp_max, unit)}°
                  </div>
                  <div className="text-white font-medium text-sm">
                    {formatTemperature(item.main.temp_min, unit)}°
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeatherForecast;