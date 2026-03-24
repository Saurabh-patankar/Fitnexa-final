import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-hot-toast";

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Upcoming",
  });
  const [leaderboardMap, setLeaderboardMap] = useState({});
  const [expandedLeaderboard, setExpandedLeaderboard] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchChallenges = async () => {
    try {
      const res = await api.get("/challenges");
      setChallenges(res.data.challenges || []);
    } catch {
      toast.error("Failed to load challenges");
    }
  };

  const fetchLeaderboard = async (challengeId) => {
    if (expandedLeaderboard[challengeId]) {
      setExpandedLeaderboard((prev) => ({ ...prev, [challengeId]: false }));
      return;
    }

    try {
      const res = await api.get(`/challenges/leaderboard/${challengeId}`);
      setLeaderboardMap((prev) => ({ ...prev, [challengeId]: res.data.leaderboard }));
      setExpandedLeaderboard((prev) => ({ ...prev, [challengeId]: true }));
    } catch {
      toast.error("Could not load leaderboard");
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/challenges", formData);
      toast.success("Challenge created");
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "Upcoming",
      });
      fetchChallenges();
    } catch {
      toast.error("Creation failed");
    }
  };

  const handleJoin = async (id) => {
    try {
      await api.post(`/challenges/join/${id}`);
      toast.success("Joined successfully");
      fetchChallenges();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Join failed");
    }
  };

  const handleMarkComplete = async (id) => {
    try {
      await api.post(`/challenges/progress/${id}`);
      toast.success("Progress marked");
      fetchChallenges();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Mark failed");
    }
  };

  const alreadyJoined = (c) =>
    c.participants?.some((p) => p.user === user?._id || p.user?._id === user?._id);

  const getParticipant = (c) =>
    c.participants?.find((p) => p.user === user?._id || p.user?._id === user?._id);

  const getStreak = (c) => getParticipant(c)?.progress?.dates?.length || 0;

  const hasMarkedToday = (c) => {
    const today = new Date().toDateString();
    return getParticipant(c)?.progress?.dates?.some(
      (d) => new Date(d).toDateString() === today
    );
  };

  const getDaysBetween = (start, end) => {
    return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
  };

  const getDaysLeft = (end) => {
    return Math.max(0, getDaysBetween(new Date(), end));
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setFormData({
      title: c.title,
      description: c.description,
      startDate: c.startDate?.slice(0, 10),
      endDate: c.endDate?.slice(0, 10),
      status: c.status,
    });
  };

  const saveEdit = async () => {
    try {
      await api.put(`/challenges/${editingId}`, formData);
      toast.success("Challenge updated");
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "Upcoming",
      });
      fetchChallenges();
    } catch {
      toast.error("Update failed");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "Upcoming",
    });
  };

  const deleteChallenge = async (id) => {
    if (!window.confirm("Delete this challenge?")) return;
    try {
      await api.delete(`/challenges/${id}`);
      toast.success("Challenge deleted");
      fetchChallenges();
    } catch {
      toast.error("Delete failed");
    }
  };

  const statusBadge = (status) => {
    const base = "px-2 py-0.5 text-xs rounded-full font-semibold";
    const color =
      status === "Upcoming"
        ? "bg-yellow-600 text-white"
        : status === "Ongoing"
        ? "bg-green-600 text-white"
        : "bg-gray-600 text-white";
    return <span className={`${base} ${color}`}>{status}</span>;
  };

  const streakBar = (c) => {
    const totalDays = getDaysBetween(c.startDate, c.endDate);
    const streak = getStreak(c);
    const percent = totalDays ? Math.min(100, (streak / totalDays) * 100) : 0;
    return (
      <div className="mt-2">
        <div className="text-sm text-gray-400 mb-1">🔥 Streak Progress</div>
        <div className="w-full bg-zinc-700 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs mt-1 text-gray-300">
          {streak} / {totalDays} days completed | ⏳ {getDaysLeft(c.endDate)} days left
        </p>
      </div>
    );
  };

  return (
    <div className="text-white p-6 min-h-screen bg-black">
      <h2 className="text-2xl font-bold mb-4">🏆 Community Challenges</h2>

      {(user?.role === "admin" || user?.role === "trainer") && !editingId && (
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-4 bg-zinc-900 p-4 rounded mb-6"
        >
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-zinc-800 p-2 rounded text-white"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-zinc-800 p-2 rounded text-white"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="bg-zinc-800 p-2 rounded text-white"
              required
            />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="bg-zinc-800 p-2 rounded text-white"
              required
            />
          </div>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="bg-zinc-800 p-2 rounded text-white"
          >
            <option>Upcoming</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>
          <button
            type="submit"
            className="col-span-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
          >
            ➕ Create Challenge
          </button>
        </form>
      )}

      <div className="space-y-6">
        {challenges.map((c) => (
          <div key={c._id} className="bg-zinc-800 p-4 rounded">
            {editingId === c._id ? (
              <>
                {/* Edit UI */}
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-zinc-700 p-2 rounded w-full mb-2"
                />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-zinc-700 p-2 rounded w-full mb-2"
                />
                <div className="flex gap-2 mb-2">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="bg-zinc-700 p-2 rounded w-full"
                  />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="bg-zinc-700 p-2 rounded w-full"
                  />
                </div>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="bg-zinc-700 p-2 rounded w-full mb-2"
                >
                  <option>Upcoming</option>
                  <option>Ongoing</option>
                  <option>Completed</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="bg-green-600 px-3 py-1 rounded">Save</button>
                  <button onClick={cancelEdit} className="bg-gray-600 px-3 py-1 rounded">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  {statusBadge(c.status)}
                </div>
                <p>{c.description}</p>
                <p className="text-sm text-gray-400">
                  {c.startDate?.slice(0, 10)} → {c.endDate?.slice(0, 10)}
                </p>

                {/* Member-only options */}
                {user?.role === "member" && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {!alreadyJoined(c) ? (
                      <button
                        onClick={() => handleJoin(c._id)}
                        className="bg-blue-600 px-4 py-1 rounded"
                      >
                        Join Challenge
                      </button>
                    ) : (
                      <>
                        <span className="text-green-400 font-semibold">
                          ✅ Joined | 🔥 {getStreak(c)} day streak
                        </span>
                        <button
                          onClick={() => handleMarkComplete(c._id)}
                          disabled={hasMarkedToday(c)}
                          className={`${
                            hasMarkedToday(c)
                              ? "bg-gray-500 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          } px-4 py-1 rounded`}
                        >
                          {hasMarkedToday(c) ? "Already Marked Today" : "Mark Today as Complete"}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {streakBar(c)}

                <div className="mt-3 flex gap-2 flex-wrap">
                  <button
                    onClick={() => fetchLeaderboard(c._id)}
                    className="bg-yellow-600 px-4 py-1 rounded"
                  >
                    {expandedLeaderboard[c._id] ? "Hide Leaderboard" : "View Leaderboard"}
                  </button>

                  {(user?.role === "admin" || user?.role === "trainer") && (
                    <>
                      <button
                        onClick={() => startEdit(c)}
                        className="bg-blue-600 px-4 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteChallenge(c._id)}
                        className="bg-red-600 px-4 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {expandedLeaderboard[c._id] && leaderboardMap[c._id] && (
              <div className="mt-4 bg-zinc-900 p-3 rounded">
                <h4 className="font-semibold mb-2">🏅 Leaderboard</h4>
                {leaderboardMap[c._id].length === 0 ? (
                  <p>No entries yet</p>
                ) : (
                  <ul className="text-sm space-y-1">
                    {leaderboardMap[c._id].map((p, i) => (
                      <li key={i}>
                        {i + 1}. {p.name} — 🔥 {p.streak} day{p.streak > 1 ? "s" : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengesPage;