import React from "react";

export function parseTime(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
  const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function ChatBubble({
  content,
  selfFlag,
  timestamp,
  sender,
}) {
  const message = selfFlag ? "received-message" : "sent-message";
  return (
    <>
      <div className="time">{parseTime(timestamp)}</div>
      {sender && (
        <div className="userProfile" style={{ display: !selfFlag ? "none" : "block" }}>
          <img src={``} className="avatar"/>
          <div className="senderName">{sender.name}</div>
        </div>
      )}
      <div className={`message ${message}`}>{content}</div>
    </>
  );
}