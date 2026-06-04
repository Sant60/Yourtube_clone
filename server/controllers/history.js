import video from "../Modals/video.js";
import history from "../Modals/history.js";
import mongoose from "mongoose";

export const handlehistory = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;
  if (!userId || !mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json({ message: "Invalid history request" });
  }
  try {
    await history.create({ viewer: userId, videoid: videoId });
    await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    return res.status(200).json({ history: true });
  } catch (error) {
    console.error("handlehistory error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// ← was missing res.json() — caused the request to hang forever
export const handleview = async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json({ message: "Invalid video id" });
  }
  try {
    await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    return res.status(200).json({ views: true });
  } catch (error) {
    console.error("handleview error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getallhistoryVideo = async (req, res) => {
  const { userId } = req.params;
  try {
    const historyvideo = await history
      .find({ viewer: userId })
      .populate({ path: "videoid", model: "videofiles" })
      .sort({ createdAt: -1 })
      .exec();
    return res.status(200).json(historyvideo);
  } catch (error) {
    console.error("getallhistoryVideo error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
