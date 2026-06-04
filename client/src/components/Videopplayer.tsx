import { useRef } from "react";
import { getBackendAssetUrl } from "@/lib/backend";

interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
  };
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        background: "#000",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        style={{ width: "100%", height: "100%", display: "block" }}
        controls
        autoPlay={false}
      >
        <source src={getBackendAssetUrl(video?.filepath)} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
