import HistoryContent from "@/components/HistoryContent";
import { Suspense } from "react";

export default function HistoryPage() {
  return (
    <div style={{ padding: "24px 24px", maxWidth: "960px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "24px", color: "var(--yt-text-primary)" }}>
        Watch history
      </h1>
      <Suspense fallback={null}>
        <HistoryContent />
      </Suspense>
    </div>
  );
}
