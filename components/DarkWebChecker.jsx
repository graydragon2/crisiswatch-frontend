'use client'

import { useState } from 'react'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export default function DarkWebChecker() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const check = async () => {
    if (!email.trim()) return
    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch(`${BACKEND}/api/darkweb?email=${encodeURIComponent(email.trim())}`)
      if (!res.ok) throw await res.json()
      const json = await res.json()
      setStatus(json)
    } catch (err) {
      setStatus({ error: err.error || 'Failed to contact server.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        />
        <button
          onClick={check}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Checking…' : 'Check Now'}
        </button>
      </div>

      {status?.error && <p className="text-yellow-400">{status.error}</p>}

      {status && status.found === false && (
        <p className="text-green-500">✅ No compromises found.</p>
      )}

      {status && status.found === true && (
        <div className="text-red-400">
          <p>⚠️ Compromised entries:</p>
          <ul className="list-disc ml-5">
            {status.entries.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
