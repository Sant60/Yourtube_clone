import { useState } from "react";

const categories = [
  "All", "Music", "Gaming", "Live", "Movies", "News",
  "Sports", "Technology", "Comedy", "Education", "Science",
  "Travel", "Food", "Fashion", "Auto",
];

export default function CategoryTabs() {
  const [active, setActive] = useState("All");

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "12px 24px",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        background: "var(--yt-bg)",
        position: "sticky",
        top: "56px",
        zIndex: 40,
      }}
    >
      <style>{`.cats::-webkit-scrollbar { display: none; }`}</style>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`yt-chip ${active === cat ? "active" : ""}`}
          onClick={() => setActive(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
