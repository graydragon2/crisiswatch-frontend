import { getSeverityBand, BAND_DOT_CLASS } from '@/lib/severity';

function timeAgo(dateStr) {
  if (!dateStr) return null;
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ThreatCard({ item }) {
  const band = typeof item.score === 'number' ? getSeverityBand(item.score) : null;

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl bg-card ring-1 ring-border p-4 hover:ring-primary/40 transition-colors"
    >
      <div className="flex items-start gap-3">
        {band && (
          <span className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${BAND_DOT_CLASS[band.name]}`} title={band.name} />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-card-foreground">{item.title}</p>
          {item.summary && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-xs text-muted-foreground">
            {item.source && <span className="break-all">{item.source}</span>}
            {item.pubDate && <span>· {timeAgo(item.pubDate)}</span>}
            {item.category && <span className="px-1.5 py-0.5 rounded bg-white/5">{item.category}</span>}
            {band && <span className="px-1.5 py-0.5 rounded bg-white/5">{band.name} · {item.score}/10</span>}
          </div>
        </div>
      </div>
    </a>
  );
}
