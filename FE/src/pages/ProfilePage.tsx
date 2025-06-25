import EditProfileForm from "@/components/EditProfileForm";
import ava from "../assets/img/avatar.jpg";
import background from "../assets/img/background.jpg";
import Post from "@/components/Post";
import PostModal from "@/components/PostModal";
import { apiGetUserPosts } from "@/services/post";
import { apiGetInfoUser } from "@/services/user";
import { IPost, IPosts } from "@/types/post";
import { IUser } from "@/types/user";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import MapTutor from "@/components/MapTutor";
import close from "../assets/img/Close.svg";
import mess from "../assets/img/Mess.svg";
import cal from "../assets/img/calendar1.svg";
import report from "../assets/img/report.svg";
import { apiReport } from "@/services/report";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showEditProfileForm, setEditProfileForm] = useState(false);
  const [posts, setPosts] = useState<IPosts>();
  const [userInfo, setUserInfo] = useState<IUser>();
  const { user } = useUser();
  const [postToEdit, setPostToEdit] = useState<IPost | null>(null);
  const [showReportUserModal, setShowReportUserModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportImages, setReportImages] = useState<File[]>([]);
  const [isReporting, setIsReporting] = useState(false);
  const { id } = useParams();

  const handleEditPost = (post: IPost) => {
    setPostToEdit(post);
    setShowModal(true);
  };

  const fetchPost = async () => {
    try {
      const res = await apiGetUserPosts(id || "");
      setPosts(res);
    } catch (error) {
      console.error("Lỗi lấy danh sách người dùng:", error);
    }
  };

  const fetchInfo = async () => {
    try {
      const response = await apiGetInfoUser(id || "");
      setUserInfo(response);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchInfo();
  }, [id]);

  useEffect(() => {
    if (userInfo?._id === user?._id) {
      fetchPost();
      fetchInfo();
    }
  }, [user]);

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => ({
      ...prev!,
      posts: prev!.posts.filter((p) => p._id !== postId),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setReportImages([...reportImages, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setReportImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitUserReport = async () => {
    try {
      setIsReporting(true);
      const formData = new FormData();
      formData.append("type", "user");
      formData.append("reason", reportReason);
      formData.append("targetUser", userInfo?._id ?? "");

      reportImages.forEach((file) => {
        formData.append("images", file);
      });

      await apiReport(formData);

      toast.success("Gửi báo cáo thành công!");

      setShowReportUserModal(false);
      setReportReason("");
      setReportImages([]);
    } catch (err) {
      console.error("Lỗi gửi báo cáo:", err);
      alert("Không thể gửi báo cáo.");
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-br-lg rounded-bl-lg overflow-hidden ">
        <div
          className="h-60 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${userInfo?.backgroundImage || background})`,
          }}
        />
        <div className="flex justify-between items-center">
          <div className="px-4 mt-10 relative z-10 mb-3">
            <div className="flex items-center gap-2 -mt-20">
              <div className="w-36 h-36 rounded-full border-4 border-white ">
                <img
                  src={userInfo?.avatar || ava}
                  alt="Avatar"
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <div className="mt-10">
                <h1 className="text-2xl font-bold">{userInfo?.username}</h1>
                <p className="text-gray-500">
                  {userInfo?.role === "student" ? "Học sinh" : "Gia sư"}
                </p>
              </div>
            </div>
          </div>
          {user?._id === userInfo?._id ? (
            <button
              className="bg-[--color2] p-2 mr-4 h-12 text-lg text-white py-2 rounded-lg text-center hover:bg-[--color3] cursor-pointer"
              onClick={() => {
                setEditProfileForm(true);
              }}
            >
              <span className="font-medium">Chỉnh sửa thông tin</span>
            </button>
          ) : (
            <div className="flex gap-2 mr-4">
              <Link
                to={`/calendar/${userInfo?._id}`}
                className="border-2 border-[--color2] text-[--color2] p-2 h-12 rounded-lg hover:bg-[--color5] cursor-pointer flex items-center justify-center gap-2"
              >
                <img src={cal} alt="Calendar" className="w-5 h-5" />
                <span className="font-medium">Xem lịch</span>
              </Link>
              <Link
                to={`/chat/${userInfo?._id}`}
                className="bg-[--color2] p-2 h-12 text-white rounded-lg hover:bg-[--color3] cursor-pointer flex items-center justify-center gap-2"
              >
                <img src={mess} alt="Message" className="w-5 h-5 invert" />
                <span className="font-medium">Nhắn tin</span>
              </Link>
              <button
                onClick={() => setShowReportUserModal(true)}
                className="bg-gray-200 p-2 h-12 rounded-lg hover:bg-gray-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <img src={report} alt="report" className="w-5 h-5" />
                <span className="font-medium">Báo cáo</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {showEditProfileForm && (
        <EditProfileForm
          onClose={() => {
            setEditProfileForm(false);
          }}
          onEditSuccess={() => {
            fetchInfo();
            setEditProfileForm(false);
          }}
        />
      )}

      <div className="max-w-4xl mx-auto mt-3 flex gap-3 px-2 md:px-0">
        <div className="w-1/3 flex flex-col gap-3">
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">
              Giới thiệu
            </h2>
            <ul className="space-y-4 text-gray-700 text-[15px]">
              {userInfo?.email && (
                <li className="flex items-start gap-2">
                  <span>
                    <span className="font-medium">Email: </span>
                    {userInfo.email}
                  </span>
                </li>
              )}
              {userInfo?.phone && (
                <li className="flex items-start gap-2">
                  <span>
                    <span className="font-medium">Số điện thoại: </span>
                    {userInfo.phone}
                  </span>
                </li>
              )}

              {userInfo?.gender && (
                <li className="flex items-start gap-2">
                  <span>
                    <span className="font-medium">Giới tính: </span>
                    {userInfo.gender === "male"
                      ? "Nam"
                      : userInfo.gender === "female"
                      ? "Nữ"
                      : "Khác"}
                  </span>
                </li>
              )}
              {userInfo?.birthday && (
                <li className="flex items-start gap-2">
                  <span>
                    <span className="font-medium">Ngày sinh: </span>
                    {new Date(userInfo.birthday).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </li>
              )}

              {userInfo?.grades && userInfo.grades.length > 0 && (
                <li className="flex items-start gap-2">
                  <span>
                    <span className="font-medium">
                      {userInfo.role === "tutor" ? "Dạy lớp:" : "Học lớp"}
                    </span>
                    <div className="flex flex-wrap gap-2 m-1">
                      {userInfo?.grades.map((cls) => (
                        <span
                          key={cls}
                          className="border-2 border-[--color3] bg-white text-gray-800 px-3 py-1 rounded-full text-sm"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </span>
                </li>
              )}
              {userInfo?.subjects && userInfo.subjects.length > 0 && (
                <li className="flex items-start gap-2">
                  <div>
                    <span className="font-medium">
                      {userInfo.role === "tutor" ? "Dạy môn:" : "Học môn"}
                    </span>
                    <div className="flex flex-wrap gap-2 m-1">
                      {userInfo?.subjects.map((cls) => (
                        <span
                          key={cls}
                          className="border-2 border-[--color3] bg-white text-gray-800 px-3 py-1 rounded-full text-sm"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              )}
              {userInfo?.role === "tutor" && (
                <>
                  {userInfo?.education && (
                    <li className="flex items-start gap-2">
                      <span>
                        <span className="font-medium">Trình độ học vấn: </span>
                        {userInfo.education}
                      </span>
                    </li>
                  )}

                  {userInfo?.experience && (
                    <li className="flex items-start gap-2">
                      <span>
                        <span className="font-medium">Kinh nghiệm: </span>
                        {userInfo.experience}
                      </span>
                    </li>
                  )}

                  {(userInfo?.pricePerHour ?? 0) > 0 && (
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Giá mỗi giờ: </span>
                      <p>
                        {userInfo?.pricePerHour?.toLocaleString("vi-VN")}đ / giờ
                      </p>
                    </li>
                  )}
                </>
              )}

              {userInfo?.address.name && (
                <li className="flex items-start gap-2">
                  <span>
                    <span className="font-medium">Địa chỉ: </span>
                    {userInfo.address.name}
                  </span>
                </li>
              )}
            </ul>
            {userInfo?.address?.lat !== undefined && (
              <div className="mt-3 h-36 z-0">
                <div className="relative w-full h-36">
                  <div
                    className="w-full h-full"
                    onClick={() => setShowMap(true)}
                  >
                    <MapTutor
                      userLat={userInfo?.address?.lat || 16.0678}
                      userLng={userInfo?.address?.lng || 108.2208}
                    />
                  </div>

                  {showMap && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                      <div className="bg-white w-full max-w-5xl h-[90vh] p-4 relative rounded-lg shadow-lg">
                        <button
                          onClick={() => setShowMap(false)}
                          className="absolute top-2 right-2 bg-black bg-opacity-65 w-7 h-7 flex justify-center items-center rounded-full z-50 "
                        >
                          <img src={close} alt="Close" className="w-3 h-3" />
                        </button>

                        <div className="w-full h-full">
                          <MapTutor
                            userLat={userInfo?.address?.lat || 16.0678}
                            userLng={userInfo?.address?.lng || 108.2208}
                            isExpanded={true}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-2/3 flex flex-col gap-3 ">
          {showModal && (
            <PostModal
              onClose={() => {
                setShowModal(false);
                setPostToEdit(null);
              }}
              onPostSuccess={() => {
                fetchPost();
                setShowModal(false);
              }}
              postToEdit={postToEdit}
            />
          )}
          {posts?.posts.length === 0 ? (
            <div className="text-center text-gray-500 text-xl mt-4">
              Chưa có bài đăng nào.
            </div>
          ) : (
            posts?.posts.map((post) => (
              <Post
                key={post._id}
                post={post}
                onDelete={handleDeletePost}
                onUpdate={handleEditPost}
              />
            ))
          )}
        </div>
      </div>
      {showReportUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md relative overflow-hidden">
            <div className="max-h-[90vh] overflow-y-auto px-6 py-4 scrollbar-hide">
              <h2 className="flex justify-center text-xl font-bold mb-4">
                Báo cáo người dùng
              </h2>

              <label className="block mb-2 text-lg font-semibold">
                Lý do báo cáo
              </label>
              <textarea
                className="w-full p-2 border rounded mb-4"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={4}
              />

              <div className="flex items-center justify-between mb-2">
                <label className="text-lg font-semibold">Ảnh minh họa</label>
                <label
                  htmlFor="user-image-upload"
                  className="text-[--color2] hover:text-[--color3] border border-[--color2] hover:border-[--color3] px-3 py-1 text-md rounded-lg text-center hover:scale-110 hover:border-2 cursor-pointer transition-all"
                >
                  Thêm ảnh
                </label>
              </div>

              <input
                type="file"
                id="user-image-upload"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />

              {reportImages.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-4">
                  {reportImages.map((image, index) => (
                    <div key={index} className="relative w-32 h-32">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Ảnh ${index + 1}`}
                        className="w-full h-full object-cover rounded-md border shadow"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        title="Gỡ ảnh"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setShowReportUserModal(false)}
                  className="px-4 py-2 text-gray-600 border rounded"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSubmitUserReport}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  {isReporting ? "Đang gửi..." : "Gửi báo cáo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
