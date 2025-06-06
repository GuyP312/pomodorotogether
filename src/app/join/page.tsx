'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function JoinPage() {
  const [code, setCode] = useState('')
  const router = useRouter()

  const handleJoin = () => {
    if (code) {
      router.push(`/room/${code.toUpperCase()}`)
    }
  }

  return (
    <div>
      <input
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Enter invite code"
      />
      <button onClick={handleJoin}>Join Room</button>
    </div>
  )
}