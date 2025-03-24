import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getWeatherDescription = (weather: string | number, language: string): string => {
  const weatherCodesEn: Record<string, string> = {
    "Clear": "Clear Sky",
    "Clouds": "Cloudy",
    "Rain": "Rain",
    "Drizzle": "Drizzle",
    "Thunderstorm": "Thunderstorm",
    "Snow": "Snow",
    "Mist": "Mist",
    "Smoke": "Smoke",
    "Haze": "Haze",
    "Dust": "Dust",
    "Fog": "Fog",
    "Sand": "Sand",
    "Ash": "Ash",
    "Squall": "Squall",
    "Tornado": "Tornado"
  }

  const weatherCodesZh: Record<string, string> = {
    "Clear": "晴天",
    "Clouds": "多云",
    "Rain": "雨",
    "Drizzle": "毛毛雨",
    "Thunderstorm": "雷暴",
    "Snow": "雪",
    "Mist": "薄雾",
    "Smoke": "烟雾",
    "Haze": "霾",
    "Dust": "尘土",
    "Fog": "雾",
    "Sand": "沙尘",
    "Ash": "火山灰",
    "Squall": "暴风",
    "Tornado": "龙卷风"
  }

  if (typeof weather === 'number') {
    // 保持对Open-Meteo数字天气代码的兼容性
    const weatherCodesNumEn: Record<number, string> = {
      0: "Clear Sky",
      1: "Mainly Clear",
      2: "Partly Cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing Rime Fog",
      51: "Light Drizzle",
      53: "Moderate Drizzle",
      55: "Dense Drizzle",
      56: "Light Freezing Drizzle",
      57: "Dense Freezing Drizzle",
      61: "Slight Rain",
      63: "Moderate Rain",
      65: "Heavy Rain",
      66: "Light Freezing Rain",
      67: "Heavy Freezing Rain",
      71: "Slight Snow Fall",
      73: "Moderate Snow Fall",
      75: "Heavy Snow Fall",
      77: "Snow Grains",
      80: "Slight Rain Showers",
      81: "Moderate Rain Showers",
      82: "Violent Rain Showers",
      85: "Slight Snow Showers",
      86: "Heavy Snow Showers",
      95: "Thunderstorm",
      96: "Thunderstorm with Slight Hail",
      99: "Thunderstorm with Heavy Hail"
    }

    const weatherCodesNumZh: Record<number, string> = {
      0: "晴天",
      1: "大部晴朗",
      2: "局部多云",
      3: "阴天",
      45: "雾",
      48: "雾凇",
      51: "小毛毛雨",
      53: "中毛毛雨",
      55: "大毛毛雨",
      56: "小冻雨",
      57: "大冻雨",
      61: "小雨",
      63: "中雨",
      65: "大雨",
      66: "小冻雨",
      67: "大冻雨",
      71: "小雪",
      73: "中雪",
      75: "大雪",
      77: "雪粒",
      80: "小阵雨",
      81: "中阵雨",
      82: "大阵雨",
      85: "小阵雪",
      86: "大阵雪",
      95: "雷暴",
      96: "雷暴伴有小冰雹",
      99: "雷暴伴有大冰雹"
    }

    return language.startsWith("zh") ? weatherCodesNumZh[weather] || "未知" : weatherCodesNumEn[weather] || "Unknown"
  }

  return language.startsWith("zh") ? weatherCodesZh[weather] || "未知" : weatherCodesEn[weather] || "Unknown"
}

