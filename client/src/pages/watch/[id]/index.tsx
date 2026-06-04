import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import VideoInfo from "@/components/VideoInfo";
import Videopplayer from "@/components/Videopplayer";
import axiosInstance from "@/lib/axiosinstance";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const WatchPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const fetchVideo = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/video/getall");
        const data: any[] = Array.isArray(res.data) ? res.data : [];
        const found = data.find((v) => v._id === id) ?? null;
        setCurrentVideo(found);
        setAllVideos(data.filter((v) => v._id !== id));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "24px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 402px", gap: "24px" }}>
          <div>
            <div style={{ paddingTop: "56.25%", borderRadius: "12px", background: "var(--yt-bg-secondary)", marginBottom: "16px" }} />
            <div style={{ height: "20px", background: "var(--yt-bg-secondary)", borderRadius: "4px", width: "70%", marginBottom: "12px" }} />
            <div style={{ height: "14px", background: "var(--yt-bg-secondary)", borderRadius: "4px", width: "40%" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ display: "flex", gap: "8px" }}>
                <div style={{ width: "168px", aspectRatio: "16/9", borderRadius: "8px", background: "var(--yt-bg-secondary)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: "12px", background: "var(--yt-bg-secondary)", borderRadius: "4px", marginBottom: "8px" }} />
                  <div style={{ height: "10px", background: "var(--yt-bg-secondary)", borderRadius: "4px", width: "60%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--yt-text-secondary)" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--yt-text-primary)", marginBottom: "8px" }}>
          Video not found
        </h2>
        <p>This video may have been removed or is unavailable.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1280px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 402px", gap: "24px" }}>
        <div>
          <Videopplayer video={currentVideo} />
          <VideoInfo video={currentVideo} />
          <Comments videoId={id as string} />
        </div>
        <div style={{ minWidth: 0 }}>
          <RelatedVideos videos={allVideos} />
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .watch-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default WatchPage;
