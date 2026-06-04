import WatchLaterContent from "@/components/WatchLaterContent";
import { Suspense } from "react";

export default function WatchLaterPage() {
  return (
    <div style={{ padding: "24px 24px", maxWidth: "960px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "24px", color: "var(--yt-text-primary)" }}>
        Watch later
      </h1>
      <Suspense fallback={null}>
        <WatchLaterContent />
      </Suspense>
    </div>
  );
}
