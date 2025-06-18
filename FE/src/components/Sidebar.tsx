import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { apiGetMe } from "../services/user";
import { useUser } from "@/contexts/UserContext";
import home from "../assets/img/home.svg";
import noti from "../assets/img/Noti.svg";
import logo from "../assets/img/logoWindy.svg";
import search from "../assets/img/Search.svg";
import mess from "../assets/img/Mess.svg";
import profile from "../assets/img/profile.svg";
import calendar from "../assets/img/calendar.svg";
import logoutIcon from "../assets/img/logout.svg";
import ava from "../assets/img/avatar.jpg";
import {
  apiGetAllNotification,
  apiMarkNotificationAsRead,
} from "@/services/notification";
import { INotification } from "@/types/notification";
import { IPost } from "@/types/post";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import Switcher from "./Switcher";
import PostNoti from "./PostNoti";
dayjs.extend(relativeTime);
dayjs.locale("vi");

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isActiveRoute = (path: string) => location.pathname === path;
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [showNoti, setShowNoti] = useState(false);
  const notiRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (notiRef.current && !notiRef.current.contains(target)) {
        setShowNoti(false);
      }
      if (accountRef.current && !accountRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  useEffect(() => {
    fetchNotifications();
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await apiGetMe();
      setUser(res);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await apiGetAllNotification();
      setNotifications(res.notifications);
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
    }
  };

  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  const handleNotificationClick = async (noti: INotification) => {
    try {
      await apiMarkNotificationAsRead(noti._id);

      setNotifications((prev) =>
        prev.map((n) => (n._id === noti._id ? { ...n, isRead: true } : n))
      );

      setSelectedPost(noti.post);
    } catch (error) {
      console.error("Lỗi khi xử lý thông báo:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-[220px] px-3 pt-2 bg-white border-r shadow-lg z-50 flex flex-col justify-between py-4">
      <div className="flex flex-col space-y-1">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-8 my-3" />
        </Link>
        <Link
          to="/"
          className={`w-full px-2 py-2 flex items-center justify-start space-x-2 hover:scale-105 hover:bg-[--color5] transition rounded-lg ${
            isActiveRoute("/") ? "font-semibold" : "font-normal"
          }`}
        >
          <img src={home} alt="Home" className="w-5 h-5" />
          <span className="text-sm text-left">Trang chủ</span>
        </Link>

        <Link
          to="/search"
          className={`w-full px-2 py-2 flex items-center justify-start space-x-2 hover:scale-105 hover:bg-[--color5] transition rounded-lg ${
            isActiveRoute("/search") ? "font-semibold" : "font-normal"
          }`}
        >
          <img src={search} alt="Search" className="w-5 h-5" />
          <span>Tìm kiếm</span>
        </Link>

        <Link
          to="/chat"
          className={`w-full px-2 py-2 flex items-center justify-start space-x-2 hover:scale-105 hover:bg-[--color5] transition rounded-lg ${
            isActiveRoute("/chat") ? "font-semibold" : "font-normal"
          }`}
        >
          <img src={mess} alt="Messages" className="w-5 h-5" />
          <span>Nhắn tin</span>
        </Link>

        <div className="relative" ref={notiRef}>
          <div
            onClick={() => setShowNoti(!showNoti)}
            className={`w-full px-2 py-2 flex items-center justify-start space-x-2 hover:scale-105 hover:bg-[--color5] transition rounded-lg cursor-pointer`}
          >
            <img src={noti} alt="Noti" className="w-5 h-5" />
            <span className={showNoti ? "font-semibold" : ""}>Thông báo</span>
          </div>

          {showNoti && (
            <div className="absolute left-full top-[-150px] ml-2 w-80 h-96 overflow-y-auto bg-white shadow-xl border rounded-xl z-50 p-3 space-y-2 scrollbar-hide">
              <p className="font-semibold text-sm mb-3 text-gray-800">
                Thông báo gần đây
              </p>

              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">Không có thông báo nào</p>
              ) : (
                notifications.map((noti) => (
                  <div
                    key={noti._id}
                    onClick={() => handleNotificationClick(noti)}
                    className={`flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 transition ${
                      !noti.isRead ? "bg-gray-50" : ""
                    }`}
                  >
                    <img
                      src={noti.fromUser.avatar || ava}
                      alt={noti.fromUser.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold">
                          {noti.fromUser.username}
                        </span>{" "}
                        {noti.type === "like"
                          ? "đã thích bài viết của bạn"
                          : noti.type === "comment"
                          ? "đã bình luận về bài viết"
                          : noti.type === "post"
                          ? "đã đề xuất bài viết phù hợp với bạn"
                          : "đã tương tác với bài viết của bạn"}
                      </p>
                      <p className="text-xs text-gray-600 italic line-clamp-2 mt-0.5">
                        {noti.post.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {noti.createdAt ? dayjs(noti.createdAt).fromNow() : ""}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {selectedPost && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setSelectedPost(null)}
            >
              <div
                className=" rounded-lg p-4 max-w-lg w-full relative"
                onClick={(e) => e.stopPropagation()}
              >
                <PostNoti
                  key={selectedPost._id}
                  post={selectedPost}
                  onOke={() => {
                    setSelectedPost(null);
                    setShowNoti(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <Link
          to={`/profile/${user?._id}`}
          className={`w-full px-2 py-2 flex items-center justify-start space-x-2 hover:scale-105 hover:bg-[--color5] transition rounded-lg ${
            isActiveRoute(`/profile/${user?._id}`)
              ? "font-semibold"
              : "font-normal"
          }`}
        >
          <img src={profile} alt="Profile" className="w-5 h-5" />
          <span>Trang cá nhân</span>
        </Link>
        <Link
          to={`/calendar`}
          className={`w-full px-2 py-2 flex items-center justify-start space-x-2 hover:scale-105 hover:bg-[--color5] transition rounded-lg ${
            isActiveRoute(`/calendar`) ? "font-semibold" : "font-normal"
          }`}
        >
          <img src={calendar} alt="Calendar" className="w-5 h-5" />
          <span>Lịch</span>
        </Link>
      </div>

      <div className="relative" ref={accountRef}>
        <div
          className={
            "w-full px-2 py-2 flex items-center justify-start space-x-2  transition cursor-pointer rounded-lg "
          }
          onClick={() => setIsOpen(!isOpen)}
        >
          <img
            src={user?.avatar || ava}
            alt="User Avatar"
            className="w-9 h-9 rounded-full border cursor-pointer hover:shadow-glow object-cover"
          />
          <span className="truncate overflow-hidden whitespace-nowrap max-w-[120px]">
            {user?.username}
          </span>
        </div>

        {isOpen && (
          <div className="absolute left-0 top-0 -translate-y-full p-3 w-44 bg-white rounded-lg shadow-lg border text-gray-700 z-50">
            <div className="flex flex-col items-center mb-2">
              <img
                src={user?.avatar || ava}
                className="w-16 h-16 rounded-full object-cover mb-1 border"
                alt="Avatar"
              />
              <p className="text-sm">{user?.username}</p>
            </div>
            <div className="flex justify-between items-center p-2">
              <span>Tìm kiếm</span>
              <Switcher />
            </div>
            <div
              className="flex items-center p-2 hover:bg-[--color5] rounded cursor-pointer"
              onClick={handleLogout}
            >
              <img
                src={logoutIcon}
                alt="Logout"
                className="w-5 h-5 mr-2 opacity-70"
              />
              <span>Đăng xuất</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
