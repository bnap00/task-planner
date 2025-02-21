import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "./contexts/settings-context"
import { ProjectProvider } from "./contexts/project-context"
import { TaskProvider } from "./contexts/task-context"
import { PomodoroProvider } from "./contexts/pomodoro-context"
import { PipProvider } from "./contexts/pip-context"
import { KanbanProvider } from "./contexts/kanban-context"
import { FilterProvider } from "./contexts/filter-context"
import { StickyNavbar } from "./components/sticky-navbar"
import { StickyPomodoro } from "./components/sticky-pomodoro"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Simple Task Planner",
  description: "Manage your tasks efficiently with the Simple Task Planner",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SettingsProvider>
            <ProjectProvider>
              <TaskProvider>
                <PomodoroProvider>
                  <PipProvider>
                    <KanbanProvider>
                      <FilterProvider>
                        <div className="flex flex-col min-h-screen">
                          <StickyNavbar />
                          <main className="flex-grow pb-16">{children}</main>
                          <StickyPomodoro />
                        </div>
                      </FilterProvider>
                    </KanbanProvider>
                  </PipProvider>
                </PomodoroProvider>
              </TaskProvider>
            </ProjectProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

