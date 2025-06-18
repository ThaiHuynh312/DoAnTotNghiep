import ava from "../assets/img/avatar.jpg";
import PostModal from "@/components/PostModal";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import { apiGetAllPost } from "@/services/post";
import { IPost, IPosts } from "@/types/post";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { IUser } from "@/types/user";
import { apiGetSuggestedUsers } from "@/services/user";
import UserDetailModal from "@/components/UserDetailModal";

const Homepage = () => {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState<IPosts>();
  const { user } = useUser();
  const [postToEdit, setPostToEdit] = useState<IPost | null>(null);
  const [suggestedUsers, setSuggestedUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserClick = (user: IUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleEditPost = (post: IPost) => {
    setPostToEdit(post);
    setShowModal(true);
  };

  const fetchSuggestedUsers = async () => {
    try {
      const res = await apiGetSuggestedUsers();
      setSuggestedUsers(res);
    } catch (error) {
      console.error("Lỗi lấy danh sách người dùng đề xuất:", error);
    }
  };

  const fetchPost = async () => {
    try {
      const res = await apiGetAllPost();
      setPosts(res);
    } catch (error) {
      console.error("Lỗi lấy danh sách người dùng:", error);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchSuggestedUsers();
  }, []);

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => ({
      ...prev!,
      posts: prev!.posts.filter((p) => p._id !== postId),
    }));
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-row flex-1">
      <div className="flex flex-1 w-1/2 items-start justify-center">
        <div className="flex flex-1 max-w-xl flex-col items-center justify-center px-4">
          {/* Tạo bài post */}
          <div className="w-full mt-4">
            <div className="bg-white p-4 shadow-md rounded-xl flex items-center space-x-2 w-full">
              <Link to={`/profile/${user?._id}`}>
                <div className="w-10 h-10 min-w-10 rounded-full overflow-hidden border border-[--color3]">
                  <img
                    src={user?.avatar || ava}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              <div
                onClick={() => setShowModal(true)}
                className="w-full h-10 bg-gray-100 text-left py-2 px-4 rounded-full text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                Bạn đang nghĩ gì?
              </div>
            </div>

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
          </div>

          <div className="w-full flex flex-col gap-3 mt-3">
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

      <div className="w-1/4 p-3 ">
        <div className="bg-white p-2 rounded-xl shadow-md">
          <h2 className="font-semibold mb-1 ml-2 text-lg text-gray-700">
            Đề xuất {user?.role === "tutor" ? "học sinh" : "gia sư"}
          </h2>
          {(user?.grades?.length ?? 0) > 0 &&
          (user?.subjects?.length ?? 0) > 0 ? (
            suggestedUsers.length > 0 ? (
              <>
                <div className="flex flex-col overflow-x-auto">
                  {suggestedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="p-2 flex flex-1 rounded-lg hover:bg-[--color5]"
                    >
                      <div
                        onClick={() => handleUserClick(user)}
                        className="flex items-center gap-2 max-w-full cursor-pointer"
                      >
                        <img
                          src={user.avatar || "/default-avatar.png"}
                          alt="Avatar"
                          className="h-12 w-12 rounded-full object-cover aspect-square"
                        />
                        <div className="flex-1 min-w-0">
                          {/* Quan trọng để `truncate` hoạt động */}
                          <h2 className="text-base font-semibold">
                            {user.username}
                          </h2>

                          {/* Hiển thị theo role */}
                          {user.role === "tutor" ? (
                            <>
                              <p className="text-xs text-gray-700">
                                {user.education}
                              </p>
                              {(user.pricePerHour ?? 0) > 0 && (
                                <p className="text-xs text-gray-700">
                                  {user.pricePerHour?.toLocaleString("vi-VN")}đ
                                  / giờ
                                </p>
                              )}
                            </>
                          ) : (
                            <>
                              <p className="text-xs text-gray-700">
                                {user.grades?.join(", ")}
                              </p>
                              <p className="text-xs text-gray-700">
                                {user.subjects?.join(", ")}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Hiện không có người phù hợp xung quanh.
              </p>
            )
          ) : (
            <p className="text-sm text-red-500 mt-2">
              Vui lòng cập nhật thông tin đầy đủ để nhận được các đề xuất hữu
              ích.
            </p>
          )}
        </div>
      </div>
      {selectedUser && (
        <UserDetailModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default Homepage;
