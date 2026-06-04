import React, { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { ThumbsUp, MoreVertical } from "lucide-react";

interface Comment {
  _id: string;
  videoid: string;
  userid: string;
  commentbody: string;
  usercommented: string;
  commentedon: string;
}

const Comments = ({ videoId }: any) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const loadComments = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/comment/${videoId}`);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [videoId]);

  useEffect(() => {
    if (!videoId) {
      setComments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    loadComments();
  }, [videoId, loadComments]);

  const handleSubmit = async () => {
    if (!user || !newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/comment/postcomment", {
        videoid: videoId,
        userid: user._id,
        commentbody: newComment,
        usercommented: user.name,
      });
      if (res.data.comment) {
        const createdComment = res.data.data ?? {
          _id: Date.now().toString(),
          videoid: videoId,
          userid: user._id,
          commentbody: newComment,
          usercommented: user.name || "Anonymous",
          commentedon: new Date().toISOString(),
        };
        setComments((prev) => [createdComment, ...prev]);
        setNewComment("");
        setFocused(false);
      }
    } catch (e) { console.error(e); }
    finally { setIsSubmitting(false); }
  };

  const handleUpdate = async () => {
    if (!editText.trim()) return;
    try {
      const res = await axiosInstance.patch(`/comment/editcomment/${editingId}`, { commentbody: editText });
      if (res.data) {
        setComments((prev) =>
          prev.map((c) => c._id === editingId ? { ...c, commentbody: res.data.commentbody ?? editText } : c)
        );
        setEditingId(null);
        setEditText("");
      }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/comment/deletecomment/${id}`);
      if (res.data.comment) setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div style={{ padding: "24px 0" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--yt-bg-secondary)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: "12px", borderRadius: "4px", background: "var(--yt-bg-secondary)", width: "30%", marginBottom: "8px" }} />
              <div style={{ height: "12px", borderRadius: "4px", background: "var(--yt-bg-secondary)", width: "80%" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "24px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "24px", color: "var(--yt-text-primary)" }}>
        {comments.length.toLocaleString()} Comments
      </h2>

      {/* New comment input */}
      {user && (
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <Avatar style={{ width: "40px", height: "40px", flexShrink: 0 }}>
            <AvatarImage src={user.image || ""} />
            <AvatarFallback style={{ background: "#065fd4", color: "white" }}>
              {user.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setFocused(true)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${focused ? "var(--yt-text-primary)" : "var(--yt-border)"}`,
                outline: "none",
                fontSize: "14px",
                padding: "4px 0",
                color: "var(--yt-text-primary)",
                transition: "border-color 0.15s",
              }}
            />
            {(focused || newComment) && (
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                <button
                  className="yt-action-btn"
                  onClick={() => { setNewComment(""); setFocused(false); }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    padding: "8px 16px",
                    borderRadius: "18px",
                    background: newComment.trim() ? "var(--yt-blue)" : "var(--yt-bg-secondary)",
                    color: newComment.trim() ? "white" : "var(--yt-text-tertiary)",
                    border: "none",
                    cursor: newComment.trim() ? "pointer" : "not-allowed",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                  onClick={handleSubmit}
                  disabled={!newComment.trim() || isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Comment"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comment list */}
      <div>
        {comments.length === 0 ? (
          <p style={{ fontSize: "14px", color: "var(--yt-text-secondary)", textAlign: "center", padding: "24px 0" }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
              <Avatar style={{ width: "40px", height: "40px", flexShrink: 0 }}>
                <AvatarFallback
                  style={{
                    background: `hsl(${(comment.usercommented?.charCodeAt(0) || 0) * 30}, 60%, 45%)`,
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {comment.usercommented?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--yt-text-primary)" }}>
                    {comment.usercommented}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--yt-text-secondary)" }}>
                    {formatDistanceToNow(new Date(comment.commentedon))} ago
                  </span>
                </div>

                {editingId === comment._id ? (
                  <div>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      style={{
                        width: "100%",
                        background: "none",
                        border: "none",
                        borderBottom: "2px solid var(--yt-text-primary)",
                        outline: "none",
                        fontSize: "14px",
                        padding: "4px 0",
                        color: "var(--yt-text-primary)",
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                      <button className="yt-action-btn" onClick={() => { setEditingId(null); setEditText(""); }}>Cancel</button>
                      <button
                        style={{
                          padding: "8px 16px",
                          borderRadius: "18px",
                          background: "var(--yt-blue)",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                        onClick={handleUpdate}
                        disabled={!editText.trim()}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: "14px", color: "var(--yt-text-primary)", lineHeight: 1.5 }}>
                      {comment.commentbody}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                      <button className="yt-icon-btn" style={{ width: "32px", height: "32px" }}>
                        <ThumbsUp size={14} />
                      </button>
                      <button className="yt-icon-btn" style={{ width: "32px", height: "32px" }}>
                        <ThumbsUp size={14} style={{ transform: "scaleY(-1)" }} />
                      </button>
                      <button
                        style={{ fontSize: "13px", fontWeight: 600, background: "none", border: "none", cursor: "pointer", color: "var(--yt-text-primary)", padding: "4px 8px", borderRadius: "18px" }}
                      >
                        Reply
                      </button>
                      {comment.userid === user?._id && (
                        <>
                          <button
                            style={{ fontSize: "13px", color: "var(--yt-text-secondary)", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                            onClick={() => { setEditingId(comment._id); setEditText(comment.commentbody); }}
                          >
                            Edit
                          </button>
                          <button
                            style={{ fontSize: "13px", color: "var(--yt-text-secondary)", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                            onClick={() => handleDelete(comment._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
