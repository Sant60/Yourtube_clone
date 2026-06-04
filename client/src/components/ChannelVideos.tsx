import VideoCard from "./videocard";

export default function ChannelVideos({ videos }: any) {
  if (!videos || videos.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "64px 24px", color: "var(--yt-text-secondary)" }}>
        <p style={{ fontSize: "16px", fontWeight: 500, color: "var(--yt-text-primary)", marginBottom: "8px" }}>
          No videos yet
        </p>
        <p style={{ fontSize: "14px" }}>Upload a video to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "16px 8px",
        }}
      >
        {videos.map((video: any) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}
