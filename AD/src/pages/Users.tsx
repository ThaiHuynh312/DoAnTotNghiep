import { useEffect, useState } from "react";
import { getUsers, updateUserStatus } from "../services/user";
import { IUser } from "../types/user";

export default function Users() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng:", err);
    }
  };

  const openEditModal = (user: IUser) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleStatusChange = async (status: "active" | "blocked") => {
    if (selectedUser) {
      try {
        await updateUserStatus(selectedUser._id, status);
        setUsers((prev) =>
          prev.map((u) => (u._id === selectedUser._id ? { ...u, status } : u))
        );
        setShowModal(false);
      } catch (err) {
        console.error("Lỗi khi cập nhật trạng thái:", err);
      }
    }
  };

  return (
    <div className="h-screen bg-gray-100 overflow-hidden flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-4">Người dùng</h2>

      <div className="flex-1 overflow-y-auto rounded border">
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 bg-white shadow">
            <tr>
              <th className="text-left p-2">Tên</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Vai trò</th>
              <th className="text-left p-2">Trạng thái</th>
              <th className="text-left p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  {user.role === "student"
                    ? "Học sinh"
                    : user.role === "tutor"
                    ? "Gia sư"
                    : user.role === "admin"
                    ? "Quản lý"
                    : "Không rõ"}
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      user.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {user.status === "active" ? "Hoạt động" : "Bị khóa"}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => openEditModal(user)}
                  >
                    Chỉnh sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white max-h-screen overflow-y-auto w-full max-w-lg rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-semibold mb-4">
              Cập nhật trạng thái người dùng
            </h3>

            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedUser.avatar || "/default-avatar.png"}
                alt={selectedUser.username}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <p className="text-lg font-bold">{selectedUser.username}</p>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-700">
              {selectedUser.phone && (
                <p>
                  <span className="font-medium">Số điện thoại:</span>{" "}
                  {selectedUser.phone}
                </p>
              )}
              {selectedUser.gender && (
                <p>
                  <span className="font-medium">Giới tính:</span>{" "}
                  {selectedUser.gender === "male"
                    ? "Nam"
                    : selectedUser.gender === "female"
                    ? "Nữ"
                    : "Khác"}
                </p>
              )}
              {selectedUser.birthday && (
                <p>
                  <span className="font-medium">Ngày sinh:</span>{" "}
                  {new Date(selectedUser.birthday).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
              )}
              {selectedUser.role && (
                <p>
                  <span className="font-medium">Vai trò:</span>{" "}
                  {selectedUser.role === "student" ? "Học sinh" : "Gia sư"}
                </p>
              )}
              {selectedUser.address?.name && (
                <p className="col-span-2">
                  <span className="font-medium">Địa chỉ:</span>{" "}
                  {selectedUser.address.name}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
                onClick={() => handleStatusChange("active")}
              >
                Hoạt động
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                onClick={() => handleStatusChange("blocked")}
              >
                Bị khóa
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow"
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
