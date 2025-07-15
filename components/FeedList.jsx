'use client'

import { useState, useEffect } from 'react'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export default function FeedList() {
  const [feeds, setFeeds] = useState([])
  const [newFeed, setNewFeed] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFeeds()
  }, [])

  const fetchFeeds = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/feeds`)
      const json = await res.json()
      setFeeds(json.feeds || [])
    } catch {
      setError('Failed to load feeds.')
    }
  }

  const addFeed = async () => {
    if (!newFeed.trim()) return
    setError('')
    try {
      const res = await fetch(`${BACKEND}/api/feeds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newFeed.trim() }),
      })
      if (!res.ok) throw new Error()
      setNewFeed('')
      fetchFeeds()
    } catch {
      setError('Error adding feed.')
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={newFeed}
          onChange={(e) => setNewFeed(e.target.value)}
          placeholder="Add new RSS feed URL"
          className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        />
        <button
          onClick={addFeed}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <ul className="list-disc ml-5 text-sm text-black dark:text-white">
        {feeds.map((f, i) => (
          <li key={i}>{f.title || f.url}</li>
        ))}
      </ul>
    </div>
  )
}
