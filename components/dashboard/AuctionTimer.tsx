'use client'

import { useEffect, useState } from 'react'

interface AuctionTimerProps {
  endDate: string | Date
  className?: string
  urgent?: boolean
}

export function AuctionTimer({ endDate, className = '', urgent = false }: AuctionTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [isUrgent, setIsUrgent] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime()
      const now = new Date().getTime()
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft('Terminée')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      // Check if less than 1 hour left
      setIsUrgent(diff < 60 * 60 * 1000)

      if (days > 0) {
        setTimeLeft(`${days}j ${hours}h ${minutes}min`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}min ${seconds}s`)
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}min ${seconds}s`)
      } else {
        setTimeLeft(`${seconds}s`)
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [endDate])

  const urgentClass = isUrgent || urgent
    ? 'text-red-600 dark:text-red-400 font-bold'
    : 'text-muted-foreground'

  return (
    <span className={`${urgentClass} ${className}`}>
      {timeLeft}
    </span>
  )
}
