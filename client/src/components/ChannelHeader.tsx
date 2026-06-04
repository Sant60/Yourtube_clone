import React, { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const ChannelHeader = ({ channel, user }: any) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const channelColor = `hsl(${(channel?.channelname?.charCodeAt(0) || 0) * 20}, 60%, 45%)`;

  return (
    <div style={{ width: "100%" }}>
      {/* Banner */}
      <div
        style={{
          height: "180px",
          background: `linear-gradient(135deg, ${channelColor}, color-mix(in srgb, ${channelColor} 50%, #000))`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Channel info */}
      <div
        style={{
          padding: "24px",
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <Avatar style={{ width: "80px", height: "80px", flexShrink: 0, marginTop: "-16px" }}>
          <AvatarFallback
            style={{
              background: channelColor,
              color: "white",
              fontSize: "32px",
              fontWeight: 700,
              border: "3px solid var(--yt-bg)",
            }}
          >
            {channel?.channelname?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--yt-text-primary)", marginBottom: "4px" }}>
            {channel?.channelname}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--yt-text-secondary)", marginBottom: "4px" }}>
            @{channel?.channelname?.toLowerCase().replace(/\s+/g, "") || ""}
          </p>
          {channel?.description && (
            <p style={{ fontSize: "14px", color: "var(--yt-text-secondary)", maxWidth: "500px" }}>
              {channel.description}
            </p>
          )}
        </div>

        {user && user?._id !== channel?._id && (
          <button
            className={`yt-subscribe-btn ${isSubscribed ? "subscribed" : ""}`}
            onClick={() => setIsSubscribed((v) => !v)}
          >
            {isSubscribed ? "✓ Subscribed" : "Subscribe"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ChannelHeader;
