'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function HomePage() {
  const router = useRouter()
  const [joinCode, setJoinCode] = useState('')

  const createRoom = async () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()

    const { data, error } = await supabase
      .from('rooms')
      .insert({ code })
      .select()
      .single()

    if (!error && data) {
      router.push(`/room/${code}`)
    }
  }

  const joinRoom = () => {
    if (!joinCode) return
    router.push(`/room/${joinCode.toUpperCase()}`)
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pomodoro Room</h1>

      <button
        onClick={createRoom}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
      >
        Create Room
      </button>

      <div className="mb-4">
        <input
          type="text"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Enter room code"
          className="border border-gray-300 px-4 py-2 rounded mr-2"
        />
        <button
          onClick={joinRoom}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Join Room
        </button>
      </div>
    </main>
  )
}