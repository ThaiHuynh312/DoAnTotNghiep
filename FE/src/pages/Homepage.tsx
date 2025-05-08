import ava from "../assets/img/avatar.jpg";
import PostModal from "@/components/PostModal";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import { apiGetAllPost } from "@/services/post";
import { IPost, IPosts } from "@/types/post";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const Homepage = () => {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState<IPosts>();
  const { user } = useUser();
  const [postToEdit, setPostToEdit] = useState<IPost | null>(null);

  const handleEditPost = (post: IPost) => {
    setPostToEdit(post);
    setShowModal(true);
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
  }, []);

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => ({
      ...prev!,
      posts: prev!.posts.filter((p) => p._id !== postId),
    }));
  };

  return (
    <div className="mt-12 bg-gray-100 flex w-screen flex-row flex-1">
      <div className=" w-1/4 p-3">
        <div className="rounded-xl p-4">Phần tiện ích</div>
      </div>
      <div className="flex flex-1 w-1/2 flex-col items-center justify-center">
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
      <div className="w-1/4 p-3">Phần đề xuất</div>
    </div>
  );
};

export default Homepage;
