import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "User", text: input }];

    try {
const res = await axios.post(
  "http://localhost:8000/chat/chat", // ✅ Correct FastAPI route
  { message: input },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages([...newMessages, { sender: "AI", text: res.data.response }]);
      setInput("");
    } catch (err) {
      setMessages([
        ...newMessages,
        { sender: "AI", text: "Something went wrong!" },
      ]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="bg-blue-600 text-white w-full max-w-2xl text-center p-4 rounded-t-lg">
        <h1 className="text-2xl font-semibold">Chat with AI</h1>
      </div>

      <div className="bg-white w-full max-w-2xl flex flex-col flex-grow p-4 rounded-b-lg shadow">
        <div className="overflow-y-auto flex-1 space-y-2 mb-4 max-h-[60vh]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-md ${
                msg.sender === "User"
                  ? "bg-blue-100 text-left"
                  : "bg-green-100 text-right"
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
          ></textarea>
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
