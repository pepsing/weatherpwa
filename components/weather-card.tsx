"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sunrise, Sunset, Droplets, Wind } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface WeatherCardProps {
  weather: {
    name: string
    main: {
      temp: number
      feels_like: number
      humidity: number
    }
    weather: Array<{
      main: string
      description: string
      icon: string
    }>
    wind: {
      speed: number
    }
    sys?: {
      sunrise: number
      sunset: number
    }
  }
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const { t } = useLanguage()

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{weather.name || t.currentLocation}</h2>
            <p className="text-lg capitalize">{weather.weather[0].description}</p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <img
              src={getWeatherIcon(weather.weather[0].icon) || "/placeholder.svg"}
              alt={weather.weather[0].main}
              className="w-20 h-20"
            />
            <div className="ml-2">
              <div className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</div>
              <div className="text-sm">
                {t.feelsLike} {Math.round(weather.main.feels_like)}°C
              </div>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
            <Droplets className="text-blue-500 mb-2" />
            <span className="text-sm text-muted-foreground">{t.humidity}</span>
            <span className="font-medium">{weather.main.humidity}%</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
            <Wind className="text-blue-500 mb-2" />
            <span className="text-sm text-muted-foreground">{t.wind}</span>
            <span className="font-medium">
              {weather.wind.speed} {t.windUnit}
            </span>
          </div>
          {weather.sys && (
            <>
              <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                <Sunrise className="text-orange-500 mb-2" />
                <span className="text-sm text-muted-foreground">{t.sunrise}</span>
                <span className="font-medium">{formatTime(weather.sys.sunrise)}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                <Sunset className="text-orange-500 mb-2" />
                <span className="text-sm text-muted-foreground">{t.sunset}</span>
                <span className="font-medium">{formatTime(weather.sys.sunset)}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

