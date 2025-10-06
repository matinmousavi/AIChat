"use client";

import { ChatSession } from "@/app/page";

interface SidebarProps {
  sessions: ChatSession[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSwitchChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

const Sidebar = ({
  sessions,
  activeChatId,
  onNewChat,
  onSwitchChat,
  onDeleteChat,
}: SidebarProps) => {
  return (
    <div className="flex h-full w-64 flex-col bg-gray-800 p-2">
      <button
        onClick={onNewChat}
        className="mb-2 w-full rounded-lg bg-emerald-600 p-2 font-bold text-white hover:bg-emerald-700"
      >
        + New Chat
      </button>

      <div className="flex-grow overflow-y-auto pr-2">
        <h2 className="mb-2 px-2 text-sm font-semibold text-gray-400">
          Chat History
        </h2>
        <nav className="flex flex-col space-y-1">
          {sessions.map((chat) => (
            <div
              key={chat.id}
              className="group relative flex items-center justify-between rounded-md hover:bg-gray-700"
            >
              <button
                onClick={() => onSwitchChat(chat.id)}
                className={`w-full truncate p-2 text-left text-sm font-medium ${
                  chat.id === activeChatId ? "text-white" : "text-gray-300"
                }`}
              >
                {chat.title}
              </button>
              <button
                onClick={() => onDeleteChat(chat.id)}
                className="p-1 text-gray-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                aria-label="Delete chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75 1a1.25 1.25 0 0 0-1.25 1.25v.75H4.5a.75.75 0 0 0 0 1.5h11a.75.75 0 0 0 0-1.5h-3V2.25A1.25 1.25 0 0 0 11.25 1h-2.5ZM10 4.25a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-1.5 0v-8.5a.75.75 0 0 1 .75-.75ZM4.5 5.5a.75.75 0 0 0-.75.75v9a1.25 1.25 0 0 0 1.25 1.25h8.5A1.25 1.25 0 0 0 15 15.25v-9a.75.75 0 0 0-1.5 0v9a.25.25 0 0 1-.25.25h-8.5a.25.25 0 0 1-.25-.25v-9a.75.75 0 0 0-.75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
