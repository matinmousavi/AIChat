"use client";

import { useState } from "react";
import MessageInput from "@/components/MessageInput";

export type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

const GemChatPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "سلام رفیق! من یه دستیار هوشمندم.\n متین من رو ساخته تا بهت کمک کنم. 🚀",
      sender: "bot",
    },
  ]);

  const handleSendMessage = async (text: string) => {
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: text,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      const botResponse: Message = {
        id: Date.now(),
        text: data.message,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("خطا در ارتباط با API:", error);
      const errorResponse: Message = {
        id: Date.now(),
        text: "متاسفانه مشکلی پیش اومد. لطفاً دوباره تلاش کن.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                dir="auto"
                className={`max-w-xs md:max-w-md text-right whitespace-pre-wrap p-3 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-600 text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-600 p-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full my-custom-animation"></span>
                  <span
                    className="w-2.5 h-2.5 bg-gray-400 rounded-full my-custom-animation"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2.5 h-2.5 bg-gray-400 rounded-full my-custom-animation"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default GemChatPage;
