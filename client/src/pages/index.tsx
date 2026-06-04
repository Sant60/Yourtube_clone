import CategoryTabs from "@/components/category-tabs";
import Videogrid from "@/components/Videogrid";
import { Suspense } from "react";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--yt-bg)" }}>
      <CategoryTabs />
      <Suspense fallback={null}>
        <Videogrid />
      </Suspense>
    </div>
  );
}
