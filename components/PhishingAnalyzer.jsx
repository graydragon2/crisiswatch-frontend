'use client';

import { useRef, useState } from 'react';
import { Mail, MessageSquare, Link2, Image as ImageIcon } from 'lucide-react';
import { BAND_BADGE_CLASS } from '@/lib/severity';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const TABS = [
  { key: 'email', label: 'Email', Icon: Mail },
  { key: 'message', label: 'Message', Icon: MessageSquare },
  { key: 'url', label: 'URL', Icon: Link2 },
  { key: 'screenshot', label: 'Screenshot', Icon: ImageIcon }
];

const PLACEHOLDER = {
  email: 'Paste the full email content, including sender if visible…',
  message: 'Paste the text message or chat content…',
  url: 'Paste the URL…'
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PhishingAnalyzer() {
  const [tab, setTab] = useState('email');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null); // { file, previewUrl }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const switchTab = (key) => {
    setTab(key);
    setResult(null);
    setError(null);
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      setError(`Image too large — max ${MAX_IMAGE_BYTES / 1024 / 1024}MB`);
      return;
    }
    setError(null);
    setImage({ file, previewUrl: URL.createObjectURL(file) });
  };

  const canSubmit = tab === 'screenshot' ? Boolean(image) : text.trim().length > 0;

  const analyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      let body;
      if (tab === 'screenshot') {
        const base64 = await fileToBase64(image.file);
        body = { type: 'screenshot', content: base64, mediaType: image.file.type };
      } else {
        body = { type: tab, content: text.trim() };
      }
      const res = await fetch(`${BACKEND}/api/phishing/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Status ${res.status}`);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => switchTab(key)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
              tab === key ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground hover:text-card-foreground'
            }`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {tab === 'screenshot' ? (
        <div>
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onFileChange} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 rounded border border-dashed border-border text-sm text-muted-foreground hover:text-card-foreground hover:border-primary/40 transition-colors"
          >
            {image ? image.file.name : 'Click to choose a screenshot'}
          </button>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.previewUrl} alt="Screenshot preview" className="mt-2 max-h-48 rounded border border-border" />
          )}
        </div>
      ) : (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER[tab]}
          rows={tab === 'url' ? 2 : 5}
          className="w-full p-2 rounded bg-white/5 text-card-foreground text-sm placeholder-muted-foreground border border-border resize-none"
        />
      )}

      <button
        onClick={analyze}
        disabled={!canSubmit || loading}
        className="px-4 py-2 bg-primary text-white text-sm rounded hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Analyzing…' : 'Analyze'}
      </button>

      {error && <p className="text-sm text-critical">{error}</p>}

      {result && (
        <div className="rounded-lg bg-white/5 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-foreground">{result.riskScore}</p>
            <div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ring-1 ${BAND_BADGE_CLASS[result.riskLevel] || BAND_BADGE_CLASS.Medium}`}>
                {result.riskLevel} risk
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">Risk score out of 100</p>
            </div>
          </div>
          <p className="text-sm text-card-foreground">{result.summary}</p>
          {result.indicators?.length > 0 && (
            <ul className="text-xs text-muted-foreground list-disc ml-4 space-y-0.5">
              {result.indicators.map((ind, i) => (
                <li key={i}>{ind}</li>
              ))}
            </ul>
          )}
          <p className="text-[11px] text-muted-foreground pt-2 border-t border-border">
            AI-assessed signal, not a verdict — this can't confirm identity or visit links, and should inform judgment rather than replace it.
          </p>
        </div>
      )}
    </div>
  );
}
