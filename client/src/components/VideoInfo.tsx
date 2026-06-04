import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Clock, Download, MoreHorizontal, Share,
  ThumbsDown, ThumbsUp, ChevronDown, ChevronUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import Link from "next/link";

const VideoInfo = ({ video }: any) => {
  const [likes, setLikes] = useState(video.Like || 0);
  const [dislikes, setDislikes] = useState(video.Dislike || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setLikes(video.Like || 0);
    setDislikes(video.Dislike || 0);
    setIsLiked(false);
    setIsDisliked(false);
  }, [video]);

  useEffect(() => {
    const trackView = async () => {
      try {
        if (user) {
          await axiosInstance.post(`/history/${video._id}`, { userId: user?._id });
        } else {
          await axiosInstance.post(`/history/views/${video?._id}`);
        }
      } catch (e) { /* ignore */ }
    };
    trackView();
  }, [user, video._id]);

  const handleLike = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.post(`/like/${video._id}`, { userId: user?._id });
      if (res.data.liked) {
        if (isLiked) { setLikes((p: number) => p - 1); setIsLiked(false); }
        else {
          setLikes((p: number) => p + 1); setIsLiked(true);
          if (isDisliked) { setDislikes((p: number) => p - 1); setIsDisliked(false); }
        }
      }
    } catch (e) { console.error(e); }
  };

  const handleDislike = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.post(`/like/${video._id}`, { userId: user?._id });
      if (!res.data.liked) {
        if (isDisliked) { setDislikes((p: number) => p - 1); setIsDisliked(false); }
        else {
          setDislikes((p: number) => p + 1); setIsDisliked(true);
          if (isLiked) { setLikes((p: number) => p - 1); setIsLiked(false); }
        }
      }
    } catch (e) { console.error(e); }
  };

  const handleWatchLater = async () => {
    try {
      const res = await axiosInstance.post(`/watch/${video._id}`, { userId: user?._id });
      if (res.data.watchlater) setIsWatchLater((v) => !v);
      else setIsWatchLater(false);
    } catch (e) { console.error(e); }
  };

  const formatViews = (n: number) => {
    if (!n) return "0";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
    return n.toString();
  };

  return (
    <div style={{ padding: "12px 0" }}>
      {/* Title */}
      <h1 style={{ fontSize: "20px", fontWeight: 600, lineHeight: 1.4, color: "var(--yt-text-primary)", marginBottom: "12px" }}>
        {video.videotitle}
      </h1>

      {/* Channel row + actions */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href={`/channel/${video.uploader}`} style={{ textDecoration: "none" }}>
            <Avatar style={{ width: "40px", height: "40px", cursor: "pointer" }}>
              <AvatarFallback
                style={{
                  background: `hsl(${(video.videochanel?.charCodeAt(0) || 0) * 20}, 60%, 45%)`,
                  color: "white",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {(video.videochanel?.[0] || "?").toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/channel/${video.uploader}`} style={{ textDecoration: "none" }}>
              <p style={{ fontSize: "15px", fontWeight: 500, color: "var(--yt-text-primary)" }}>{video.videochanel}</p>
            </Link>
            <p style={{ fontSize: "13px", color: "var(--yt-text-secondary)" }}>1.2M subscribers</p>
          </div>
          <button
            className={`yt-subscribe-btn ${isSubscribed ? "subscribed" : ""}`}
            onClick={() => setIsSubscribed((v) => !v)}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {/* Like/dislike */}
          <div style={{ display: "flex", borderRadius: "18px", overflow: "hidden" }}>
            <button
              className={`yt-like-btn ${isLiked ? "active" : ""}`}
              onClick={handleLike}
              style={!user ? { opacity: 0.6, cursor: "not-allowed" } : {}}
            >
              <ThumbsUp size={18} strokeWidth={isLiked ? 0 : 1.5} fill={isLiked ? "currentColor" : "none"} />
              {likes > 0 && <span>{formatViews(likes)}</span>}
            </button>
            <button
              className={`yt-dislike-btn ${isDisliked ? "active" : ""}`}
              onClick={handleDislike}
              style={!user ? { opacity: 0.6, cursor: "not-allowed" } : {}}
            >
              <ThumbsDown size={18} strokeWidth={isDisliked ? 0 : 1.5} fill={isDisliked ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Share */}
          <button className="yt-action-btn">
            <Share size={16} />
            Share
          </button>

          {/* Watch Later */}
          {user && (
            <button
              className={`yt-action-btn ${isWatchLater ? "active" : ""}`}
              onClick={handleWatchLater}
            >
              <Clock size={16} />
              {isWatchLater ? "Saved" : "Watch later"}
            </button>
          )}

          {/* Download */}
          <button className="yt-action-btn">
            <Download size={16} />
            Download
          </button>

          {/* More */}
          <button className="yt-icon-btn">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Description box */}
      <div
        style={{
          marginTop: "12px",
          background: "var(--yt-bg-secondary)",
          borderRadius: "12px",
          padding: "12px 16px",
          cursor: "pointer",
        }}
        onClick={() => setShowFullDesc((v) => !v)}
      >
        <div style={{ display: "flex", gap: "12px", fontSize: "14px", fontWeight: 500, marginBottom: "6px" }}>
          <span>{formatViews(video.views)} views</span>
          <span>{video.createdAt ? formatDistanceToNow(new Date(video.createdAt)) + " ago" : ""}</span>
        </div>
        <p
          style={{
            fontSize: "14px",
            color: "var(--yt-text-primary)",
            lineHeight: 1.6,
            display: showFullDesc ? "block" : "-webkit-box",
            WebkitLineClamp: showFullDesc ? undefined : 2,
            WebkitBoxOrient: "vertical",
            overflow: showFullDesc ? "visible" : "hidden",
          }}
        >
          {video.description || "No description provided for this video."}
        </p>
        <button
          style={{
            marginTop: "8px",
            fontSize: "14px",
            fontWeight: 600,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--yt-text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: 0,
          }}
        >
          {showFullDesc ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show more</>}
        </button>
      </div>
    </div>
  );
};

export default VideoInfo;
