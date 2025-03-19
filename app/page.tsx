"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, MapPin, Plus, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WeatherCard from "@/components/weather-card"
import ForecastList from "@/components/forecast-list"
import SavedLocations from "@/components/saved-locations"
import LanguageSwitcher from "@/components/language-switcher"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Helper function to convert Open-Meteo weather codes to descriptions
const getWeatherDescription = (code: number, language: string): string => {
  const weatherCodesEn: Record<number, string> = {
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
    99: "Thunderstorm with Heavy Hail",
  }

  const weatherCodesZh: Record<number, string> = {
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
    99: "雷暴伴有大冰雹",
  }

  return language === "zh" ? weatherCodesZh[code] || "未知" : weatherCodesEn[code] || "Unknown"
}

// Helper function to convert Open-Meteo weather codes to OpenWeatherMap icon codes
const getWeatherIcon = (code: number): string => {
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

// Define location data type
interface LocationData {
  name: string
  latitude: number
  longitude: number
  admin1?: string
  country?: string
  formattedName?: string
}

// Define saved locations data type
interface SavedLocationData {
  [key: string]: LocationData
}

export default function WeatherApp() {
  const { language, t } = useLanguage()
  const [currentWeather, setCurrentWeather] = useState<any>(null)
  const [forecast, setForecast] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<LocationData[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [savedLocations, setSavedLocations] = useState<string[]>([])
  const [savedLocationData, setSavedLocationData] = useState<SavedLocationData>({})
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Load saved locations from localStorage
    const saved = localStorage.getItem("savedLocations")
    if (saved) {
      setSavedLocations(JSON.parse(saved))
    }

    // Load saved location data from localStorage
    const savedData = localStorage.getItem("savedLocationData")
    if (savedData) {
      setSavedLocationData(JSON.parse(savedData))
    }

    // Get current location weather on initial load
    getCurrentLocationWeather()
  }, [])

  const getCurrentLocationWeather = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          // Create a key for the current location
          const currentLocationKey = "CurrentLocation"

          // Check if we already have this location data stored
          if (savedLocationData[currentLocationKey]) {
            // Update the stored current location with new coordinates
            const updatedLocationData = {
              ...savedLocationData,
              [currentLocationKey]: {
                name: t.currentLocation,
                latitude,
                longitude,
              },
            }
            setSavedLocationData(updatedLocationData)
            localStorage.setItem("savedLocationData", JSON.stringify(updatedLocationData))
          } else {
            // Store current location data
            const updatedLocationData = {
              ...savedLocationData,
              [currentLocationKey]: {
                name: t.currentLocation,
                latitude,
                longitude,
              },
            }
            setSavedLocationData(updatedLocationData)
            localStorage.setItem("savedLocationData", JSON.stringify(updatedLocationData))
          }

          fetchWeatherByCoords(latitude, longitude, t.currentLocation)
        },
        (error) => {
          console.error("Geolocation error:", error)
          toast({
            title: t.locationError,
            description: "Unable to get your location. Please search manually.",
            variant: "destructive",
          })
          setLoading(false)
        },
      )
    } else {
      toast({
        title: t.locationNotSupported,
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const fetchWeatherByCoords = async (lat: number, lon: number, locationName: string) => {
    setLoading(true)
    try {
      // Fetch current weather and forecast from Open-Meteo with proper error handling
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&language=${language}`

      console.log("Fetching weather from:", weatherUrl)
      const weatherResponse = await fetch(weatherUrl)

      if (!weatherResponse.ok) {
        const errorText = await weatherResponse.text()
        console.error("Weather API error:", errorText)
        throw new Error(`Weather API error: ${weatherResponse.status} ${errorText}`)
      }

      const weatherData = await weatherResponse.json()
      console.log("Weather data received:", weatherData)

      // Format the data for our components
      const formattedWeather = {
        name: locationName || t.currentLocation, // Use the provided location name
        main: {
          temp: weatherData.current.temperature_2m,
          feels_like: weatherData.current.apparent_temperature,
          humidity: weatherData.current.relative_humidity_2m,
        },
        weather: [
          {
            main: getWeatherDescription(weatherData.current.weather_code, language),
            description: getWeatherDescription(weatherData.current.weather_code, language).toLowerCase(),
            icon: getWeatherIcon(weatherData.current.weather_code),
          },
        ],
        wind: {
          speed: weatherData.current.wind_speed_10m,
        },
        sys: {
          sunrise: new Date(weatherData.daily.sunrise[0]).getTime() / 1000,
          sunset: new Date(weatherData.daily.sunset[0]).getTime() / 1000,
        },
      }

      // Format forecast data
      const forecastData = {
        list: weatherData.hourly.time.map((time: string, index: number) => ({
          dt: new Date(time).getTime() / 1000,
          main: {
            temp: weatherData.hourly.temperature_2m[index],
            feels_like: weatherData.hourly.apparent_temperature[index],
            humidity: weatherData.hourly.relative_humidity_2m[index],
          },
          weather: [
            {
              main: getWeatherDescription(weatherData.hourly.weather_code[index], language),
              description: getWeatherDescription(weatherData.hourly.weather_code[index], language).toLowerCase(),
              icon: getWeatherIcon(weatherData.hourly.weather_code[index]),
            },
          ],
          wind: {
            speed: weatherData.hourly.wind_speed_10m[index],
          },
        })),
      }

      setCurrentWeather(formattedWeather)
      setCurrentLocation(locationName)
      setForecast(forecastData)
      setLoading(false)
      // Clear search results
      setSearchResults([])
      setShowSearchResults(false)
    } catch (error) {
      console.error("Error fetching weather:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : t.weatherFetchError,
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const searchLocations = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)

    // Check if we already have this location in our saved data
    const locationKey = searchQuery.toLowerCase().trim()
    const existingLocationData = Object.values(savedLocationData).find(
      (location) => location.name.toLowerCase() === locationKey,
    )

    if (existingLocationData) {
      console.log("Using cached location data:", existingLocationData)
      // Use the cached location data
      fetchWeatherByCoords(existingLocationData.latitude, existingLocationData.longitude, existingLocationData.name)
      setSearchQuery("")
      return
    }

    try {
      // Use Open-Meteo geocoding API to get coordinates for the location
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=${language}`
      console.log("Searching location:", geoUrl)

      const geoResponse = await fetch(geoUrl)

      if (!geoResponse.ok) {
        const errorText = await geoResponse.text()
        console.error("Geocoding API error:", errorText)
        throw new Error(`Geocoding API error: ${geoResponse.status} ${errorText}`)
      }

      const geoData = await geoResponse.json()
      console.log("Geocoding data received:", geoData)

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`${searchQuery} ${t.locationNotFound}`)
      }

      // Process the results
      const results = geoData.results.map((result: any) => {
        const { latitude, longitude, name, admin1, country } = result

        // Format the location name
        let formattedName = name
        if (admin1) {
          formattedName += `, ${admin1}`
        }
        if (country && country !== admin1) {
          formattedName += `, ${country}`
        }

        return {
          name,
          latitude,
          longitude,
          admin1,
          country,
          formattedName,
        }
      })

      // If there's only one result, use it directly
      if (results.length === 1) {
        const location = results[0]
        selectLocation(location)
      } else {
        // Show the results for selection
        setSearchResults(results)
        setShowSearchResults(true)
        setLoading(false)
      }
    } catch (error) {
      console.error("Error searching weather:", error)
      toast({
        title: t.searchError,
        description: error instanceof Error ? error.message : t.weatherFetchError,
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const selectLocation = async (location: LocationData) => {
    // Store the location data
    const newLocationData = {
      name: location.formattedName || location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      admin1: location.admin1,
      country: location.country,
    }

    const updatedLocationData = {
      ...savedLocationData,
      [location.formattedName || location.name]: newLocationData,
    }

    setSavedLocationData(updatedLocationData)
    localStorage.setItem("savedLocationData", JSON.stringify(updatedLocationData))

    // Now fetch weather using the coordinates
    await fetchWeatherByCoords(location.latitude, location.longitude, location.formattedName || location.name)

    // Update the location name
    setCurrentLocation(location.formattedName || location.name)
    setSearchQuery("")
  }

  const saveLocation = () => {
    if (!currentLocation) return

    if (!savedLocations.includes(currentLocation)) {
      const newSavedLocations = [...savedLocations, currentLocation]
      setSavedLocations(newSavedLocations)
      localStorage.setItem("savedLocations", JSON.stringify(newSavedLocations))
      toast({
        title: t.locationSaved,
        description: `${currentLocation} ${t.locationSavedDesc}`,
      })
    } else {
      toast({
        title: t.alreadySaved,
        description: `${currentLocation} ${t.alreadySavedDesc}`,
      })
    }
  }

  const loadSavedLocation = (location: string) => {
    // Find the location data for this saved location
    const locationData = Object.values(savedLocationData).find((data) => data.name === location)

    if (locationData) {
      // Use the stored coordinates and name
      fetchWeatherByCoords(locationData.latitude, locationData.longitude, locationData.name)
    } else {
      // Fallback to the old method if we don't have the data
      setSearchQuery(location)
      setTimeout(() => {
        searchLocations(new Event("submit") as any)
      }, 100)
    }

    setMenuOpen(false)
  }

  const removeLocation = (location: string) => {
    const newSavedLocations = savedLocations.filter((loc) => loc !== location)
    setSavedLocations(newSavedLocations)
    localStorage.setItem("savedLocations", JSON.stringify(newSavedLocations))
    toast({
      title: t.locationRemoved,
      description: `${location} ${t.locationRemovedDesc}`,
    })
  }

  // Refresh weather data when language changes
  useEffect(() => {
    if (currentWeather) {
      // If we have current weather data, refresh it with the new language
      const locationData = Object.values(savedLocationData).find((data) => data.name === currentLocation)
      if (locationData) {
        fetchWeatherByCoords(locationData.latitude, locationData.longitude, locationData.name)
      } else if (currentLocation === t.currentLocation || currentLocation === "Current Location") {
        getCurrentLocationWeather()
      }
    }
  }, [language])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300">{t.appTitle}</h1>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
              <Menu />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={cn("md:col-span-1 md:block", menuOpen ? "block" : "hidden")}>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <form onSubmit={searchLocations} className="flex gap-2 mb-4">
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>

                {showSearchResults && searchResults.length > 0 && (
                  <Card className="mb-4">
                    <CardHeader className="py-2 px-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm">{t.selectLocation}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setShowSearchResults(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className="w-full justify-start text-left h-auto py-2"
                            onClick={() => selectLocation(result)}
                          >
                            <div>
                              <div className="font-medium">{result.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {result.admin1}
                                {result.country && result.country !== result.admin1 ? `, ${result.country}` : ""}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button variant="outline" className="w-full mb-2" onClick={getCurrentLocationWeather}>
                  <MapPin className="mr-2 h-4 w-4" />
                  {t.currentLocation}
                </Button>
                {currentLocation && (
                  <Button variant="outline" className="w-full" onClick={saveLocation}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t.saveLocation} {currentLocation}
                  </Button>
                )}
              </CardContent>
            </Card>

            <SavedLocations locations={savedLocations} onSelect={loadSavedLocation} onRemove={removeLocation} />
          </div>

          <div className="md:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="sr-only">{t.loading}</span>
              </div>
            ) : currentWeather ? (
              <div>
                <WeatherCard weather={currentWeather} />

                <Tabs defaultValue="hourly" className="mt-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="hourly">{t.hourlyForecast}</TabsTrigger>
                    <TabsTrigger value="daily">{t.dailyForecast}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="hourly">
                    {forecast && <ForecastList forecast={forecast.list.slice(0, 24)} type="hourly" />}
                  </TabsContent>
                  <TabsContent value="daily">
                    {forecast && (
                      <ForecastList
                        forecast={forecast.list.filter((_: any, i: number) => i % 8 === 0).slice(0, 5)}
                        type="daily"
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card className="h-64 flex items-center justify-center">
                <p className="text-center text-muted-foreground">{t.emptyStateMessage}</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

