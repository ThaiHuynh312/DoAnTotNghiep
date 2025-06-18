import React, { useState } from "react";
import ava from "../assets/img/avatar.jpg";
import { apiSearchUser } from "@/services/user";
import { IUser } from "@/types/user";
import { useUser } from "@/contexts/UserContext";
import UserDetailModal from "@/components/UserDetailModal";

const SearchPage: React.FC = () => {
  const [filters, setFilters] = useState({
    username: "",
    address: "",
    grade: "",
    subject: "",
    gender: "",
    role: "",
    experience: "",
    education: "",
    priceMin: "",
    priceMax: "",
  });
  const [results, setResults] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [showClassPopup, setShowClassPopup] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [showSubjectPopup, setShowSubjectPopup] = useState(false);

  const allClasses = [
    "Lớp 1",
    "Lớp 2",
    "Lớp 3",
    "Lớp 4",
    "Lớp 5",
    "Lớp 6",
    "Lớp 7",
    "Lớp 8",
    "Lớp 9",
    "Lớp 10",
    "Lớp 11",
    "Lớp 12",
  ];

  const allSubjects = [
    "Toán",
    "Văn",
    "Anh",
    "Lý",
    "Hóa",
    "Sinh",
    "Sử",
    "Địa",
    "GDCD",
    "Tin học",
    "Công nghệ",
  ];
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (user: IUser) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const updatedFilters = { ...filters };

      if (user?.role === "student") {
        updatedFilters.grade = filters.grade;
        updatedFilters.subject = selectedSubjects.join(", ");
      }

      if (user?.role === "tutor") {
        updatedFilters.grade = selectedGrades.join(", ");
        updatedFilters.subject = selectedSubjects.join(", ");
      }

      const nonEmptyFilters = Object.fromEntries(
        Object.entries(updatedFilters).filter(
          ([, value]) => typeof value === "string" && value.trim() !== ""
        )
      );

      const data = await apiSearchUser(nonEmptyFilters);
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
        <div className="w-full lg:w-1/4 bg-white h-screen p-4 overflow-y-auto hide-scrollbar">
          <h2 className="text-lg font-semibold mb-4">Tìm kiếm</h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              name="username"
              placeholder="Tên"
              value={filters.username}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-[--color2] focus:ring-1 focus:ring-[--color2]"
            />
            <input
              type="text"
              name="address"
              placeholder="Địa chỉ"
              value={filters.address}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-[--color2] focus:ring-1 focus:ring-[--color2]"
            />
            <select
              name="gender"
              value={filters.gender}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-[--color2] focus:ring-1 focus:ring-[--color2] bg-white text-sm"
            >
              <option value=""> Giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
            <select
              name="role"
              value={filters.role}
              onChange={handleChange}
              className="border rounded px-4 py-2 focus:outline-none focus:border-[--color2] focus:ring-1 focus:ring-[--color2] bg-white text-sm"
            >
              <option value=""> Vai trò</option>
              <option value="student">Học sinh</option>
              <option value="tutor">Gia sư</option>
            </select>
            {filters.role === "tutor" && (
              <>
                <select
                  name="education"
                  value={filters.education}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 focus:outline-none focus:border-[--color2] focus:ring-1 focus:ring-[--color2] bg-white text-sm"
                >
                  <option value="">Trình độ học vấn</option>
                  <option value="Trung cấp">Trung cấp</option>
                  <option value="Cao đẳng">Cao đẳng</option>
                  <option value="Đại học">Đại học</option>
                  <option value="Thạc sĩ">Thạc sĩ</option>
                  <option value="Tiến sĩ">Tiến sĩ</option>
                </select>

                <select
                  name="experience"
                  value={filters.experience}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 focus:outline-none focus:border-[--color2] focus:ring-1 focus:ring-[--color2] bg-white text-sm"
                >
                  <option value="">Kinh nghiệm</option>
                  <option value="Dưới 1 năm">Dưới 1 năm</option>
                  <option value="1-2 năm">1-2 năm</option>
                  <option value="3-5 năm">3-5 năm</option>
                  <option value="Trên 5 năm">Trên 5 năm</option>
                  <option value="Trên 10 năm">Trên 10 năm</option>
                </select>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Khoảng giá (vnđ/giờ)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="priceMin"
                      placeholder="Từ"
                      value={filters.priceMin}
                      onChange={handleChange}
                      className="w-1/2 border rounded px-3 py-2"
                    />
                    <input
                      type="number"
                      name="priceMax"
                      placeholder="Đến"
                      value={filters.priceMax}
                      onChange={handleChange}
                      className="w-1/2 border rounded px-3 py-2"
                    />
                  </div>
                </div>
              </>
            )}
            {user?.role === "student" ? (
              <select
                name="grade"
                value={filters.grade}
                onChange={handleChange}
                className="border rounded px-4 py-2 focus:outline-none focus:border-[--color2] focus:ring-1 focus:ring-[--color2] bg-white text-sm"
              >
                <option value="">Chọn lớp</option>
                {allClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            ) : (
              <div>
                <label className="block text-sm opacity-60 font-medium mb-1">
                  Học lớp:
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedGrades.map((cls) => (
                    <span
                      key={cls}
                      className="border-2 border-[--color2] bg-white text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {cls}
                    </span>
                  ))}
                  <button
                    type="button"
                    className="bg-[--color2] text-white px-3 py-1 rounded-full text-sm font-semibold"
                    onClick={() => setShowClassPopup(true)}
                  >
                    Chọn lớp
                  </button>
                </div>
              </div>
            )}
            {showClassPopup && (
              <div
                className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
                onClick={() => setShowClassPopup(false)}
              >
                <div
                  className="bg-white p-5 rounded-lg w-full max-w-md shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Chọn lớp bạn muốn dạy
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {allClasses.map((cls) => {
                      const isSelected = selectedGrades.includes(cls);
                      return (
                        <button
                          key={cls}
                          type="button"
                          className={`px-3 py-1 rounded-full border ${
                            isSelected
                              ? "border-2 border-[--color3] bg-gray-100 text-gray-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                          onClick={() => {
                            setSelectedGrades((prev) =>
                              isSelected
                                ? prev.filter((c) => c !== cls)
                                : [...prev, cls]
                            );
                          }}
                        >
                          {cls}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="bg-[--color2] text-white px-4 py-2 rounded"
                      onClick={() => {
                        setFilters({
                          ...filters,
                          grade: selectedGrades.join(", "),
                        });
                        setShowClassPopup(false);
                      }}
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Môn Học</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedSubjects.map((subj) => (
                  <span
                    key={subj}
                    className="border-2 border-[--color2] bg-white text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {subj}
                  </span>
                ))}
                <button
                  type="button"
                  className="bg-[--color2] text-white px-3 py-1 rounded-full text-sm font-semibold"
                  onClick={() => setShowSubjectPopup(true)}
                >
                  Chọn môn
                </button>
              </div>
            </div>
            {showSubjectPopup && (
              <div
                className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
                onClick={() => setShowSubjectPopup(false)}
              >
                <div
                  className="bg-white p-5 rounded-lg w-full max-w-md shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Chọn môn bạn muốn dạy
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {allSubjects.map((subject) => {
                      const isSelected = selectedSubjects.includes(subject);
                      return (
                        <button
                          key={subject}
                          type="button"
                          className={`px-3 py-1 rounded-full border ${
                            isSelected
                              ? "border-2 border-[--color3] bg-gray-100 text-gray-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                          onClick={() => {
                            setSelectedSubjects((prev) =>
                              isSelected
                                ? prev.filter((s) => s !== subject)
                                : [...prev, subject]
                            );
                          }}
                        >
                          {subject}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSearch}
              className="bg-[--color2] text-white px-6 py-2 rounded-lg hover:bg-[--color3] transition"
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        <div className="flex-1">
          {loading ? (
            <p>Đang tìm kiếm...</p>
          ) : results.length === 0 ? (
            <p>Không có kết quả.</p>
          ) : (
            <div className="py-5 h-screen overflow-y-auto hide-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.map((tutor) => (
                  <div
                    key={tutor._id}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                  >
                    <div className="w-full aspect-square">
                      <img
                        src={tutor.avatar || ava}
                        alt="Avatar"
                        className="w-full aspect-square object-cover mb-1"
                      />
                    </div>

                    <div className="px-2 flex-1 flex flex-col">
                      <h2 className="text-base font-medium">
                        {tutor.username}
                      </h2>
                      {tutor.role === "tutor" ? (
                        <div className="mb-1">
                          <p className="text-xs text-gray-700">
                            {tutor.education}
                          </p>
                          {(tutor.pricePerHour ?? 0) > 0 && (
                            <p className="text-xs text-gray-700">
                              {tutor.pricePerHour?.toLocaleString("vi-VN")}đ /
                              giờ
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="mb-1">
                          <p className="text-xs text-gray-700">
                            {tutor.grades?.join(", ")}
                          </p>
                          <p className="text-xs text-gray-700">
                            {tutor.subjects?.join(", ")}
                          </p>
                        </div>
                      )}

                      <div className="mt-auto mb-2">
                        <button
                          onClick={() => handleOpenModal(tutor)}
                          className="w-full bg-[--color2] hover:bg-[--color3] text-white py-2 rounded-lg text-sm"
                        >
                          Xem thông tin
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <UserDetailModal
        user={selectedUser}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export default SearchPage;
