'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface AuctionTimerProps {
  endDate: string
  onExpire?: () => void
}

export function AuctionTimer({ endDate, onExpire }: AuctionTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [isExpired, setIsExpired] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime()
      const now = new Date().getTime()
      const difference = end - now

      if (difference <= 0) {
        setTimeLeft('Terminée')
        setIsExpired(true)
        if (onExpire) onExpire()
        return
      }

      // Check if less than 1 hour
      setIsUrgent(difference < 60 * 60 * 1000)

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      let timeString = ''
      if (days > 0) {
        timeString = `${days}j ${hours}h ${minutes}m`
      } else if (hours > 0) {
        timeString = `${hours}h ${minutes}m ${seconds}s`
      } else {
        timeString = `${minutes}m ${seconds}s`
      }

      setTimeLeft(timeString)
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [endDate, onExpire])

  return (
    <div className={`flex items-center gap-2 text-sm font-medium ${
      isExpired ? 'text-muted-foreground' : 
      isUrgent ? 'text-red-600' : 
      'text-foreground'
    }`}>
      <Clock className="h-4 w-4" />
      <span>{isExpired ? 'Enchère terminée' : `Se termine dans ${timeLeft}`}</span>
    </div>
  )
}
