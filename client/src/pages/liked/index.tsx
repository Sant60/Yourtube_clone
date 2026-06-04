import LikedContent from "@/components/LikedContent";
import { Suspense } from "react";

export default function LikedPage() {
  return (
    <div style={{ padding: "24px 24px", maxWidth: "960px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "24px", color: "var(--yt-text-primary)" }}>
        Liked videos
      </h1>
      <Suspense fallback={null}>
        <LikedContent />
      </Suspense>
    </div>
  );
}
