'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'

export function NotificationBadge() {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchNotificationCount = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/notifications/count`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setCount(data.total || 0)
      }
    } catch (error) {
      console.error('Error fetching notification count:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotificationCount()

    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchNotificationCount()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="relative">
        <Bell className="h-5 w-5" />
      </div>
    )
  }

  return (
    <div className="relative">
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  )
}
