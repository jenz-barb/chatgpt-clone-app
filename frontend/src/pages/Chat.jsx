import React, { useState } from "react";
import axios from "axios";

function Chat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token")); // from login

  const sendMessage = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/chat",
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse(res.data.reply || JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
      setResponse("Error: " + (err.response?.data?.detail || "Something went wrong"));
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Chat Page</h1>
      <textarea
        className="border p-2 w-full max-w-md mb-2"
        rows="4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      ></textarea>
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
      {response && (
        <div className="mt-4 p-2 bg-white rounded shadow max-w-md w-full">
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default Chat;
