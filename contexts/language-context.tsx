"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Language, translations, type Translations } from "@/lib/i18n"

interface LanguageContextType {
  language: Language
  t: Translations
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "zh")) {
      setLanguageState(savedLanguage)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0] as Language
      if (browserLang === "zh") {
        setLanguageState("zh")
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = translations[language]

  return <LanguageContext.Provider value={{ language, t, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  console.log(context)
  if (context === undefined) {
    console.log("useLanguage must be used within a LanguageProvider")
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

