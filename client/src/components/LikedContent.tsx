import { useState, useEffect, useCallback } from "react";
import { ThumbsUp, Play } from "lucide-react";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { VideoListSkeleton, EmptyState, VideoListItem } from "./HistoryContent";
import { getBackendAssetUrl } from "@/lib/backend";

export default function LikedVideosContent() {
  const [likedVideos, setLikedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const { user } = useUser();

  const loadLikedVideos = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.get(`/like/${user._id}`);
      setLikedVideos(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    if (user) loadLikedVideos();
    else setLoading(false);
  }, [user, loadLikedVideos]);

  if (!user) return (
    <EmptyState
      icon={<ThumbsUp size={64} strokeWidth={1} />}
      title="Keep track of videos you like"
      desc="Sign in to see your liked videos."
    />
  );

  if (loading) return <VideoListSkeleton />;

  if (likedVideos.length === 0) return (
    <EmptyState
      icon={<ThumbsUp size={64} strokeWidth={1} />}
      title="No liked videos yet"
      desc="Videos you like will appear here."
    />
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: "var(--yt-text-secondary)" }}>{likedVideos.length} videos</p>
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
        {likedVideos.map((item) => (
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
              setLikedVideos((prev) => prev.filter((v) => v._id !== item._id));
              setMenuOpen(null);
            }}
            menuLabel="Remove from liked videos"
          />
        ))}
      </div>
    </div>
  );
}
