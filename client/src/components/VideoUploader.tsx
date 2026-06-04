import { Check, FileVideo, Upload, X, CloudUpload } from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { Progress } from "./ui/progress";
import axiosInstance from "@/lib/axiosinstance";

const VideoUploader = ({ channelId, channelName }: any) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [uploadComplete, setUploadComplete] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) { toast.error("Please upload a valid video file."); return; }
    if (file.size > 100 * 1024 * 1024) { toast.error("File size exceeds 100MB limit."); return; }
    setVideoFile(file);
    if (!videoTitle) setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) { toast.error("Please upload a valid video file."); return; }
      if (file.size > 100 * 1024 * 1024) { toast.error("File size exceeds 100MB limit."); return; }
      setVideoFile(file);
      if (!videoTitle) setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const resetForm = () => {
    setVideoFile(null);
    setVideoTitle("");
    setIsUploading(false);
    setUploadProgress(0);
    setUploadComplete(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!videoFile || !videoTitle.trim()) { toast.error("Please provide file and title"); return; }
    const formdata = new FormData();
    formdata.append("file", videoFile);
    formdata.append("videotitle", videoTitle);
    formdata.append("videochanel", channelName);
    formdata.append("uploader", channelId);
    try {
      setIsUploading(true);
      setUploadProgress(0);
      await axiosInstance.post("/video/upload", formdata, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e: any) => {
          setUploadProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      setUploadComplete(true);
      toast.success("Video uploaded successfully!");
      setTimeout(resetForm, 2000);
    } catch (e) {
      console.error(e);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      style={{
        background: "var(--yt-surface-alt)",
        borderRadius: "12px",
        padding: "24px",
        border: "1px solid var(--yt-border)",
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px", color: "var(--yt-text-primary)" }}>
        Upload video
      </h2>

      {!videoFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "var(--yt-blue)" : "var(--yt-border)"}`,
            borderRadius: "12px",
            padding: "48px 24px",
            textAlign: "center",
            cursor: "pointer",
            background: dragging ? "color-mix(in srgb, var(--yt-blue) 5%, transparent)" : "transparent",
            transition: "all 0.2s",
          }}
        >
          <CloudUpload
            size={48}
            style={{ margin: "0 auto 16px", color: dragging ? "var(--yt-blue)" : "var(--yt-text-secondary)" }}
          />
          <p style={{ fontSize: "16px", fontWeight: 500, color: "var(--yt-text-primary)", marginBottom: "8px" }}>
            Drag and drop video files to upload
          </p>
          <p style={{ fontSize: "14px", color: "var(--yt-text-secondary)", marginBottom: "16px" }}>
            Your videos will be private until you publish them.
          </p>
          <button
            style={{
              padding: "10px 24px",
              borderRadius: "4px",
              background: "var(--yt-blue)",
              color: "white",
              border: "none",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            SELECT FILE
          </button>
          <p style={{ fontSize: "12px", color: "var(--yt-text-tertiary)", marginTop: "16px" }}>
            MP4, WebM, MOV or AVI • Up to 100MB
          </p>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="video/*"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* File info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              background: "var(--yt-bg)",
              borderRadius: "8px",
              border: "1px solid var(--yt-border)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "color-mix(in srgb, var(--yt-blue) 15%, transparent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileVideo size={20} style={{ color: "var(--yt-blue)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--yt-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {videoFile.name}
              </p>
              <p style={{ fontSize: "13px", color: "var(--yt-text-secondary)" }}>
                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            {uploadComplete ? (
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#4caf50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={16} color="white" />
              </div>
            ) : (
              !isUploading && (
                <button className="yt-icon-btn" onClick={resetForm} style={{ width: "32px", height: "32px" }}>
                  <X size={16} />
                </button>
              )
            )}
          </div>

          {/* Title input */}
          <div>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--yt-text-primary)", display: "block", marginBottom: "6px" }}>
              Title (required)
            </label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Add a title that describes your video"
              disabled={isUploading || uploadComplete}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "14px",
                border: "1px solid var(--yt-border)",
                borderRadius: "4px",
                background: "var(--yt-bg)",
                color: "var(--yt-text-primary)",
                outline: "none",
                opacity: isUploading || uploadComplete ? 0.6 : 1,
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Progress */}
          {isUploading && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--yt-text-secondary)", marginBottom: "6px" }}>
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ height: "4px", background: "var(--yt-bg-secondary)", borderRadius: "2px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${uploadProgress}%`,
                    background: "var(--yt-blue)",
                    borderRadius: "2px",
                    transition: "width 0.2s",
                  }}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          {!uploadComplete && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                className="yt-action-btn"
                onClick={resetForm}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || !videoTitle.trim()}
                style={{
                  padding: "10px 20px",
                  borderRadius: "4px",
                  background: isUploading || !videoTitle.trim() ? "var(--yt-bg-secondary)" : "var(--yt-blue)",
                  color: isUploading || !videoTitle.trim() ? "var(--yt-text-tertiary)" : "white",
                  border: "none",
                  cursor: isUploading || !videoTitle.trim() ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
