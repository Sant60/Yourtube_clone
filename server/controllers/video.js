import video from "../Modals/video.js";
import mongoose from "mongoose";

export const uploadvideo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a valid video file (mp4, webm, mov, avi)" });
  }
  try {
      const file = new video({
        videotitle:  req.body.videotitle,
        filename:    req.file.originalname,
        filepath:    `uploads/${req.file.filename}`,
        filetype:    req.file.mimetype,
        filesize:    String(req.file.size),
        videochanel: req.body.videochanel,
      uploader:    req.body.uploader,
    });
    await file.save();
    return res.status(201).json({ message: "File uploaded successfully", video: file });
  } catch (error) {
    console.error("uploadvideo error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getallvideo = async (req, res) => {
  try {
    const files = await video.find().sort({ createdAt: -1 });
    return res.status(200).json(files);
  } catch (error) {
    console.error("getallvideo error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getvideo = async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json({ message: "Invalid video id" });
  }
  try {
    const found = await video.findById(videoId);
    if (!found) return res.status(404).json({ message: "Video not found" });
    return res.status(200).json(found);
  } catch (error) {
    console.error("getvideo error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
