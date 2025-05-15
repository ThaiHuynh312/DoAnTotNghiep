import about from "../assets/img/About.svg";
import send from "../assets/img/Send.svg";
import ava from "../assets/img/avatar.jpg";
import { IContact, IUser } from "../types/user";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Chatlist from "../components/Chatlist";
import { apiGetMessages } from "../services/message";
import { IMessage } from "../types/message";
import {
  apiGetContactsHistory,
  apiGetInfoUser,
} from "../services/user";
import { Link, useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

interface MessagePayload {
  senderId: string;
  receiverId: string;
  content: string;
}

export interface ChatItem {
  id: number;
  name: string;
}

const Chatpage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [listMessages, setListMessages] = useState<IMessage[]>([]);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const { user } = useUser();
  const [userContacts, setUserContacts] = useState<IUser>();
  const { id } = useParams();

  const fetchInfoContact = async () => {
    try {
      const response = await apiGetInfoUser(id || "");
      setUserContacts(response);
      console.log("User info:", response);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await apiGetContactsHistory();
      setContacts(res);
    } catch (error) {
      console.error("Lỗi lấy danh sách người dùng:", error);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() && socket) {
      const payload: MessagePayload = {
        senderId: user?._id || "",
        receiverId: id || "",
        content: message,
      };
      try {
        socket.emit("sendMessage", payload);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    if (id) {
      const fetchMessages = async () => {
        try {
          const response = await apiGetMessages(id);
          setListMessages(response);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    } else {
      setListMessages([]);
    }
    fetchInfoContact();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const newSocket = io("http://localhost:5000", {
      auth: {
        token,
      },
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Socket connected");
    });

    newSocket.on("newMessage", (msg) => {
      setListMessages((prev) => [...prev, msg]);
      fetchContacts();
      console.log("New message received:", msg);
      console.log("Listmess:", listMessages);
    });
    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      newSocket.disconnect();
      console.log("🧹 Socket connection cleaned up");
    };
  }, []);

  return (
    <div className="">
      <div className="flex flex-1 h-screen">
        <Chatlist contacts={contacts} />
        <div className="flex flex-col flex-1">
          <div className="h-13 shadow-sm">
            {userContacts?._id ? (
              <div className="mx-2 p-2 flex items-center justify-between">
                <div className="flex items-center">
                  <Link to={`/profile/${userContacts?._id}`}>
                    <img
                      src={userContacts?.avatar || ava}
                      alt="Avatar"
                      className="h-9 w-9 rounded-full shadow-md object-cover"
                    />
                  </Link>

                  <div className="ml-2 text-sm">
                    <span className="font-semibold text-base">
                      {userContacts.username}
                    </span>
                    <div className="text-gray-500 text-xs">Đang hoạt động</div>
                  </div>
                </div>
                <img
                  src={about}
                  alt="About"
                  className="relative h-5 w-5 rounded-full"
                />
              </div>
            ) : (
              <div className="flex items-center">
                <span className="font-semibold ml-2 my-3 text-2xl">
                  Chọn đoạn chat
                </span>
              </div>
            )}
          </div>

          {/* Lịch sử tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {listMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === user?._id ? "justify-end" : "items-start"
                }`}
              >
                {msg.sender !== user?._id && (
                  <img
                    src={userContacts?.avatar || ava}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full mr-2 object-cover"
                  />
                )}
                <div
                  className={`px-3 py-2 text-sm rounded-3xl max-w-[70%] ${
                    msg.sender === user?._id
                      ? "bg-[--color2] text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Ô nhập tin nhắn */}
          <div className="px-3 py-2 flex items-center">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 border-none bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div
              className="ml-2 p-2 cursor-pointer"
              onClick={handleSendMessage}
            >
              <img src={send} alt="Send" className="h-6 w-6 text-[--color2]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatpage;
