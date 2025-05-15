import React, { useState } from "react";
import { apiSearchUser } from "@/services/user";
import { IUser } from "@/types/user";
import { Link } from "react-router-dom";

const SearchPage: React.FC = () => {
  const [filters, setFilters] = useState({
    username: "",
    address: "",
    grade: "",
    subject: "",
    gender: "",
  });
  const [results, setResults] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const nonEmptyFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value.trim() !== "")
      );
      const data = await apiSearchUser(nonEmptyFilters);
      console.log("Kết quả tìm kiếm:", data);
      setResults(data.users);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl bg-gray-100 mx-auto h-screen pr-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR FILTER */}
        <div className="w-full lg:w-1/4 bg-white h-screen  p-4">
          <h2 className="text-lg font-semibold mb-4">Bộ lọc</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="username"
              placeholder="Tên"
              value={filters.username}
              onChange={handleChange}
              className="border rounded px-4 py-2"
            />
            <input
              type="text"
              name="address"
              placeholder="Địa chỉ"
              value={filters.address}
              onChange={handleChange}
              className="border rounded px-4 py-2"
            />
            <input
              type="text"
              name="grade"
              placeholder="Lớp"
              value={filters.grade}
              onChange={handleChange}
              className="border rounded px-4 py-2"
            />
            <input
              type="text"
              name="subject"
              placeholder="Môn học"
              value={filters.subject}
              onChange={handleChange}
              className="border rounded px-4 py-2"
            />
            <select
              name="gender"
              value={filters.gender}
              onChange={handleChange}
              className="border rounded px-4 py-2"
            >
              <option value="">Giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* KẾT QUẢ */}
        <div className="flex-1 mt-5">
          {loading ? (
            <p>Đang tìm kiếm...</p>
          ) : results.length === 0 ? (
            <p>Không có kết quả.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((tutor) => (
                <div
                  key={tutor._id}
                  className="bg-white min-w-40 rounded-xl shadowflex flex-col items-center text-center transition hover:shadow-lg overflow-hidden"
                  style={{ aspectRatio: "0.58" }}
                >
                  <img
                    src={tutor.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-full aspect-square object-cover mb-1"
                  />
                  <div className="px-2">
                    <h2 className="text-base font-medium">{tutor.username}</h2>

                    <button className="mt-2 w-full bg-blue-600 py-1 text-white rounded-md hover:bg-blue-700">
                      <Link to={`/profile/${tutor?._id}`}>Trang cá nhân</Link>
                    </button>
                    <button className="mt-1 w-full bg-gray-200 py-1 text-gray-700 rounded-md hover:bg-gray-300">
                      <Link
                        to={`/chat/${tutor._id}`}
                        className="flex items-center gap-2"
                      ></Link>
                      Nhắn tin
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
