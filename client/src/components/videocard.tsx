import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { getBackendAssetUrl } from "@/lib/backend";

export default function VideoCard({ video }: any) {
  const [menuOpen, setMenuOpen] = useState(false);

  const formatViews = (n: number) => {
    if (!n) return "0";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
    return n.toString();
  };

  return (
    <div className="yt-video-card" style={{ position: "relative" }}>
      <Link href={`/watch/${video?._id}`} style={{ textDecoration: "none", color: "inherit" }}>
        {/* Thumbnail */}
        <div
          style={{
            position: "relative",
            paddingTop: "56.25%",
            background: "#0f0f0f",
            borderRadius: "12px",
            overflow: "hidden",
            marginBottom: "12px",
          }}
        >
          <video
            src={getBackendAssetUrl(video?.filepath)}
            className="yt-thumb-img"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            muted
            preload="metadata"
          />
          <span className="yt-duration">10:24</span>
        </div>

        {/* Info row */}
        <div style={{ display: "flex", gap: "12px" }}>
          <Link
            href={`/channel/${video?.uploader}`}
            onClick={(e) => e.stopPropagation()}
            style={{ flexShrink: 0, textDecoration: "none" }}
          >
            <Avatar style={{ width: "36px", height: "36px" }}>
              <AvatarFallback
                style={{
                  background: `hsl(${(video?.videochanel?.charCodeAt(0) || 0) * 20}, 60%, 45%)`,
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {(video?.videochanel?.[0] || "?").toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: "14px",
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
              {video?.videotitle}
            </h3>
            <p style={{ fontSize: "13px", color: "var(--yt-text-secondary)", marginBottom: "2px" }}>
              {video?.videochanel}
            </p>
            <p style={{ fontSize: "13px", color: "var(--yt-text-secondary)" }}>
              {formatViews(video?.views)} views •{" "}
              {video?.createdAt
                ? formatDistanceToNow(new Date(video.createdAt)) + " ago"
                : ""}
            </p>
          </div>

          {/* 3-dot menu */}
          <button
            className="yt-icon-btn yt-menu-btn"
            style={{ width: "32px", height: "32px", flexShrink: 0, opacity: 0 }}
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(!menuOpen);
            }}
            aria-label="More options"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </Link>

      <style>{`.yt-video-card:hover .yt-menu-btn { opacity: 1 !important; }`}</style>
    </div>
  );
}
