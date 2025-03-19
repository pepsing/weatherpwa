// Define the available languages
export type Language = "en" | "zh"

// Define the translation keys
export interface Translations {
  appTitle: string
  currentLocation: string
  searchPlaceholder: string
  saveLocation: string
  savedLocations: string
  noSavedLocations: string
  noSavedLocationsDesc: string
  hourlyForecast: string
  dailyForecast: string
  humidity: string
  wind: string
  sunrise: string
  sunset: string
  searchError: string
  locationError: string
  locationNotSupported: string
  locationSaved: string
  locationSavedDesc: string
  alreadySaved: string
  alreadySavedDesc: string
  locationRemoved: string
  locationRemovedDesc: string
  selectLocation: string
  weatherFetchError: string
  locationNotFound: string
  emptyStateMessage: string
  loading: string
  windUnit: string
  feelsLike: string
  language: string
}

// Define the translations
export const translations: Record<Language, Translations> = {
  en: {
    appTitle: "SkyView Weather",
    currentLocation: "Current Location",
    searchPlaceholder: "Search location...",
    saveLocation: "Save",
    savedLocations: "Saved Locations",
    noSavedLocations: "No saved locations yet",
    noSavedLocationsDesc: "Search for a location and save it to see it here.",
    hourlyForecast: "Hourly Forecast",
    dailyForecast: "5-Day Forecast",
    humidity: "Humidity",
    wind: "Wind",
    sunrise: "Sunrise",
    sunset: "Sunset",
    searchError: "Search Error",
    locationError: "Location Error",
    locationNotSupported: "Geolocation Not Supported",
    locationSaved: "Location Saved",
    locationSavedDesc: "has been added to your saved locations.",
    alreadySaved: "Already Saved",
    alreadySavedDesc: "is already in your saved locations.",
    locationRemoved: "Location Removed",
    locationRemovedDesc: "has been removed from your saved locations.",
    selectLocation: "Select a location",
    weatherFetchError: "Failed to fetch weather data. Please try again.",
    locationNotFound: "not found. Please try a different search term.",
    emptyStateMessage: "Search for a location or use your current location to see weather information",
    loading: "Loading...",
    windUnit: "m/s",
    feelsLike: "Feels like",
    language: "Language",
  },
  zh: {
    appTitle: "天气预报",
    currentLocation: "当前位置",
    searchPlaceholder: "搜索地点...",
    saveLocation: "保存",
    savedLocations: "已保存地点",
    noSavedLocations: "暂无保存的地点",
    noSavedLocationsDesc: "搜索并保存地点以在此处查看。",
    hourlyForecast: "小时预报",
    dailyForecast: "5天预报",
    humidity: "湿度",
    wind: "风速",
    sunrise: "日出",
    sunset: "日落",
    searchError: "搜索错误",
    locationError: "位置错误",
    locationNotSupported: "不支持地理位置",
    locationSaved: "地点已保存",
    locationSavedDesc: "已添加到您的保存地点。",
    alreadySaved: "已保存",
    alreadySavedDesc: "已在您的保存地点中。",
    locationRemoved: "地点已移除",
    locationRemovedDesc: "已从您的保存地点中移除。",
    selectLocation: "选择地点",
    weatherFetchError: "获取天气数据失败。请重试。",
    locationNotFound: "未找到。请尝试其他搜索词。",
    emptyStateMessage: "搜索地点或使用当前位置查看天气信息",
    loading: "加载中...",
    windUnit: "米/秒",
    feelsLike: "体感温度",
    language: "语言",
  },
}

