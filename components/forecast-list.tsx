"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { getWeatherDescription } from "@/lib/utils"

interface ForecastItem {
  time: string
  temperature_2m: number
  weather_code: number
  wind_speed_10m: number
}

interface ForecastListProps {
  forecast: ForecastItem[]
  type: "hourly" | "daily"
}

export default function ForecastList({ forecast, type }: ForecastListProps) {
  const { t, language } = useLanguage()

  const getWeatherIcon = (code: number) => {
    // Map Open-Meteo weather codes to OpenWeatherMap icon codes
    if (code === 0) return "01d" // Clear sky
    if (code === 1) return "01d" // Mainly clear
    if (code === 2) return "02d" // Partly cloudy
    if (code === 3) return "04d" // Overcast
    if (code >= 45 && code <= 48) return "50d" // Fog
    if (code >= 51 && code <= 57) return "09d" // Drizzle
    if (code >= 61 && code <= 67) return "10d" // Rain
    if (code >= 71 && code <= 77) return "13d" // Snow
    if (code >= 80 && code <= 82) return "09d" // Rain showers
    if (code >= 85 && code <= 86) return "13d" // Snow showers
    if (code >= 95) return "11d" // Thunderstorm
    return "50d" // Default
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    const options = type === "hourly"
      ? { hour: "2-digit", minute: "2-digit", hour12: false }
      : { weekday: "short", month: "short", day: "numeric" }
    return date.toLocaleString(language === "zh" ? "zh-CN" : "en-US", options)
  }

  const filteredForecast = type === "hourly"
    ? forecast
        .filter(item => {
          const itemDate = new Date(item.time)
          const now = new Date()
          const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
          return itemDate >= now && itemDate <= twentyFourHoursFromNow
        })
        .slice(0, 24)
    : forecast
        .filter(item => {
          const itemDate = new Date(item.time)
          const now = new Date()
          return itemDate >= now
        })
        .slice(0, 7)

  return (
    <div className="grid grid-cols-1 gap-4">
      {filteredForecast.map((item, index) => (
        <Card key={index} className="w-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={`https://openweathermap.org/img/wn/${getWeatherIcon(item.weather_code)}.png` || "/placeholder.svg"}
                  alt={getWeatherDescription(item.weather_code, language)}
                  className="w-12 h-12 mr-4"
                />
                <div>
                  <div className="font-medium">{formatTime(item.time)}</div>
                  <div className="text-sm text-muted-foreground capitalize">{getWeatherDescription(item.weather_code, language)}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {item.wind_speed_10m} {t.windUnit}
                </div>
                <div className="text-xl font-bold">{Math.round(item.temperature_2m)}°C</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

