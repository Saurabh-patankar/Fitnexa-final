import { useEffect, useState } from "react";
import axios from "../utils/api";
import CommunityPost from "../components/CommunityPost";
import TrendingTags from "../components/TrendingTags";
import { Trash2, UserCircle2, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";
import CommentSection from "./CommentSection";
import EditPostModal from "../components/EditPostModal"; // ✅ Make sure this file exists

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts();
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/community?page=1"); // ✅ Explicitly fetch first page
      setPosts(res.data.posts || []);
      setPage(1); // ✅ Reset page for future "load more"
    } catch (err) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/community/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Post deleted");
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`/community/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchPosts();
    } catch (err) {
      toast.error("Failed to like");
    }
  };

  const loadMore = async () => {
    try {
      const res = await axios.get(`/community?page=${page + 1}`);
      if (res.data.posts.length === 0) return toast("No more posts!");
      setPosts((prev) => [...prev, ...res.data.posts]);
      setPage((prev) => prev + 1);
    } catch (err) {
      toast.error("Failed to load more");
    }
  };

  useEffect(() => {
    if (search.trim() === "") fetchPosts();
  }, [search]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/community/search?q=${search}`);
      setPosts(res.data.posts || []);
    } catch (err) {
      toast.error("Search failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6 neon-text drop-shadow-[0_0_10px_#e879f9]">
        💬 FitNexa Community
      </h1>

      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-full p-2 rounded bg-[#1a1a1d] text-white border border-pink-400 mb-4"
      />

      <div className="grid md:grid-cols-4 gap-6">
        {/* Feed + Post Input */}
        <div className="md:col-span-3 space-y-6">
          <CommunityPost onPostSuccess={fetchPosts} />

          {loading ? (
            <p className="text-gray-400">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-400">No posts yet</p>
          ) : (
            posts
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
             
              .map((post) => {
                const postUser = post.userId;
                const canDelete =
                  user?.role === "admin" || String(user?._id) === String(postUser?._id || postUser);
                const isLiked = post.likes?.some(
                  (id) =>
                    id === user?._id || (typeof id === "object" && id?._id === user?._id)
                );

                return (
                  <div
                    key={post._id}
                    className="bg-gradient-to-br from-[#18181b] to-[#111113] border border-pink-500/20 p-4 rounded-xl shadow-lg hover:shadow-pink-500/30 transition-all duration-200 relative"
                  >
                    {/* Header */}
                    <div className="flex items-center mb-3 gap-3">
                      {postUser?.profilePic ? (
                        <img
                          src={`http://localhost:5050/uploads/${postUser.profilePic}`}
                          alt="profile"
                          className="w-8 h-8 rounded-full object-cover border border-pink-400"
                        />
                      ) : (
                        <UserCircle2 className="text-pink-400" size={32} />
                      )}
                      <div>
                        <p
                          className="text-sm font-semibold text-pink-300 cursor-pointer hover:underline"
                          onClick={() =>
                            (window.location.href = `/profile/${postUser?._id || postUser}`)
                          }
                        >
                          {postUser?.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Caption */}
                    <p className="text-base mb-3">{post.caption}</p>

                    {/* Image */}
                    {post.imageUrl && (
                      <img
                        src={`http://localhost:5050/uploads/${post.imageUrl}`}
                        alt="post"
                        className="w-full max-w-lg rounded-md mb-4 hover:scale-[1.02] transition-transform duration-300 border border-purple-700/20"
                      />
                    )}

                    {/* Tags */}
                    {post.hashtags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-sm text-pink-400 mb-2">
                        {post.hashtags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-pink-900/30 px-3 py-1 rounded-full text-xs hover:bg-pink-700/30 transition"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* ❤️ Like + Profile */}
                    <div className="flex justify-between items-center text-sm text-pink-300 mb-2">
                      <button
                        onClick={() => handleLike(post._id)}
                        className="hover:text-pink-500"
                      >
                        {isLiked ? "❤️" : "🤍"} {post.likes?.length || 0}
                      </button>
                      <a href={`/profile/${postUser?._id || postUser}`} className="underline">
                        View Profile
                      </a>
                    </div>

                    {/* 🗑️ Delete & ✏️ Edit */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      {String(user?._id) === String(postUser?._id) && (
                        <button
                          onClick={() => setEditingPost(post)}
                          className="text-yellow-400 hover:text-yellow-600 text-sm"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-red-500 hover:text-red-700 text-sm flex items-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {/* 💬 Comments */}
                    <CommentSection postId={post._id} />
                  </div>
                );
              })
          )}

          {/* 🔄 Load More */}
          <div className="text-center mt-6">
            <button
              onClick={loadMore}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded text-white"
            >
              Load More Posts
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <TrendingTags posts={posts} />
        </div>
      </div>

      {/* ✏️ Edit Modal */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={async ({ caption, image }) => {
            try {
              const formData = new FormData();
              formData.append("caption", caption);
              if (image) formData.append("image", image);

              await axios.put(`/community/${editingPost._id}`, formData, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "multipart/form-data",
                },
              });

              toast.success("Post updated!");
              fetchPosts();
              setEditingPost(null);
            } catch (err) {
              toast.error("Update failed");
            }
          }}
        />
      )}
    </div>
  );
};

export default CommunityPage;