import ChannelHeader from "@/components/ChannelHeader";
import Channeltabs from "@/components/Channeltabs";
import ChannelVideos from "@/components/ChannelVideos";
import VideoUploader from "@/components/VideoUploader";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ChannelPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchChannelVideos = async () => {
      try {
        const res = await axiosInstance.get("/video/getall");
        const data: any[] = Array.isArray(res.data) ? res.data : [];
        setVideos(data.filter((v: any) => v.uploader === id));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchChannelVideos();
  }, [id]);

  const channel = user?._id === id ? user : { channelname: "Channel", _id: id };

  return (
    <div style={{ background: "var(--yt-bg)", minHeight: "100vh" }}>
      <ChannelHeader channel={channel} user={user} />
      <Channeltabs />
      <div style={{ padding: "24px" }}>
        {user && user._id === id && (
          <div style={{ marginBottom: "32px", maxWidth: "640px" }}>
            <VideoUploader channelId={id as string} channelName={(channel as any)?.channelname} />
          </div>
        )}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
            {[1,2,3,4].map(i => (
              <div key={i}>
                <div style={{ paddingTop: "56.25%", borderRadius: "12px", background: "var(--yt-bg-secondary)", marginBottom: "12px" }} />
                <div style={{ height: "14px", background: "var(--yt-bg-secondary)", borderRadius: "4px", marginBottom: "8px" }} />
                <div style={{ height: "12px", background: "var(--yt-bg-secondary)", borderRadius: "4px", width: "60%" }} />
              </div>
            ))}
          </div>
        ) : (
          <ChannelVideos videos={videos} />
        )}
      </div>
    </div>
  );
};

export default ChannelPage;
