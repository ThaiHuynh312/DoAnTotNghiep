import ava from "../assets/img/avatar.jpg";
import logo from "../assets/img/logoWindy.svg";
import search from "../assets/img/Search.svg";
import mess from "../assets/img/Mess.svg";
import profile from "../assets/img/profile.svg";
import { useEffect, useState } from "react";
import logoutIcon from "./../assets/img/logout.svg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiGetMe } from "../services/user";
import { useUser } from "@/contexts/UserContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await apiGetMe();
        setUser(response);
        console.log("User info:", response);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchInfo();
  }, []);

  return (
    <div className="fixed bg-white top-0 left-0 text-[var(--color-main)] w-screen shadow-md z-50">
      <div className=" mx-4 p-2 flex items-center justify-between">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-8" />
        </Link>
        <nav className="flex justify-end items-center space-x-2">
          <div className="h-9 w-9 p-2 bg-[--color4] hover:bg-white hover:shadow-glow transition rounded-full flex justify-center items-center cursor-pointer">
            <Link to={`/search`}><img src={search} alt="Search" /></Link>
            
          </div>
          <div className="h-9 w-9 p-2 rounded-full bg-[--color4] hover:bg-white hover:shadow-glow transition flex justify-center items-center cursor-pointer">
            <Link to="/chat">
              <img src={mess} alt="Message" />
            </Link>
          </div>
          {/* <div className="h-9 w-9 p-2 rounded-full bg-[--color4] hover:bg-white hover:shadow-glow transition flex justify-center items-center cursor-pointer">
            <img src={noti} alt="Noti" />
          </div> */}
          <div
            className="relative h-9 w-9  rounded-full "
            onClick={() => setIsOpen(!isOpen)}
          >
            <img
              src={user?.avatar || ava}
              alt="Avatar"
              className="relative h-9 w-9 rounded-full border border-[--color3] hover:border-[--color5] hover:shadow-glow cursor-pointer object-cover"
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
              <div className="absolute top-10 p-4 right-0 mt-2 border border-gray-300 w-56 bg-white shadow-lg rounded-md text-gray-700 z-50">
                <div className="p-2 flex flex-col justify-center items-center cursor-default">
                  <img
                    src={user?.avatar || ava}
                    alt="Avatar"
                    className="relative h-16 w-16 mb-1 rounded-full border border-[--color3] hover:border-[--color5] hover:shadow-glow cursor-pointer object-cover"
                  />
                  {user?.username}
                </div>

                <Link to={`/profile/${user?._id}`}>
                  <div className=" p-3 flex justify-start dark:border-gray-700 hover:bg-[--color5] rounded-lg cursor-pointer">
                    <img
                      className="opacity-70 dark:invert mr-2"
                      src={profile}
                      alt="Profile"
                    />
                    <p>Thông tin cá nhân</p>
                  </div>
                </Link>
                <div
                  className=" p-3 flex justify-start dark:border-gray-700 hover:bg-[--color5] rounded-lg cursor-pointer"
                  onClick={handleLogout}
                >
                  <img
                    className="opacity-70 dark:invert mr-2"
                    src={logoutIcon}
                    alt=""
                  />
                  <p>Đăng xuất</p>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
