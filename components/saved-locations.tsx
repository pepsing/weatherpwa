"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface SavedLocationsProps {
  locations: string[]
  onSelect: (location: string) => void
  onRemove: (location: string) => void
}

export default function SavedLocations({ locations, onSelect, onRemove }: SavedLocationsProps) {
  const { t } = useLanguage()

  if (locations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.savedLocations}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t.noSavedLocationsDesc}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.savedLocations}</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          {locations.map((location) => (
            <div key={location} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
              <Button
                variant="ghost"
                className="flex items-center justify-start p-2 h-auto w-full"
                onClick={() => onSelect(location)}
              >
                <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                <span className="truncate">{location}</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onRemove(location)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

