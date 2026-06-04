import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, X, Clock } from "lucide-react";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";
import { getBackendAssetUrl } from "@/lib/backend";

const formatViews = (n: number) => {
  if (!n) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
};

export default function HistoryContent() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const { user } = useUser();

  const loadHistory = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.get(`/history/${user._id}`);
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    if (user) loadHistory();
    else setLoading(false);
  }, [user, loadHistory]);

  if (loading) return <VideoListSkeleton />;

  if (!user) {
    return (
      <EmptyState
        icon={<Clock size={64} strokeWidth={1} />}
        title="Keep track of what you watch"
        desc="Watch history isn't viewable when signed out."
      />
    );
  }

  if (history.length === 0) {
    return (
      <EmptyState
        icon={<Clock size={64} strokeWidth={1} />}
        title="No watch history yet"
        desc="Videos you watch will appear here."
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <p style={{ fontSize: "13px", color: "var(--yt-text-secondary)", marginBottom: "8px" }}>
        {history.length} videos
      </p>
      {history.map((item) => (
          <VideoListItem
            key={item._id}
            href={`/watch/${item.videoid?._id}`}
            src={getBackendAssetUrl(item.videoid?.filepath)}
          title={item.videoid?.videotitle}
          channel={item.videoid?.videochanel}
          views={item.videoid?.views}
          createdAt={item.videoid?.createdAt}
          badge={`Watched ${item.createdAt ? formatDistanceToNow(new Date(item.createdAt)) + " ago" : ""}`}
          menuOpen={menuOpen === item._id}
          onMenuToggle={() => setMenuOpen(menuOpen === item._id ? null : item._id)}
          onMenuAction={() => {
            setHistory((prev) => prev.filter((h) => h._id !== item._id));
            setMenuOpen(null);
          }}
          menuLabel="Remove from watch history"
        />
      ))}
    </div>
  );
}

export function VideoListSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ display: "flex", gap: "12px" }}>
          <div style={{ width: "168px", aspectRatio: "16/9", borderRadius: "8px", background: "var(--yt-bg-secondary)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: "14px", borderRadius: "4px", background: "var(--yt-bg-secondary)", marginBottom: "8px", width: "80%" }} />
            <div style={{ height: "12px", borderRadius: "4px", background: "var(--yt-bg-secondary)", width: "50%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, desc }: any) {
  return (
    <div style={{ textAlign: "center", padding: "64px 24px", color: "var(--yt-text-secondary)" }}>
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>{icon}</div>
      <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--yt-text-primary)", marginBottom: "8px" }}>{title}</h2>
      <p style={{ fontSize: "14px" }}>{desc}</p>
    </div>
  );
}

export function VideoListItem({ href, src, title, channel, views, createdAt, badge, menuOpen, onMenuToggle, onMenuAction, menuLabel }: any) {
  return (
    <div
      style={{ display: "flex", gap: "12px", padding: "8px", borderRadius: "8px", position: "relative" }}
      className="yt-video-card"
    >
      <Link href={href} style={{ textDecoration: "none", flexShrink: 0 }}>
        <div style={{ position: "relative", width: "168px", aspectRatio: "16/9", borderRadius: "8px", overflow: "hidden", background: "#0f0f0f" }}>
          <video
            src={src}
            className="yt-thumb-img"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            muted preload="metadata"
          />
          <span className="yt-duration">10:24</span>
        </div>
      </Link>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link href={href} style={{ textDecoration: "none" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 500, color: "var(--yt-text-primary)", marginBottom: "4px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {title}
          </h3>
        </Link>
        <p style={{ fontSize: "13px", color: "var(--yt-text-secondary)", marginBottom: "2px" }}>{channel}</p>
        <p style={{ fontSize: "13px", color: "var(--yt-text-secondary)" }}>
          {formatViews(views)} views{createdAt ? " • " + formatDistanceToNow(new Date(createdAt)) + " ago" : ""}
        </p>
        {badge && <p style={{ fontSize: "12px", color: "var(--yt-text-tertiary)", marginTop: "4px" }}>{badge}</p>}
      </div>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <button
          className="yt-icon-btn"
          style={{ width: "32px", height: "32px" }}
          onClick={onMenuToggle}
        >
          <MoreVertical size={16} />
        </button>
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "36px",
              background: "var(--yt-surface)",
              border: "1px solid var(--yt-border)",
              borderRadius: "8px",
              boxShadow: "0 4px 16px rgba(0,0,0,.15)",
              zIndex: 10,
              minWidth: "200px",
              padding: "4px 0",
            }}
          >
            <button
              onClick={onMenuAction}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                fontSize: "14px",
                color: "var(--yt-text-primary)",
                background: "none",
                border: "none",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
              }}
            >
              <X size={16} />
              {menuLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
