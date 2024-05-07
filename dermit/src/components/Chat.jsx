import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHotkeys } from "react-hotkeys-hook";

import { AuthContext } from "../contexts/AuthContext";
import { Message } from "./Message";
import ChatLoader from "./ChatLoader";

export default function Chat() {
  const { conversationId } = useParams();
  const { user } = useContext(AuthContext);
  const [conversation, setConversation] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);

  const { readyState, sendJsonMessage } = useWebSocket(
    user ? `ws://127.0.0.1:8000/chats/${conversationId}/` : null,
    {
      queryParams: {
        token: user ? user.token : "",
      },
      onOpen: () => {
        console.log("Connected!");
      },
      onClose: () => {
        console.log("Disconnected!");
      },
      // onMessage handler
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "chat_message_echo":
            setMessageHistory((prev) => [data.message, ...prev]);
            break;
          default:
            console.error("Unknown message type!");
            break;
        }
      },
    }
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    if (connectionStatus === "Open") {
      sendJsonMessage({
        type: "",
      });
    }
  }, [connectionStatus, sendJsonMessage]);
  async function fetchMessages() {
    const apiRes = await fetch(
        `http://127.0.0.1:8000/api/messages/?conversation=${conversationId}&page=${page}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${user.token}`,
          },
        }
      );
      if (apiRes.status === 200) {
        const data = await apiRes.json();
        setHasMoreMessages(data.next !== null);
        setPage(page + 1);
        setMessageHistory((prev) => prev.concat(data.results));
      }
    }
  
  useEffect(() => {
    async function fetchConversation() {
      const apiRes = await fetch(
        `http://127.0.0.1:8000/api/conversations/${conversationId}/`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${user?.token}`,
          },
        }
      );
      if (apiRes.status === 200) {
        const data = await apiRes.json();
        setConversation(data);
      }
    }
    fetchConversation();
    fetchMessages();
  }, []);

  function handleChangeMessage(e) {
    setMessage(e.target.value);
  }

  const handleSubmit = () => {
    if (message.length === 0) return;
    if (message.length > 512) return;
    sendJsonMessage({
      type: "chat_message",
      message,
    });
    setMessage("");
  };

  // useEffect(() => {
  //   (inputReference.current).focus();
  // }, [inputReference]);


  return (
    <div className="w-full">
      <span>The WebSocket is currently {connectionStatus}</span>
      {conversation && (
        <div className="py-6">
          <h3 className="text-3xl font-semibold text-gray-900">
            Chat: "{conversation.name}"
          </h3>
        </div>
      )}

      <div className="flex w-full items-center justify-between border border-gray-200 p-3">
        <input
          type="text"
          placeholder="Message"
          className="block w-full rounded-full bg-gray-100 py-2 outline-none focus:text-gray-700"
          name="message"
          value={message}
          onChange={handleChangeMessage}
          required
          
          maxLength={511}
        />
        <button className="ml-3 bg-gray-300 px-3 py-1" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      <div
        id="scrollableDiv"
        className={
          "h-[20rem] mt-3 flex flex-col-reverse relative w-full border border-gray-200 overflow-y-auto p-6"
        }
      >
        <div>
          <InfiniteScroll
            dataLength={messageHistory.length}
            next={fetchMessages}
            className="flex flex-col-reverse"
            inverse={true}
            hasMore={hasMoreMessages}
            loader={<ChatLoader />}
            scrollableTarget="scrollableDiv"
          >
            {messageHistory.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}