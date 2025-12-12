'use client'

import { Badge } from '@/components/ui/badge'

type BidStatus = 'active_leading' | 'active_outbid' | 'won' | 'lost'

interface BidStatusBadgeProps {
  status: BidStatus
  className?: string
}

export function BidStatusBadge({ status, className = '' }: BidStatusBadgeProps) {
  const variants = {
    active_leading: {
      label: 'En tête',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    },
    active_outbid: {
      label: 'Surenchéri',
      className: 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300 border-red-200 dark:border-red-800',
    },
    won: {
      label: '✓ Gagnée',
      className: 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300 border-green-200 dark:border-green-800',
    },
    lost: {
      label: 'Perdue',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-300 border-gray-200 dark:border-gray-800',
    },
  }

  const variant = variants[status]

  return (
    <Badge variant="outline" className={`${variant.className} ${className}`}>
      {variant.label}
    </Badge>
  )
}
