import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Message } from "../../types/message";
import "@fontsource-variable/inter";
import "../../styles/global.css";
import HoverDropdown from "./components/HoverDropdown";
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
  const renderMessage = (message: Message) => {
    // Mock ups
    if (message.content === "geojson") {
      message.type = "map";
    }

    switch (message.type) {
      case "text":
        const files =
          message.files.length > 0 ? (
            <FilePreview files={message.files} />
          ) : null;
        return (
          <div className="flex flex-col gap-2">
            <div className="message-content bg-gray-100 rounded-md flex w-fit py-2 px-3">
              {message.content}
            </div>
            <div className="message-files absolute top-0 right-10">{files}</div>
          </div>
        );
      case "image":
        return (
          <img
            src={message.content}
            alt="Chat media"
            className="message image"
          />
        );
      case "audio":
        return (
          <audio src={message.content} controls className="message audio" />
        );
      case "canvas":
        return (
          <canvas
            className="message canvas"
            ref={(el) => {
              if (el) {
                const ctx = el.getContext("2d");
                if (ctx) {
                  // Example: Draw something simple
                  ctx.fillStyle = "lightblue";
                  ctx.fillRect(0, 0, el.width, el.height);
                  ctx.fillStyle = "black";
                  ctx.fillText("Canvas Content", 10, 20);
                }
              }
            }}
            width={200}
            height={100}
          />
        );
      case "map":
        return (
          <div className="border-s-black border-2 message-map relative w-64 h-64 overflow-hidden">
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              style={{ height: 256, width: 256 }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </MapContainer>
          </div>
        );
      default:
        return <div>Unsupported message type</div>;
    }
  };

  const endMessage = (
    <div className="w-full flex justify-center">
      <p>No more messages</p>
    </div>
  );

  return (
    <div className="chat-list-container w- full pb-4 flex flex-col">
      <InfiniteScroll
        dataLength={messages.length}
        next={false}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={false ? endMessage : null}
      >
        {messages.map((message) => (
          <div key={message.id} className={` message-wrapper ${message.type}`}>
            <div className="message-avatar mt-2 w-[40px]">
              {message.avatar ? (
                <div className="avatar-icon">👤</div>
              ) : (
                <div className="avatar-icon">👤</div>
              )}
            </div>
            <div className="message-content relative">
              <div className="message-sender">{message.sender}</div>
              {renderMessage(message)}
              <div className="message-time absolute bottom-0 right-0">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ChatList;
