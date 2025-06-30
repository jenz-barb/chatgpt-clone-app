import React, { useEffect, useState } from 'react';
import API from '../utils/api';

function Sidebar({ onSelectThread, selectedThreadId }) {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const fetchThreads = async () => {
      const res = await API.get('/chat/chat/threads');
      setThreads(res.data);
    };
    fetchThreads();
  }, []);

  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto h-screen">
      <h2 className="text-xl font-bold mb-4">Your Threads</h2>
      {threads.map((thread) => (
        <div
          key={thread.id}
          onClick={() => onSelectThread(thread.id)}
          className={`cursor-pointer p-2 rounded mb-2 ${
            selectedThreadId === thread.id ? 'bg-blue-200' : 'bg-white'
          }`}
        >
          {thread.title}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
