import { useState, useEffect, useCallback } from "react";
import { Clock, Play } from "lucide-react";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";
import { VideoListSkeleton, EmptyState, VideoListItem } from "./HistoryContent";
import { getBackendAssetUrl } from "@/lib/backend";

export default function WatchLaterContent() {
  const [watchLater, setWatchLater] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const { user } = useUser();

  const loadWatchLater = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.get(`/watch/${user._id}`);
      setWatchLater(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    if (user) loadWatchLater();
    else setLoading(false);
  }, [user, loadWatchLater]);

  if (!user) return (
    <EmptyState
      icon={<Clock size={64} strokeWidth={1} />}
      title="Save videos for later"
      desc="Sign in to access your Watch later playlist."
    />
  );

  if (loading) return <VideoListSkeleton />;

  if (watchLater.length === 0) return (
    <EmptyState
      icon={<Clock size={64} strokeWidth={1} />}
      title="No videos saved"
      desc="Videos you save for later will appear here."
    />
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: "var(--yt-text-secondary)" }}>{watchLater.length} videos</p>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "18px",
            background: "var(--yt-text-primary)",
            color: "var(--yt-bg)",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <Play size={16} /> Play all
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {watchLater.map((item) => (
          <VideoListItem
            key={item._id}
            href={`/watch/${item.videoid?._id}`}
            src={getBackendAssetUrl(item.videoid?.filepath)}
            title={item.videoid?.videotitle}
            channel={item.videoid?.videochanel}
            views={item.videoid?.views}
            createdAt={item.videoid?.createdAt}
            badge=""
            menuOpen={menuOpen === item._id}
            onMenuToggle={() => setMenuOpen(menuOpen === item._id ? null : item._id)}
            onMenuAction={() => {
              setWatchLater((prev) => prev.filter((v) => v._id !== item._id));
              setMenuOpen(null);
            }}
            menuLabel="Remove from Watch later"
          />
        ))}
      </div>
    </div>
  );
}
