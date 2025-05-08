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

const ProfilePage = () => {
  const [showModal, setShowModal] = useState(false);
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
  }, []);

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
    <div className="mt-12 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl overflow-hidden ">
        <div
          className="h-60 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dp2rrwrnb/image/upload/v1746249052/as3h51knvvhf1ly1bfyv.jpg')`,
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
              Chỉnh sửa thông tin cá nhân
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
      <div className="max-w-4xl mx-auto mt-3 flex gap-3 px-2 md:px-0">
        <div className="w-1/3 bg-white shadow-md rounded-xl p-6 self-start">
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
            {userInfo?.address && (
              <li className="flex items-start gap-2">
                <span>
                  <span className="font-medium">Địa chỉ: </span>
                  {userInfo.address}
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
            {userInfo?.bio && (
              <li className="flex items-start gap-2">
                <div>
                  <span className="font-medium">Giới thiệu bản thân: </span>
                  <p className="text-sm text-gray-600 mt-1">{userInfo.bio}</p>
                </div>
              </li>
            )}
          </ul>
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
      //{" "}
    </div>
  );
};

export default ProfilePage;
