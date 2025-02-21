"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Settings, Menu, BookOpen, KanbanIcon as LayoutKanban, InfoIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"

export function StickyNavbar() {
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  

  const NavItems = () => (
    <>
      <Link href="/kanban" passHref>
        <Button variant="outline">
          <LayoutKanban className="mr-2 h-4 w-4" /> Kanban
        </Button>
      </Link>
      <Link href="/project-info" passHref>
        <Button variant="outline">
          <InfoIcon className="mr-2 h-4 w-4" /> Project Info
        </Button>
      </Link>
      <Link href="/blog" passHref>
        <Button variant="outline">
          <BookOpen className="mr-2 h-4 w-4" /> Blog
        </Button>
      </Link>
      <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} variant="ghost" size="icon">
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </>
  )

  return (
    <nav className="sticky top-0 z-10 flex justify-between items-center mb-4 p-4 bg-background border-b">
      <Link href="/" className="text-xl font-bold">
        Simple Task Planner
      </Link>
      <div className="hidden md:flex items-center space-x-2">
        <NavItems />
      </div>
      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <div className="flex flex-col space-y-4 mt-4">
              <NavItems />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

