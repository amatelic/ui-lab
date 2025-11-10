import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Message } from "../../types/message";
import "@fontsource-variable/inter";
import "../../styles/global.css";
import HoverDropdown from "./components/HoverDropdown";
import { ChatSwitch } from "./components/ChatSwitch";
import LoadingDots from "./components/Dots";
// import UserProfile from "@/assets/user.svg";

interface ChatListProps {
  initialMessages: Message[];
  fetchMore: () => Promise<Message[]>;
  hasMore: boolean;
}

interface ChatList {
  messages: Message[];
  fetchMore: any;
  hasMore: boolean;
}

function FilePreview({ files }: { files: File[] }) {
  return (
    <HoverDropdown triggerContent={<DocumentIcon />}>
      {files.map((file, index) => (
        <div
          className="bg-gray-100 rounded-md w-12 h-10 py-2 px-2 flex justify-center w-max-[200px]"
          key={index}
          href={null}
          target="_blank"
          rel="noopener noreferrer"
        >
          <DocumentIcon />
        </div>
      ))}
    </HoverDropdown>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
        fill="#E0E0E0"
      />
      <path d="M14 2V8H20L14 2Z" fill="#BDBDBD" />
      <rect x="7" y="10" width="10" height="1" fill="#757575" />
      <rect x="7" y="13" width="7" height="1" fill="#757575" />
      <rect x="7" y="16" width="8" height="1" fill="#757575" />
    </svg>
  );
}

const ChatList = ({ messages, hasMore }: ChatList) => {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const endMessage = (
    <div className="w-full flex justify-center">
      <p>No more messages</p>
    </div>
  );

  return (
    <div ref={listRef} className="chat-list-container full pb-4 flex flex-col">
      <InfiniteScroll
        dataLength={messages.length}
        next={false}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={false ? endMessage : null}
      >
        {messages.map((message) => {
          const contentClasses = [`message-wrapper ${message.type}`];
          const isAssistant = message.role === "assistant";
          if (isAssistant) {
            contentClasses.push("flex-row-reverse");
          }
          return (
            <div key={message.id} className={contentClasses.join(" ")}>
              <div
                className={`message-avatar ${isAssistant ? "!ml-2" : "!mr-2"} w-[40px]`}
              >
                {message.avatar ? (
                  <div className="avatar-icon">👤</div>
                ) : (
                  <div className="avatar-icon">👤</div>
                )}
              </div>
              <div className="message-content relative">
                <div className="message-sender">{message.sender}</div>
                <ChatSwitch
                  direction={isAssistant ? "right" : "left"}
                  message={message}
                />
                <div
                  className={`message-time absolute bottom-0 ${isAssistant ? "left-0" : "right-0"}`}
                >
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default ChatList;
