import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [threads, setThreads] = useState([]);
  const [currentThreadId, setCurrentThreadId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchThreads = async () => {
    try {
      const res = await axios.get("http://localhost:8000/threads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setThreads(res.data);
    } catch (err) {
      console.error("Failed to fetch threads", err);
    }
  };

  const fetchMessages = async (threadId) => {
    try {
      const res = await axios.get(`http://localhost:8000/messages/${threadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
      setCurrentThreadId(threadId);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "User", text: input }];
    setMessages(newMessages);

    try {
      const res = await axios.post(
        "http://localhost:8000/chat",
        {
          message: input,
          thread_id: currentThreadId, // null for new thread
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages([...newMessages, { sender: "AI", text: res.data.response }]);
      setInput("");
      if (!currentThreadId && res.data.thread_id) {
        setCurrentThreadId(res.data.thread_id);
        fetchThreads(); // refresh thread list
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { sender: "AI", text: "Something went wrong. Please try again." },
      ]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar for threads */}
      <div className="w-full md:w-1/4 bg-white p-4 shadow-md">
        <h2 className="text-lg font-bold mb-2">Chat Threads</h2>
        {threads.map((thread) => (
          <button
            key={thread.id}
            className={`block w-full text-left p-2 rounded ${
              thread.id === currentThreadId ? "bg-blue-200" : "hover:bg-gray-200"
            }`}
            onClick={() => fetchMessages(thread.id)}
          >
            {thread.title || `Thread ${thread.id}`}
          </button>
        ))}
        <button
          onClick={() => {
            setMessages([]);
            setCurrentThreadId(null);
          }}
          className="mt-4 text-sm text-blue-500 underline"
        >
          + New Thread
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-md ${
                msg.sender === "User" ? "bg-blue-100 text-left" : "bg-green-100 text-right"
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <textarea
            className="flex-1 border p-2 rounded"
            rows="2"
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="text-red-500 mt-4 underline self-start"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Chat;
