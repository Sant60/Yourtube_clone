import React, { useState } from "react";

const tabs = [
  { id: "home", label: "Home" },
  { id: "videos", label: "Videos" },
  { id: "playlists", label: "Playlists" },
  { id: "community", label: "Community" },
  { id: "about", label: "About" },
];

const Channeltabs = () => {
  const [active, setActive] = useState("videos");

  return (
    <div
      style={{
        borderBottom: "1px solid var(--yt-border)",
        padding: "0 24px",
      }}
    >
      <div style={{ display: "flex", gap: "0", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: active === tab.id ? 600 : 400,
              color: active === tab.id ? "var(--yt-text-primary)" : "var(--yt-text-secondary)",
              background: "none",
              border: "none",
              borderBottom: active === tab.id ? "2px solid var(--yt-text-primary)" : "2px solid transparent",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "color 0.15s",
              letterSpacing: "0.01em",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Channeltabs;
