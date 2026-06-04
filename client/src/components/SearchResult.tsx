import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axiosInstance from "@/lib/axiosinstance";
import { getBackendAssetUrl } from "@/lib/backend";

const SearchResult = ({ query }: { query: string }) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const formatViews = (n: number) => {
    if (!n) return "0";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
    return n.toString();
  };

  useEffect(() => {
    if (!query.trim()) return;
    const search = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/video/getall");
        const data: any[] = Array.isArray(res.data) ? res.data : [];
        const q = query.toLowerCase();
        setResults(
          data.filter(
            (v: any) =>
              v.videotitle?.toLowerCase().includes(q) ||
              v.videochanel?.toLowerCase().includes(q)
          )
        );
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    search();
  }, [query]);

  if (!query.trim()) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--yt-text-secondary)" }}>
        <p style={{ fontSize: "16px" }}>Enter a search term to find videos.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "24px" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
            <div style={{ width: "360px", aspectRatio: "16/9", borderRadius: "12px", background: "var(--yt-bg-secondary)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: "16px", borderRadius: "4px", background: "var(--yt-bg-secondary)", width: "70%", marginBottom: "12px" }} />
              <div style={{ height: "12px", borderRadius: "4px", background: "var(--yt-bg-secondary)", width: "40%", marginBottom: "8px" }} />
              <div style={{ height: "12px", borderRadius: "4px", background: "var(--yt-bg-secondary)", width: "50%" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--yt-text-secondary)" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--yt-text-primary)", marginBottom: "8px" }}>
          No results found
        </h2>
        <p style={{ fontSize: "14px" }}>
          Try different keywords or remove search filters
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 0" }}>
      <p style={{ fontSize: "12px", color: "var(--yt-text-secondary)", marginBottom: "16px" }}>
        About {results.length.toLocaleString()} results for &quot;{query}&quot;
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {results.map((video: any) => (
          <div key={video._id} style={{ display: "flex", gap: "16px" }} className="yt-video-card">
            <Link href={`/watch/${video._id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
              <div
                style={{
                  position: "relative",
                  width: "360px",
                  aspectRatio: "16/9",
                  borderRadius: "12px",
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
            </Link>

            <div style={{ flex: 1, paddingTop: "4px" }}>
              <Link href={`/watch/${video._id}`} style={{ textDecoration: "none" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: "var(--yt-text-primary)",
                    marginBottom: "8px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {video.videotitle}
                </h3>
              </Link>

              <p style={{ fontSize: "13px", color: "var(--yt-text-secondary)", marginBottom: "8px" }}>
                {formatViews(video.views)} views •{" "}
                {video.createdAt ? formatDistanceToNow(new Date(video.createdAt)) + " ago" : ""}
              </p>

              <Link href={`/channel/${video.uploader}`} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "8px" }}>
                <Avatar style={{ width: "24px", height: "24px" }}>
                  <AvatarFallback style={{ fontSize: "11px", background: "#065fd4", color: "white" }}>
                    {video.videochanel?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <span style={{ fontSize: "13px", color: "var(--yt-text-secondary)" }}>{video.videochanel}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResult;
