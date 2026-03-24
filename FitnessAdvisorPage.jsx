import React, { useEffect, useRef, useState } from "react";
import axios from "../utils/api";
import { Bot, User, Trash2, Mic, Globe } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const FitnessAdvisorPage = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en-IN");
const [autoSend, setAutoSend] = useState(false);
const [showLangDropdown, setShowLangDropdown] = useState(false);
  const chatEndRef = useRef();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript && !listening) {
      if (autoSend) {
        setQuery(transcript);
        setTimeout(() => handleAsk(), 100); // Auto send
      } else {
        setQuery(transcript);
      }
    }
  }, [transcript, listening]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    try {
      const res = await axios.get("/chat");
      setMessages(res.data.messages);
    } catch {
      console.warn("Failed to load chat history");
    }
  };

  const saveMessage = async (role, content) => {
    try {
      await axios.post("/chat", { role, content });
    } catch {
      console.warn("Failed to save message");
    }
  };

  const handleAsk = async () => {
    if (!query.trim()) return;

    const userMessage = {
      role: "user",
      content: query,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    saveMessage("user", query);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post("/ai/advice", {
        message: `${query}\n\nPlease reply in: ${language}`,
      });

      const aiMessage = {
        role: "assistant",
        content: res.data.reply,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      saveMessage("assistant", res.data.reply);
    } catch {
      const errorMsg = {
        role: "assistant",
        content: "⚠️ Failed to fetch advice. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this message?")) return;
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearChat = async () => {
    if (!window.confirm("Clear entire chat?")) return;
    try {
      await axios.delete("/chat");
      setMessages([]);
      toast.success("Chat cleared");
    } catch {
      toast.error("Failed to clear chat");
    }
  };

  const handleQuickPrompt = async (promptText) => {
    if (!promptText) return;
    setQuery(promptText);

    const userMessage = {
      role: "user",
      content: promptText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    saveMessage("user", promptText);
    setLoading(true);

    try {
      const res = await axios.post("/ai/advice", {
        message: `${promptText}\n\nPlease reply in: ${language}`,
      });

      const aiMessage = {
        role: "assistant",
        content: res.data.reply,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      saveMessage("assistant", res.data.reply);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Failed to fetch advice. Try again later.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser does not support voice input.");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      toast.success("🎤 Mic stopped");
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: false,
        language,
      });
      new Audio("/beep.mp3").play().catch(() => {});
    }
  };

  const addReaction = (index, emoji) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, reaction: emoji } : msg
      )
    );
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";
  
    return (
      <div
        key={index}
        className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4 w-full`}
      >
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}>
          {!isUser && <Bot className="mt-1 mr-2 text-blue-400 w-5 h-5" />}
          
          <div
  className={`relative px-4 py-2 rounded-lg text-sm ${
    isUser
      ? "bg-[#0f172a] text-cyan-300 border border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)] rounded-tr-none"
      : "bg-[#1e1b2e] text-purple-300 border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)] rounded-tl-none"
  }`}
  style={{ maxWidth: "75%" }}
>
            <div className="whitespace-pre-wrap break-words">{msg.content}</div>
            <span className="block mt-1 text-xs text-gray-400 text-right">
              {format(new Date(msg.createdAt), "hh:mm a")}
            </span>
  
            {!isUser && (
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-0 right-0 p-1 text-xs text-gray-300 hover:text-red-400"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
  
          {isUser && <User className="mt-1 ml-2 text-white w-5 h-5" />}
        </div>
  
        {/* 🎉 Emoji Reactions for AI only */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-1 ml-8">
            {msg.reaction && <span className="text-xl">{msg.reaction}</span>}
            {!msg.reaction && (
              <div className="flex gap-1">
                {["❤️", "🔥", "💪", "👍"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addReaction(index, emoji)}
                    className="hover:scale-110 transition text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black overflow-hidden">
     <div className="w-full max-w-md h-[92vh] bg-black text-white flex flex-col p-4 rounded-lg border border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.5)]">
       
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">🤖 AI Fitness Advisor</h2>
          <div className="flex items-center gap-3">
            {/* 🌍 Language Selector */}
            <div className="flex items-center gap-3">
  {/* 🌍 Language Selector */}
  <div className="relative">
    <button
      onClick={() => setShowLangDropdown(!showLangDropdown)}
      className="p-1"
    >
      <Globe className="w-5 h-5 cursor-pointer" />
    </button>
    {showLangDropdown && (
      <select
        value={language}
        onChange={(e) => {
          setLanguage(e.target.value);
          setShowLangDropdown(false);
        }}
        className="absolute z-20 top-8 right-0 bg-zinc-800 text-white text-sm rounded px-2 py-1"
      >
        <option value="en-IN">🇮🇳 English</option>
        <option value="hi-IN">🇮🇳 Hindi</option>
        <option value="mr-IN">🇮🇳 Marathi</option>
        <option value="ta-IN">🇮🇳 Tamil</option>
        <option value="es-ES">🇪🇸 Spanish</option>
      </select>
    )}
  </div>

  {/* 🎤 Auto-send toggle */}
  <label className="text-xs flex items-center gap-1">
    <input
      type="checkbox"
      checked={autoSend}
      onChange={(e) => setAutoSend(e.target.checked)}
    />
    Auto-send
  </label>

  {/* 🧹 Clear button */}
  <button
  onClick={handleClearChat}
  className="bg-[#1e293b] text-cyan-400 border border-cyan-600 px-3 py-1 rounded hover:bg-cyan-600 hover:text-white transition-all duration-200 shadow-md shadow-cyan-500/20 text-sm font-semibold">
  🧹 Clear Chat
</button>
</div>
</div>

        </div>

        {/* Chat Box */}
        <div className="flex-1 overflow-y-auto pr-2">
          {messages.map((msg, index) => renderMessage(msg, index))}
          {loading && (
            <div className="flex items-center text-sm text-gray-400 mb-4">
              <Bot className="mr-2 text-blue-400 w-4 h-4" />
              <em>Typing...</em>
<span className="animate-pulse text-cyan-400 ml-2">●</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input + Suggestions */}
        <div className="mt-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask anything fitness..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-zinc-900 text-white px-4 py-2 rounded focus:outline-none"
            />
            <button
              onClick={handleAsk}
              disabled={loading}
              className="bg-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-700"
            >
              Ask
            </button>
            <button
              onClick={toggleMic}
              className={`p-2 rounded ${
                listening
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <Mic className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {[
              {
                label: "🏋️ Suggest Workout",
                prompt: "Suggest a workout based on my fitness goal",
              },
              {
                label: "🥗 Best Diet Today",
                prompt: "What should I eat today for a balanced diet?",
              },
              {
                label: "😴 Recovery Tip",
                prompt: "How should I recover after intense training?",
              },
            ].map(({ label, prompt }) => (
              <button
                key={label}
                onClick={() => handleQuickPrompt(prompt)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessAdvisorPage;