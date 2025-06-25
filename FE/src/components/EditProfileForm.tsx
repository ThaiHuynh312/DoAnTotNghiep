import { useUser } from "@/contexts/UserContext";
import { apiUpdateUser } from "@/services/user";
import { IUpdateUser } from "@/types/user";
import React, { useEffect, useState } from "react";
import closeblack from "../assets/img/CloseBlack.svg";
import MapView from "./MapView";
import { resizeImageFunction } from "@/utils/resizeImage";
import cam from "../assets/img/camera.svg";
import { toast } from "react-toastify";

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
    address: { name: "", lng: 0, lat: 0 },
    birthday: "",
    role: "student",
    backgroundImage: "",
    grades: [],
    subjects: [],
    education: "",
    experience: "",
    pricePerHour: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const { user, setUser } = useUser();
  const [selectedGrades, setSelectedGrades] = useState<string[]>(
    user?.grades || []
  );
  const [showClassPopup, setShowClassPopup] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    user?.subjects || []
  );
  const [showSubjectPopup, setShowSubjectPopup] = useState(false);
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

  useEffect(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
      gender: user?.gender || "",
      bio: user?.bio || "",
      phone: user?.phone || "",
      address: user?.address || { name: "", lng: 0, lat: 0 },
      birthday: user?.birthday
        ? new Date(user?.birthday).toISOString().split("T")[0]
        : "",
      role: user?.role || "student",
      backgroundImage: user?.backgroundImage || "",
      grades: user?.grades || [],
      subjects: user?.subjects || [],
      education: user?.education || "",
      experience: user?.experience || "",
      pricePerHour: user?.pricePerHour || undefined,
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    try {
      const resized = await resizeImageFunction(file);
      setAvatarFile(resized);

      const preview = URL.createObjectURL(resized);
      setPreviewUrl(preview);
    } catch (err) {
      console.error("Resize ảnh đại diện thất bại:", err);
    }
  };
  useEffect(() => {
    setFormData((prev) => ({ ...prev, subjects: selectedSubjects }));
  }, [selectedSubjects]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, grades: selectedGrades }));
  }, [selectedGrades]);
  const handleBGFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    try {
      const resized = await resizeImageFunction(file);
      setBackgroundFile(resized);

      const preview = URL.createObjectURL(resized);
      setBackgroundPreviewUrl(preview);
    } catch (err) {
      console.error("Resize ảnh nền thất bại:", err);
    }
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
    if (formData.address)
      data.append("address", JSON.stringify(formData.address));
    if (formData.grades && formData.grades.length > 0) {
      formData.grades.forEach((grades) => {
        data.append("grades[]", grades);
      });
    }
    if (formData.subjects && formData.subjects.length > 0) {
      formData.subjects.forEach((subject) => {
        data.append("subjects[]", subject);
      });
    }
    if (backgroundFile) data.append("backgroundImage", backgroundFile);
    if (avatarFile) data.append("avatar", avatarFile);
    if (formData.education) data.append("education", formData.education);
    if (formData.experience) data.append("experience", formData.experience);
    if (formData.pricePerHour != null)
      data.append("pricePerHour", formData.pricePerHour.toString());

    try {
      setLoading(true);
      const res = await apiUpdateUser(data);
      setUser(res.updatedUser);
      toast.success("Cập nhật thông tin thành công!");
      onEditSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const initialAvatarUrl = user?.avatar || "";
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialAvatarUrl);
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState<
    string | null
  >(user?.backgroundImage || "");

  const handleRemoveImage = () => {
    setPreviewUrl(initialAvatarUrl);
  };

  const handleRemoveBGImage = () => {
    setBackgroundPreviewUrl(user?.backgroundImage || "");
    setBackgroundFile(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-400 bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl max-h-[95vh] overflow-y-auto p-5 rounded-xl shadow-xl text-gray-800 relative scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
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
          
          <div className="relative w-full h-fit">
            {/* Ảnh nền */}
            <div className="relative w-full h-60 bg-gray-100">
              {backgroundPreviewUrl ? (
                <img
                  src={backgroundPreviewUrl}
                  alt="Background preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                  Không có ảnh nền
                </div>
              )}

              {/* Nút gỡ ảnh nền */}
              {backgroundPreviewUrl !== user?.backgroundImage && (
                <button
                  type="button"
                  onClick={handleRemoveBGImage}
                  className="absolute top-3 right-3 bg-red-500 text-white text-xs rounded-full px-2 py-1 hover:bg-red-600 shadow-md"
                >
                  Gỡ ảnh nền
                </button>
              )}

              {/* Nút chọn ảnh nền */}
              <div className="absolute bottom-3 right-3">
                <label htmlFor="bg-upload" className="cursor-pointer">
                  <div className="w-10 h-10 flex justify-center items-center rounded-full p-2 bg-[--color2] hover:bg-[--color3]">
                    <img src={cam} alt="Chọn ảnh nền" className="w-10 h-10 " />
                  </div>
                </label>
                <input
                  id="bg-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBGFileChange}
                />
              </div>
            </div>

            {/* Ảnh avatar */}
            <div className="relative w-full">
              <div className="absolute -bottom-4 left-20 transform -translate-x-1/2">
                <div className="relative w-32 h-32 rounded-full border-4 border-white bg-white shadow-md">
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Avatar preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                      {previewUrl !== user?.avatar && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1 hover:bg-red-600 shadow-md"
                        >
                          Gỡ
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 rounded-full">
                      Không có ảnh
                    </div>
                  )}
                </div>

                {/* Nút chọn ảnh avatar */}
                <div className="absolute bottom-1 left-2/3 flex items-center">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-10 h-10 flex justify-center items-center rounded-full p-2 bg-[--color2] hover:bg-[--color3]">
                      <img
                        src={cam}
                        alt="Chọn ảnh nền"
                        className="w-10 h-10 "
                      />
                    </div>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Đệm để tránh avatar che phần dưới */}
              <div className="h-16" />
            </div>
          </div>
          
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
              {formData.role === "tutor" ? "Dạy môn:" : "Học môn"}
            </label>
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
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {formData.role === "tutor" ? "Dạy lớp:" : "Học lớp"}
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
                className="bg-[--color2]  text-white px-3 py-1 rounded-full text-sm font-semibold"
                onClick={() => setShowClassPopup(true)}
              >
                Chọn lớp
              </button>
            </div>
          </div>
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
                          if (formData.role === "tutor") {
                            // Gia sư được chọn nhiều lớp
                            setSelectedGrades((prev) =>
                              isSelected
                                ? prev.filter((c) => c !== cls)
                                : [...prev, cls]
                            );
                          } else {
                            // Học sinh chỉ chọn 1 lớp
                            setSelectedGrades([cls]);
                            setShowClassPopup(false); // Tùy chọn: đóng popup luôn
                          }
                        }}
                      >
                        {cls}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
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
          {user && formData.role === "tutor" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Trình độ học vấn
                </label>
                <select
                  value={formData.education || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      education: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">-- Chọn trình độ học vấn --</option>
                  <option value="Trung cấp">Trung cấp</option>
                  <option value="Cao đẳng">Cao đẳng</option>
                  <option value="Đại học">Đại học</option>
                  <option value="Thạc sĩ">Thạc sĩ</option>
                  <option value="Tiến sĩ">Tiến sĩ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Kinh nghiệm
                </label>
                <select
                  value={formData.experience || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">-- Chọn kinh nghiệm --</option>
                  <option value="Dưới 1 năm">Dưới 1 năm</option>
                  <option value="1-2 năm">1-2 năm</option>
                  <option value="3-5 năm">3-5 năm</option>
                  <option value="Trên 5 năm">Trên 5 năm</option>
                  <option value="Trên 10 năm">Trên 10 năm</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Giá mỗi giờ (VNĐ)
                </label>
                <input
                  type="number"
                  value={formData.pricePerHour ?? ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pricePerHour: parseInt(e.target.value),
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <input
              type="text"
              name="addressName"
              value={formData.address.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    name: e.target.value,
                  },
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="mt-3 h-56">
            <MapView
              value={{
                lat: formData.address.lat ?? 0,
                lng: formData.address.lng ?? 0,
              }}
              onChange={(coords) =>
                setFormData((prev) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    lat: coords.lat,
                    lng: coords.lng,
                  },
                }))
              }
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
