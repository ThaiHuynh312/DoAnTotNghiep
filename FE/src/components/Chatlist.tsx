import { IContact } from "../types/user";
import ava from "../assets/img/avatar.jpg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

dayjs.extend(relativeTime);

export interface ChatItem {
  id: number;
  name: string;
}

interface Props {
  contacts: IContact[];
}

const Chatlist = ({ contacts }: Props) => {
  const { id } = useParams();

  return (
    <div className="w-[350px] px-2 border-r border-gray-200 flex flex-col">
      <span className="font-bold ml-2 my-3 text-2xl">Đoạn chat</span>
      {contacts.map((chat) => {
        return (
          <Link to={`/chat/${chat._id}`} key={chat._id}>
            <div
              className={`relative group text-black flex p-2 rounded-lg cursor-pointer ${
                id === chat._id
                  ? "bg-[--color6]"
                  : "hover:bg-[--color7]"
              }`}
            >
              <img
                src={chat.avatar || ava}
                alt="Avatar"
                className="h-12 w-12 rounded-full shadow-md object-cover"
              />
              <div className="truncate flex flex-col justify-center flex-1 py-1 ml-2">
                <span className="font-semibold text-base truncate">
                  {chat.username}
                </span>
                <div className="flex justify-between w-full items-center">
                  <span className="truncate text-gray-700 text-xs w-[70%]">
                    {chat.lastMessage}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {chat.lastMessageTime
                      ? dayjs(chat.lastMessageTime).fromNow()
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Chatlist;
