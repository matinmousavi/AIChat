"use client";

import { useState } from "react";
import { Message } from "@/app/page";

interface MessageBubbleProps {
  msg: Message;
  onUpdateMessage: (messageId: number, newText: string) => void;
}

const MessageBubble = ({ msg, onUpdateMessage }: MessageBubbleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(msg.text);

  const handleSave = () => {
    onUpdateMessage(msg.id, editText);
    setIsEditing(false);
  };

  const isUser = msg.sender === "user";

  return (
    <div
      className={`group flex items-center gap-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {isUser && (
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-gray-400 opacity-0 transition-opacity hover:text-white group-hover:opacity-100"
          aria-label="Edit message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
          </svg>
        </button>
      )}
      <div
        dir="auto"
        className={`max-w-xs rounded-2xl p-3 md:max-w-md ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-600 text-white"
        }`}
      >
        {isEditing ? (
          <div>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full rounded-md border-none bg-blue-700 p-2 text-white outline-none"
              rows={3}
            />
            <div className="mt-2 flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="rounded px-2 py-1 text-xs font-semibold text-gray-200 hover:bg-white/10"
              >
                لغو
              </button>
              <button
                onClick={handleSave}
                className="rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white hover:bg-emerald-700"
              >
                ذخیره
              </button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{msg.text}</p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
