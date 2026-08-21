'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { apiFetch } from '@/lib/api'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export default function FeedList() {
  const [feeds, setFeeds] = useState([])
  const [newFeed, setNewFeed] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
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
    } finally {
      setLoading(false)
    }
  }

  const addFeed = async () => {
    if (!newFeed.trim()) return
    setAdding(true)
    setError('')
    try {
      const res = await apiFetch('/api/feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newFeed.trim() }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to add feed.')
      setFeeds(json.feeds || [])
      setNewFeed('')
    } catch (err) {
      setError(err.message || 'Error adding feed.')
    } finally {
      setAdding(false)
    }
  }

  const removeFeed = async (url) => {
    setError('')
    try {
      const res = await apiFetch('/api/feeds', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to remove feed.')
      setFeeds(json.feeds || [])
    } catch (err) {
      setError(err.message || 'Error removing feed.')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={newFeed}
          onChange={(e) => setNewFeed(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addFeed()}
          placeholder="Add new RSS feed URL"
          className="flex-1 p-2 rounded bg-white/5 text-card-foreground text-sm placeholder-muted-foreground border border-border"
        />
        <button
          onClick={addFeed}
          disabled={adding}
          className="px-3 py-2 bg-primary text-white text-sm rounded hover:opacity-90 disabled:opacity-50"
        >
          {adding ? 'Adding…' : 'Add'}
        </button>
      </div>

      {error && <p className="text-sm text-critical">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : feeds.length === 0 ? (
        <p className="text-sm text-muted-foreground">No feeds configured yet.</p>
      ) : (
        <ul className="space-y-2">
          {feeds.map((f) => (
            <li
              key={f.url}
              className="flex items-center justify-between gap-2 border border-border rounded-lg px-3 py-2"
            >
              <span className="text-sm text-card-foreground truncate">{f.title || f.url}</span>
              <button
                onClick={() => removeFeed(f.url)}
                aria-label={`Remove ${f.title || f.url}`}
                className="text-muted-foreground hover:text-critical flex-shrink-0"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
