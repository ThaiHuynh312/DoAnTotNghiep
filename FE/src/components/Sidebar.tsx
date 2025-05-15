import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { apiGetMe } from "../services/user";
import { useUser } from "@/contexts/UserContext";
import noti from "../assets/img/Noti.svg";
import logo from "../assets/img/logoWindy.svg";
import search from "../assets/img/Search.svg";
import mess from "../assets/img/Mess.svg";
import profile from "../assets/img/profile.svg";
import logoutIcon from "../assets/img/logout.svg";
import ava from "../assets/img/avatar.jpg";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isActiveRoute = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await apiGetMe();
        setUser(res);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <div className="fixed top-0 left-0 h-full w-[250px] px-3 pt-2 bg-white border-r shadow-lg z-50 flex flex-col justify-between py-4">
      <div className="flex flex-col space-y-1">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-8 my-3" />
        </Link>
        <Link
          to="/"
          className={`w-full px-2 py-2 flex items-center justify-start space-x-2 hover:scale-105 hover:bg-gray-100 transition rounded-lg ${
            isActiveRoute("/") ? "font-semibold" : "font-normal"
          }`}
        >
          <img src={search} alt="Search" className="w-6 h-6" />
          <span className="text-sm text-left">Trang chủ</span>
        </Link>

        <Link
          to="/search"
          className={`w-full px-2 py-2 flex items-center justify-start space-x-2 hover:scale-105 hover:bg-gray-100 transition rounded-lg ${
            isActiveRoute("/search") ? "font-semibold" : "font-normal"
          }`}
        >
          <img src={search} alt="Search" className="w-5 h-5" />
          <span>Tìm kiếm</span>
        </Link>

        <Link
          to="/chat"
          className={`w-full px-2 py-2 flex items-center justify-start space-x-2 hover:scale-105 hover:bg-gray-100 transition rounded-lg ${
            isActiveRoute("/chat") ? "font-semibold" : "font-normal"
          }`}
        >
          <img src={mess} alt="Messages" className="w-5 h-5" />
          <span>Nhắn tin</span>
        </Link>

        <Link
          to={`/profile/${user?._id}`}
          className={`w-full px-2 py-2 flex items-center justify-start space-x-2 hover:scale-105 hover:bg-gray-100 transition rounded-lg ${
            isActiveRoute(`/profile/${user?._id}`)
              ? "font-semibold"
              : "font-normal"
          }`}
        >
          <img src={noti} alt="Noti" />
          <span>Thông báo</span>
        </Link>

        <Link
          to={`/profile/${user?._id}`}
          className={`w-full px-2 py-2 flex items-center justify-start space-x-2 hover:scale-105 hover:bg-gray-100 transition rounded-lg ${
            isActiveRoute(`/profile/${user?._id}`)
              ? "font-semibold"
              : "font-normal"
          }`}
        >
          <img src={profile} alt="Profile" className="w-5 h-5" />
          <span>Trang cá nhân</span>
        </Link>
      </div>

      <div
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onBlur={() => setIsOpen(false)}
      >
        <div
          className={
            "w-full px-2 py-2 flex items-center justify-start space-x-2  transition cursor-pointer rounded-lg "
          }
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
            <div
              className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
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
