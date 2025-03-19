"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

interface ForecastItem {
  dt: number
  main: {
    temp: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
}

interface ForecastListProps {
  forecast: ForecastItem[]
  type: "hourly" | "daily"
}

export default function ForecastList({ forecast, type }: ForecastListProps) {
  const { t } = useLanguage()

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return type === "hourly"
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {forecast.map((item, index) => (
        <Card key={index} className="w-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={getWeatherIcon(item.weather[0].icon) || "/placeholder.svg"}
                  alt={item.weather[0].main}
                  className="w-12 h-12 mr-4"
                />
                <div>
                  <div className="font-medium">{formatTime(item.dt)}</div>
                  <div className="text-sm text-muted-foreground capitalize">{item.weather[0].description}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {item.wind.speed} {t.windUnit}
                </div>
                <div className="text-xl font-bold">{Math.round(item.main.temp)}°C</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

