import React, { useState, useRef } from "react";
import { ChatBubble } from "./ChatBubble";
import "./App.css";

function App() {
  const [chats, setChats] = useState([]);
  const [textBoxValue, setTextBoxValue] = useState("");
  const [name, setName] = useState("Default Name");
  const [pfp, setPfp] = useState("Default Pfp");
  const wsRef = useRef(null);

  const initWs = () => {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket("");

        ws.onopen = () => {
          console.log("Connected to WebSocket");
          wsRef.current = ws;
          setChats((prevChats) => [
            ...prevChats,
            { content: "", timestamp: new Date().toISOString(), sendOut: false, isAccumulated: true }
          ]);
          resolve();
        };

        ws.onmessage = (event) => {
          console.log("Received message:", event.data);
          setChats((prevChats) => {
          return prevChats.map((chat, index) => {
            if (index === prevChats.length - 1 && chat.isAccumulated) {
              return {
                ...chat,
                content: `${chat.content}${chat.content ? "\n" : ""}${event.data}`,
              };
            }
            return chat;
          });
        });
              
        if (event.data === "") {
          if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
          }
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(error);
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
        wsRef.current = null;
      };

      wsRef.current = ws;
    });
  };

  const handleTextBoxChange = (event) => {
    setTextBoxValue(event.target.value);
  };

  const handleSendClick = async () => {
    const messageContent = textBoxValue.trim();
    if (!messageContent) return;

    const timestamp = new Date().getTime();

    const message = {
        content: messageContent,
        timestamp: timestamp,
        sender: "Default user",
    };

    setChats((prevChats) => [
        ...prevChats,
        { content: messageContent, timestamp, sendOut: true, isAccumulated: false }
    ]);

    if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
      try {
        await initWs();
      } catch (error) {
        console.error(error);
        return;
      }
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }

    setTextBoxValue("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendClick();
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <div className="chatArea">
        {chats.map((chat, index) => (
          <ChatBubble
            key={index}
            content={chat.content}
            selfFlag={!chat.sendOut}
            timestamp={chat.timestamp}
            sender={!chat.sendOut && !chat.sendOut ? { pfp: pfp, name: name } : undefined}
          />
        ))}
      </div>
      <div className="text-box-container chatInput">
        <input
          type="text"
          value={textBoxValue}
          className="chatInputBox"
          onChange={handleTextBoxChange}
          onKeyDown={handleKeyPress}
          placeholder="Type something..."
        />
        <div className="sendButton" onClick={handleSendClick}>Send</div>
      </div>
    </div>
  );
}

export default App
