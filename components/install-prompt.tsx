"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        toast({
          title: t.installSuccess || "Installation successful",
          description: t.installSuccessDesc || "The app has been installed successfully"
        })
      }

      setDeferredPrompt(null)
      setIsVisible(false)
    } catch (error) {
      console.error('Installation failed:', error)
      toast({
        title: t.installError || "Installation failed",
        description: t.installErrorDesc || "Failed to install the app. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-2">{t.installPromptTitle || "Install SkyView Weather"}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {t.installPromptDesc || "Install our app for a better experience and quick access to weather updates."}
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsVisible(false)}>
          {t.later || "Later"}
        </Button>
        <Button onClick={handleInstall}>
          {t.install || "Install"}
        </Button>
      </div>
    </div>
  )
}