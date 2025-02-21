"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type FilterContextType = {
  selectedProjects: string[]
  setSelectedProjects: React.Dispatch<React.SetStateAction<string[]>>
  showFilters: boolean
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export const useFilterContext = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error("useFilterContext must be used within a FilterProvider")
  }
  return context
}

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(true)

  return (
    <FilterContext.Provider value={{ selectedProjects, setSelectedProjects, showFilters, setShowFilters }}>
      {children}
    </FilterContext.Provider>
  )
}

