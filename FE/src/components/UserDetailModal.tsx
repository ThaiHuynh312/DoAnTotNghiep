import React from "react";
import { IUser } from "@/types/user";
import { Link } from "react-router-dom";
import profile from "../assets/img/profile.svg";
import mess from "../assets/img/Mess.svg";

interface UserDetailModalProps {
  user: IUser | null;
  open: boolean;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  open,
  onClose,
}) => {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] p-6">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 hover:scale-110 transition"
          onClick={onClose}
          aria-label="Đóng"
        >
          <span className="text-xl font-bold">×</span>
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Thông tin người dùng
        </h2>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 flex flex-col items-center gap-4">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md hover:scale-105 transition"
            />
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-900">
                {user.username}
              </p>
              <p className="text-sm text-gray-500 italic">
                {user.role === "tutor" ? "Gia sư" : "Học sinh"}
              </p>
            </div>

            <div className="mt-2 flex gap-2 w-full px-4">
              <Link
                to={`/profile/${user?._id}`}
                className="w-1/2 bg-[--color2] py-2 rounded-lg flex justify-center items-center hover:bg-[--color3]"
              >
                <img src={profile} alt="Profile" className="w-5 h-5 invert" />
              </Link>
              <Link
                to={`/chat/${user._id}`}
                className="w-1/2 bg-gray-200 py-2 rounded-lg flex justify-center items-center hover:bg-gray-300"
              >
                <img src={mess} alt="Message" className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="md:w-2/3 space-y-4 text-gray-700 text-sm">
            {user.address && (
              <section>
                <p>
                  <strong>Địa chỉ:</strong> {user.address.name}
                </p>
              </section>
            )}
            {user.bio && (
              <section>
                <p>
                  <strong>Giới thiệu:</strong> {user.bio}
                </p>
              </section>
            )}

            {user.role === "tutor" && (
              <>
                {user.education && (
                  <section>
                    <p>
                      <strong>Trình độ học vấn:</strong> {user.education}
                    </p>
                  </section>
                )}
                {user.experience && (
                  <section>
                    <p>
                      <strong>Kinh nghiệm:</strong> {user.experience}
                    </p>
                  </section>
                )}
                {user.pricePerHour !== undefined && user.pricePerHour > 0 && (
                  <section>
                    <p>
                      <strong>Giá mỗi giờ:</strong>{" "}
                      {user.pricePerHour.toLocaleString("vi-VN")} đ
                    </p>
                  </section>
                )}
              </>
            )}

            {user.grades && user.grades.length > 0 && (
              <section>
                <strong>Lớp:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.grades.map((g) => (
                    <span
                      key={g}
                      className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {user.subjects && user.subjects.length > 0 && (
              <section>
                <strong>Môn:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.subjects.map((s) => (
                    <span
                      key={s}
                      className="bg-green-100 text-green-900 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
