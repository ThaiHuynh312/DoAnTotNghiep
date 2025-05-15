import EditProfileForm from "@/components/EditProfileForm";
import ava from "../assets/img/avatar.jpg";
import Post from "@/components/Post";
import PostModal from "@/components/PostModal";
import { apiGetUserPosts } from "@/services/post";
import { apiGetInfoUser } from "@/services/user";
import { IPost, IPosts } from "@/types/post";
import { IUser } from "@/types/user";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import MapTutor from "@/components/MapTutor";
import close from "../assets/img/close.svg";

const ProfilePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showEditProfileForm, setEditProfileForm] = useState(false);
  const [posts, setPosts] = useState<IPosts>();
  const [userInfo, setUserInfo] = useState<IUser>();
  const { user } = useUser();
  const [postToEdit, setPostToEdit] = useState<IPost | null>(null);
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
      console.log("User info:", response);
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

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-br-lg rounded-bl-lg overflow-hidden ">
        <div
          className="h-60 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${
              userInfo?.backgroundImage ||
              "https://res.cloudinary.com/dp2rrwrnb/image/upload/v1746249052/as3h51knvvhf1ly1bfyv.jpg"
            })`,
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
          {user?._id === userInfo?._id && (
            <button
              className="bg-[--color2] p-2 mr-4 h-12 text-lg text-white py-2 rounded-lg text-center hover:bg-[--color3] cursor-pointer"
              onClick={() => {
                setEditProfileForm(true);
              }}
            >
              Chỉnh sửa thông tin
            </button>
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

      {/* Gioi thieu */}
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
                    <span className="font-medium">Lớp: </span>
                    <div className="flex flex-wrap gap-2 mb-2">
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
                    <span className="font-medium">Môn: </span>
                    <div className="flex flex-wrap gap-2 mb-2">
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
                  {/* Hiển thị bản đồ thu nhỏ */}
                  <div
                    className="w-full h-full"
                    onClick={() => setShowMap(true)}
                  >
                    <MapTutor
                      userLat={userInfo?.address?.lat || 16.0678}
                      userLng={userInfo?.address?.lng || 108.2208}
                    />
                  </div>

                  {/* Modal chứa bản đồ to */}
                  {showMap && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                      <div className="bg-white w-full max-w-5xl h-[90vh] p-4 relative rounded-lg shadow-lg">
                        {/* Nút đóng */}
                        <button
                          onClick={() => setShowMap(false)}
                          className="absolute top-2 right-2 bg-black bg-opacity-65 w-7 h-7 flex justify-center items-center rounded-full z-50 "
                        >
                          <img src={close} alt="Close" className="w-3 h-3" />
                        </button>

                        {/* Map to */}
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
          {posts?.posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              onDelete={handleDeletePost}
              onUpdate={handleEditPost}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
