'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Timer from '@/components/Timer'

export default function RoomPage() {
  const { code } = useParams()
  const [room, setRoom] = useState<any>(null)

  useEffect(() => {
    if (!code) return

    const fetchRoom = async () => {
      const { data } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', String(code))
        .single()

      if (data) setRoom(data)
    }

    const channel = supabase
      .channel(`room:${code}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `code=eq.${code}`
        },
        (payload) => {
          setRoom(payload.new)
        }
      )
      .subscribe()

    fetchRoom()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [code])

  if (!room) return <div>Loading room...</div>

  return (
    <div>
      <h1>Room Code: {code}</h1>
      <h2>Status: {room.status}</h2>
      <Timer
        startTime={room.start_time}
        duration={room.duration}
        status={room.status}
      />
    </div>
  )
}
