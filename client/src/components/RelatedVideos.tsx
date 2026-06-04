import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { getBackendAssetUrl } from "@/lib/backend";

interface RelatedVideosProps {
  videos: Array<{
    _id: string;
    videotitle: string;
    videochanel: string;
    filepath: string;
    views: number;
    createdAt: string;
  }>;
}

export default function RelatedVideos({ videos }: RelatedVideosProps) {
  const formatViews = (n: number) => {
    if (!n) return "0";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
    return n.toString();
  };

  if (!videos || videos.length === 0) {
    return (
      <p style={{ fontSize: "14px", color: "var(--yt-text-secondary)", padding: "16px 0" }}>
        No related videos found.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {videos.map((video) => (
        <Link
          key={video._id}
          href={`/watch/${video._id}`}
          style={{ textDecoration: "none", color: "inherit", display: "flex", gap: "8px" }}
          className="yt-video-card"
        >
          {/* Thumbnail */}
          <div
            style={{
              position: "relative",
              width: "168px",
              aspectRatio: "16/9",
              flexShrink: 0,
              borderRadius: "8px",
              overflow: "hidden",
              background: "#0f0f0f",
            }}
          >
            <video
              src={getBackendAssetUrl(video.filepath)}
              className="yt-thumb-img"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
              preload="metadata"
            />
            <span className="yt-duration">10:24</span>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: "13px",
                fontWeight: 500,
                lineHeight: 1.4,
                color: "var(--yt-text-primary)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                marginBottom: "4px",
              }}
            >
              {video.videotitle}
            </h3>
            <p style={{ fontSize: "12px", color: "var(--yt-text-secondary)", marginBottom: "2px" }}>
              {video.videochanel}
            </p>
            <p style={{ fontSize: "12px", color: "var(--yt-text-secondary)" }}>
              {formatViews(video.views)} views •{" "}
              {video.createdAt ? formatDistanceToNow(new Date(video.createdAt)) + " ago" : ""}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
