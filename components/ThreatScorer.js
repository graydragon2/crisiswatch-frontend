'use client'

import { useState } from 'react'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export default function ThreatScorer() {
  const [text, setText] = useState('')
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)

  const scoreIt = async () => {
    if (!text.trim()) return
    setLoading(true)
    setScore(null)
    try {
      const res = await fetch(`${BACKEND}/api/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      })
      if (!res.ok) throw await res.json()
      const json = await res.json()
      setScore(json.score)
    } catch (err) {
      setScore({ error: err.error || 'Error scoring.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste headline or alert text"
          className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        />
        <button
          onClick={scoreIt}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Scoring…' : 'Score'}
        </button>
      </div>

      {score?.error && <p className="text-red-400">{score.error}</p>}

      {typeof score === 'number' && (
        <p className="text-green-400">
          ✅ Threat Score: <strong>{score}</strong>/10
        </p>
      )}
    </div>
  )
}