"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function LocalStorageNotice() {
  const [isOpen, setIsOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem("hasSeenLocalStorageNotice")
    if (hasSeenNotice !== "true") {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("hasSeenLocalStorageNotice", "true")
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Important Notice: Local Storage Usage</DialogTitle>
          <DialogDescription>
            This application uses your browser&apos;s local storage to save all your task data. Please be aware of the
            following risks:
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ul className="list-disc pl-6 space-y-2">
            <li>Your data is stored only on your current device and browser.</li>
            <li>Clearing your browser data or cache will result in data loss.</li>
            <li>Your data is not synced across devices or browsers.</li>
            <li>
              While local storage is generally secure, it&apos;s not encrypted and could potentially be accessed by malicious
              scripts.
            </li>
          </ul>
        </div>
        <DialogFooter className="sm:justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dontShowAgain"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked === true)}
            />
            <label
              htmlFor="dontShowAgain"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Don&apos;t show this message again
            </label>
          </div>
          <Button onClick={handleClose}>I understand</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

