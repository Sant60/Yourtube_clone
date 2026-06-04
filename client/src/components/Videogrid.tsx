import React, { useEffect, useState } from "react";
import Videocard from "./videocard";
import axiosInstance from "@/lib/axiosinstance";

const VideoSkeleton = () => (
  <div>
    <div
      style={{
        paddingTop: "56.25%",
        borderRadius: "12px",
        background: "var(--yt-bg-secondary)",
        marginBottom: "12px",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
    <div style={{ display: "flex", gap: "12px" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--yt-bg-secondary)", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: "14px", borderRadius: "4px", background: "var(--yt-bg-secondary)", marginBottom: "8px" }} />
        <div style={{ height: "12px", borderRadius: "4px", background: "var(--yt-bg-secondary)", width: "70%" }} />
      </div>
    </div>
    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
  </div>
);

const Videogrid = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get("/video/getall");
        setVideos(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px 8px",
          padding: "16px 24px",
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <VideoSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          color: "var(--yt-text-secondary)",
        }}
      >
        <svg width="88" height="88" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="2" y1="7" x2="7" y2="7" />
          <line x1="2" y1="17" x2="7" y2="17" />
          <line x1="17" y1="17" x2="22" y2="17" />
          <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginTop: "16px", color: "var(--yt-text-primary)" }}>
          No videos yet
        </h2>
        <p style={{ fontSize: "14px", marginTop: "8px" }}>
          Upload a video to get started
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "16px 8px",
        padding: "16px 24px",
      }}
    >
      {videos.map((video: any) => (
        <Videocard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default Videogrid;
