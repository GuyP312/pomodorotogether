'use client'

import { useEffect, useState } from 'react'

type TimerProps = {
  startTime: string // ISO timestamp from Supabase
  duration: number  // in seconds (e.g. 1500 for 25 mins)
  status: 'focus' | 'break'
}

export default function Timer({ startTime, duration, status }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const start = new Date(startTime)
      const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000)
      const remaining = Math.max(duration - elapsed, 0)
      setTimeLeft(remaining)
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, duration])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold mb-1">
        {status === 'focus' ? 'Focus Time' : 'Break Time'}
      </h2>
      <div className="text-4xl font-bold">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  )
}