"use client";
import React, { useState } from "react";

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const MessageInput = ({ onSendMessage, isLoading }: MessageInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="p-4 bg-gray-900">
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <input
          dir="rtl"
          type="text"
          placeholder={
            isLoading ? "در حال پردازش..." : "پیام خود را بنویسید..."
          }
          className="flex-grow p-3 bg-gray-700 rounded-full focus:outline-none disabled:opacity-50 text-right" // This class was added
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none cursor-pointer"
          disabled={!input.trim()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-white"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
