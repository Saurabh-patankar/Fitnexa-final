import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../utils/api";
import { ImagePlus } from "lucide-react";
// import ReelUpload from "../components/ReelUpload";
// import ReelViewer from "../components/ReelViewer";

const CommunityPost = ({ onPostSuccess }) => {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!caption.trim()) return toast.error("Caption is required");

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("hashtags", hashtags);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      await axios.post("/community", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Post uploaded!");
      setCaption("");
      setHashtags("");
      setImage(null);
      setPreview(null);
      onPostSuccess();
    } catch (err) {
      toast.error("Failed to post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handlePost}
      className="bg-gradient-to-br from-[#19191c] to-[#0f0f10] border border-purple-600/20 p-4 rounded-xl shadow-md shadow-purple-700/10"
    >
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="What's happening in your fitness world?"
        className="w-full bg-black text-white border border-purple-500/20 p-3 rounded mb-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
        rows={3}
      />

      <input
        type="text"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
        placeholder="#hashtags (comma separated)"
        className="w-full bg-black text-white border border-purple-500/20 p-2 rounded mb-3 text-sm"
      />

      <label className="flex items-center gap-2 text-gray-300 cursor-pointer mb-3">
        <ImagePlus size={18} />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
          className="hidden"
        />
        Upload Image
      </label>

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="max-w-xs rounded shadow-md mb-3 border border-pink-500/20"
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-md hover:opacity-90 transition-all text-sm"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default CommunityPost;