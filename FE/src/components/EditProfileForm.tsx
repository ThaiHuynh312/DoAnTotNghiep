import { useUser } from "@/contexts/UserContext";
import { apiUpdateUser } from "@/services/user";
import { IUpdateUser } from "@/types/user";
import React, { useEffect, useState } from "react";
import closeblack from "../assets/img/CloseBlack.svg";

interface PostModalProps {
  onClose: () => void;
  onEditSuccess?: () => void;
}

const EditProfileForm: React.FC<PostModalProps> = ({
  onClose,
  onEditSuccess,
}) => {
  const [formData, setFormData] = useState<IUpdateUser>({
    username: "",
    email: "",
    avatar: "",
    gender: "",
    bio: "",
    phone: "",
    address: "",
    birthday: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { user, setUser } = useUser();

  useEffect(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
      gender: user?.gender || "",
      bio: user?.bio || "",
      phone: user?.phone || "",
      address: user?.address || "",
      birthday: user?.birthday
        ? new Date(user?.birthday).toISOString().split("T")[0]
        : "",
      role: user?.role || "student",
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    if (formData.username) data.append("username", formData.username);
    if (formData.email) data.append("email", formData.email);
    if (formData.role) data.append("role", formData.role);
    if (formData.gender) data.append("gender", formData.gender);
    if (formData.birthday) data.append("birthday", formData.birthday);
    if (formData.bio) data.append("bio", formData.bio);
    if (formData.phone) data.append("phone", formData.phone);
    if (formData.address) data.append("address", formData.address);
    if (avatarFile) data.append("avatar", avatarFile);

    try {
      setLoading(true);
      const res = await apiUpdateUser(data);
      console.log("Cập nhật thành công:", res);
      setUser(res.updatedUser);
      onEditSuccess?.();
      onClose();
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-400 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-xl max-h-[95vh] overflow-y-auto p-5 rounded-xl shadow-xl text-gray-800 relative scrollbar-hide">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <h2 className="text-xl font-semibold ">
            Chỉnh sửa thông tin cá nhân
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <img src={closeblack} alt="Close" className="text-black" />
          </button>
        </div>
        

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Họ tên</label>
            <input
              type="text"
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vai trò</label>
            <select
              name="role"
              value={formData.role || "student"}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="student">Học sinh</option>
              <option value="tutor">Gia sư</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Giới tính</label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ngày sinh</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Giới thiệu (bio)
            </label>
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Ảnh đại diện
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-[--color2] hover:bg-[--color3] text-white py-2 rounded-lg transition"
          >
            {loading ? "Đang lưu..." : "Lưu thông tin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
