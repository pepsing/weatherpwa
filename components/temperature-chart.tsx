"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

interface TemperatureChartProps {
  hourlyData: Array<{
    time: string
    temperature_2m: number
  }>
  dailyData: Array<{
    time: string
    temperature_2m_min: number
    temperature_2m_max: number
  }>
}

export default function TemperatureChart({ hourlyData, dailyData }: TemperatureChartProps) {
  const { t, language } = useLanguage()

  const formatHourlyTime = (time: string) => {
    return new Date(time).toLocaleTimeString(language === "zh" ? "zh-CN" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDailyTime = (time: string) => {
    return new Date(time).toLocaleDateString(language === "zh" ? "zh-CN" : "en-US", {
      weekday: "short",
    })
  }

  const filteredHourlyData = hourlyData
    .filter(item => {
      const itemDate = new Date(item.time)
      const now = new Date()
      const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      return itemDate >= now && itemDate <= twentyFourHoursFromNow
    })
    .slice(0, 24)
    .map(item => ({
      ...item,
      formattedTime: formatHourlyTime(item.time),
    }))

  const filteredDailyData = dailyData
    .filter(item => new Date(item.time) >= new Date())
    .slice(0, 7)
    .map(item => ({
      ...item,
      formattedTime: formatDailyTime(item.time),
    }))

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">{t.hourlyForecast}</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredHourlyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis
                  dataKey="formattedTime"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={["dataMin - 2", "dataMax + 2"]}
                  tick={{ fontSize: 12 }}
                  width={30}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}°C`, t.temperature]}
                  labelFormatter={(label: string) => label}
                />
                <Line
                  type="monotone"
                  dataKey="temperature_2m"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">{t.dailyForecast}</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredDailyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis
                  dataKey="formattedTime"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  domain={["dataMin - 2", "dataMax + 2"]}
                  tick={{ fontSize: 12 }}
                  width={30}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}°C`, t.temperature]}
                  labelFormatter={(label: string) => label}
                />
                <Area
                  type="monotone"
                  dataKey="temperature_2m_max"
                  stroke="#ef4444"
                  fill="#fee2e2"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="temperature_2m_min"
                  stroke="#3b82f6"
                  fill="#dbeafe"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}