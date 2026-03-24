import { useEffect, useState } from "react";
import axios from "../utils/api";
import { Send } from "lucide-react";
import { toast } from "react-hot-toast";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/community/${postId}/comments`);
      setComments(res.data.comments || []);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await axios.post(
        `/community/${postId}/comments`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setText("");
      fetchComments();
    } catch {
      toast.error("Failed to post comment");
    }
  };

  return (
    <div className="mt-4 bg-[#151517] p-4 rounded-lg border border-purple-700/30">
      <h4 className="text-pink-400 font-semibold mb-2">💬 Comments</h4>

      {loading ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
          {comments.map((c, idx) => (
            <div key={idx} className="bg-[#1f1f22] p-2 rounded text-sm">
              <p className="text-gray-300">{c.text}</p>
              <p className="text-gray-500 text-xs mt-1">
                — {c.userId?.name || "Anonymous"}
              </p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleComment} className="flex items-center gap-2 mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 rounded bg-black text-white border border-purple-500/20 text-sm focus:outline-none"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 p-2 rounded text-white"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default CommentSection;