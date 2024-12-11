import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHotkeys } from "react-hotkeys-hook";
import { FaArrowUp } from "react-icons/fa6";

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
        console.log(data)
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



  return (
    <div className="w-dvw h-screen border border-red-400 grid grid-cols-6">
      <div className="flex col-span-1 bg-purple-400 h-screen"></div>
      <div className="flex col-span-5 h-screen justify-center">
        <div
          id="scrollableDiv"
          className={
            "h-[90vh] w-[60%] mt-3 flex flex-col relative border border-gray-200 overflow-y-auto p-6"
          }
        >
          <div className="sticky top-0 flex bg-white items-center gap-4 my-4 z-10">
            {conversation && (
              <p className="font-bold"> Chat: "{conversation.name}" </p>
            )}
            <span>The WebSocket is currently {connectionStatus}</span>
          </div>

          <div>
            <InfiniteScroll
              dataLength={messageHistory.length}
              next={fetchMessages}
              className="flex flex-col-reverse"
              inverse={false}
              hasMore={hasMoreMessages}
              loader={<ChatLoader />}
              scrollableTarget="scrollableDiv"
            >
              {messageHistory.map((message) => (
                <Message key={message.id} message={message} />
              ))}
            </InfiniteScroll>
          </div>

          <div className="flex w-full items-center sticky bottom-0  bg-white mt-4 justify-between px-[15px]">
            <textarea
              placeholder="Ask DermIT..."
              name="message"
              value={message}
              rows={"1"}
              onChange={handleChangeMessage}
              className="bg-gray-200 outline-none focus:text-gray-700 w-full  px-8 py-4 max-h-[25dvh] resize-none flex rounded-full"
            />
            <button
              className="ml-3 bg-primaryGreen flex items-center justify-center w-10 h-10 text-white py-1 rounded-xl"
              onClick={handleSubmit}
            >
              <FaArrowUp />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
