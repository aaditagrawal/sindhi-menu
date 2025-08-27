"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

export function MenuNotification() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    console.log("MenuNotification component mounted - showing toast")

    // Add a small delay to ensure everything is ready
    const timer = setTimeout(() => {
      console.log("Attempting to show toast...")

      // Try different toast methods
      toast("The menu is now contributed by the Indian Kitchen and is up to date with what they provide. According to them, this is more up to date than print.", {
        duration: 10000,
        description: "For any changes, kindly contact tikmenu@aaditagrawal.com",
        action: {
          label: "Contact Support",
          onClick: () => {
            console.log("Contact Support button clicked")
            window.open("mailto:tikmenu@aaditagrawal.com")
          },
        },
      })

    }, 1000)

    return () => clearTimeout(timer)
  }, [mounted])

  return null // This component doesn't render anything
}
