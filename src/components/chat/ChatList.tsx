import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Message } from "../../types/message";
// import { FaUserCircle } from "react-icons/fa"; // Using react-icons for a simple user icon

// import "leaflet/dist/leaflet.css";

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

const ChatList = ({ messages, hasMore }: ChatList) => {
  const renderMessage = (message: Message) => {
    switch (message.type) {
      case "text":
        return <div className="message text">{message.content}</div>;
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
          <div
            className="message map"
            style={{ height: "200px", width: "100%" }}
          >
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[51.505, -0.09]}>
                <Popup>{message.content}</Popup>
              </Marker>
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
          <div key={message.id} className={`message-wrapper ${message.type}`}>
            <div className="message-avatar">
              {message.avatar ? (
                <img
                  src={message.avatar}
                  alt={`${message.sender}'s avatar`}
                  className="avatar"
                />
              ) : (
                <div className="avatar-icon">👤</div>
              )}
            </div>
            <div className="message-content">
              <div className="message-sender">{message.sender}</div>
              {renderMessage(message)}
              <div className="message-time">
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
