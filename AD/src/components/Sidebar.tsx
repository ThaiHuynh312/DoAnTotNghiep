import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/users", label: "Người dùng" },
    { to: "/reported-posts", label: "Bài viết bị báo cáo" },
    { to: "/reports", label: "Báo cáo" },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold mb-6">Quản lý Windy</h1>
        <ul className="space-y-4">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`block p-2 rounded hover:bg-gray-700 ${
                  location.pathname === to ? "bg-gray-700" : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 p-2 rounded bg-red-600 hover:bg-red-700 text-white"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default Sidebar;
