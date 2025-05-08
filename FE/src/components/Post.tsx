import ava from "../assets/img/avatar.jpg";
import iconlike from "../assets/img/like.svg";
import iconliked from "../assets/img/liked.svg";
import mess from "../assets/img/Mess.svg";
import about from "../assets/img/3dot.svg";
import edit from "../assets/img/edit.svg";
import deleteicon from "../assets/img/delete.svg";
import { Link } from "react-router-dom";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { ILikePost, IPost } from "@/types/post";
import { useState } from "react";
import { apiDeletePost, apiLikePost } from "@/services/post";
import { useUser } from "@/contexts/UserContext";
dayjs.extend(relativeTime);

const Post: React.FC<{
  post: IPost;
  onDelete: (id: string) => void;
  onUpdate: (post: IPost) => void;
}> = ({ post, onDelete, onUpdate }) => {
  const [showOptions, setShowOptions] = useState(false);
  const { user } = useUser();
  const [liked, setLiked] = useState(() =>
    post.likes.includes(user?._id || "")
  );
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const handleLike = async () => {
    try {
      const res: ILikePost = await apiLikePost(post._id);
      setLiked(res.likedUsers.includes(user?._id || ""));
      setLikesCount(res.likesCount);
    } catch (err) {
      console.error("Lỗi khi like bài viết:", err);
    }
  };

  const handleUpdate = () => {
    onUpdate(post); 
  };

  const handleDelete = async () => {
    try {
      await apiDeletePost(post._id);
      onDelete(post._id);
    } catch (err) {
      console.error("Lỗi khi xoá bài viết:", err);
    }
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsZoomed(false); 
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <Link to={`/profile/${post.creator._id}`}>
          <div className="flex items-center gap-2">
            <img
              src={post.creator.avatar || ava}
              alt="Avatar"
              className="relative h-10 w-10 shadow-md rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-bold">{post.creator.username}</span>
              <span className="text-gray-500 text-sm">
                {post.createdAt ? dayjs(post.createdAt).fromNow() : ""}
              </span>
            </div>
          </div>
        </Link>
        {post.creator._id === user?._id && (
          <div
            className="relative"
            onClick={() => setShowOptions((prev) => !prev)}
            // tabIndex={0}
            // onBlur={() => setShowOptions(false)}
          >
            <img
              src={about}
              alt="About"
              className="relative h-5 w-5 mr-2 rounded-full cursor-pointer"
            />
            {showOptions && (
              <div className="absolute w-52 p-2  right-0 top-6 bg-white border border-gray-200 rounded-md shadow-md z-10">
                <button
                  className="px-4 py-2 flex gap-2 text-sm hover:bg-[--color5] w-full text-left rounded-md"
                  onClick={handleUpdate}
                >
                  <img src={edit} alt="Edit" /> Chỉnh sửa bài viết
                </button>
                <button
                  className="px-4 py-2 flex gap-2 text-sm hover:bg-[--color5] w-full text-left rounded-md"
                  onClick={handleDelete}
                >
                  <img src={deleteicon} alt="Delete" /> Xoá bài viết
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 my-2">
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {post.content}
        </p>
        {post.images.length > 0 && (
          <div className="w-full  justify-center flex gap-2 overflow-x-auto">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post Image ${index}`}
                className="h-60 object-contain cursor-pointer"
                onClick={() => handleImageClick(image)}
              />
            ))}
            {selectedImage && (
              <div
                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-auto"
                onClick={() => {
                  setSelectedImage(null);
                  setIsZoomed(false);
                }}
              >
                <div className="min-h-screen flex items-center justify-center p-4">
                  <img
                    src={selectedImage}
                    onClick={(e) => {
                      e.stopPropagation(); // ngăn việc đóng popup khi click vào ảnh
                      setIsZoomed((prev) => !prev); // toggle giữa zoom thường và zoom lớn
                    }}
                    className={`max-h-[90vh] max-w-[90vw] rounded-md transform transition-transform duration-300 ${
                      isZoomed
                        ? "scale-150 cursor-zoom-out"
                        : "scale-100 cursor-zoom-in"
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-around gap-2">
        <button onClick={handleLike} className="px-4 pt-2 flex items-center">
          <img
            src={liked ? iconliked : iconlike}
            alt="Like"
            className="relative h-9 w-9 p-2"
          />
          Yêu thích ({likesCount})
        </button>

        <div className="text-black px-4 pt-2 ">
          <Link
            to={`/chat/${post.creator._id}`}
            className="flex items-center gap-2"
          >
            <span className="text-black flex gap-2">
              <img src={mess} alt="Message" />
              Nhắn tin
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Post;
