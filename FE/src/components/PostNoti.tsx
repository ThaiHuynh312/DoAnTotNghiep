import ava from "../assets/img/avatar.jpg";
import iconlike from "../assets/img/like.svg";
import iconliked from "../assets/img/liked.svg";
import mess from "../assets/img/Mess.svg";
import about from "../assets/img/3dot.svg";
import report from "../assets/img/report.svg";
import { Link } from "react-router-dom";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { toast } from "react-toastify";
import { ILikePost, IPost } from "@/types/post";
import { useState } from "react";
import { apiLikePost } from "@/services/post";
import { useUser } from "@/contexts/UserContext";
import { apiReport } from "@/services/report";
dayjs.extend(relativeTime);
dayjs.locale("vi");

const PostNoti: React.FC<{
  post: IPost;
  onOke: () => void;
}> = ({ post, onOke }) => {
  const [showOptions, setShowOptions] = useState(false);
  const { user } = useUser();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportImages, setReportImages] = useState<File[]>([]);
  const [isReporting, setIsReporting] = useState(false);
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

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsZoomed(false);
  };

  const handleSubmitReport = async () => {
    try {
      setIsReporting(true);
      const formData = new FormData();
      formData.append("type", "post");
      formData.append("reason", reportReason);
      formData.append("targetPost", post._id);

      reportImages.forEach((file) => {
        formData.append("images", file);
      });

      await apiReport(formData);

      toast.success("Gửi báo cáo thành công!");

      setShowReportModal(false);
      setReportReason("");
      setReportImages([]);
    } catch (err) {
      console.error("Lỗi gửi báo cáo:", err);
      alert("Không thể gửi báo cáo.");
    } finally {
      setIsReporting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setReportImages((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setReportImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <Link to={`/profile/${post.creator?._id || ""}`} onClick={onOke}>
          <div className="flex items-center gap-2">
            <img
              src={post.creator?.avatar || ava}
              alt="Avatar"
              className="relative h-10 w-10 shadow-md rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-semibold">{post.creator?.username}</span>
              <span className="text-gray-500 text-sm">
                {post.createdAt ? dayjs(post.createdAt).fromNow() : ""}
              </span>
            </div>
          </div>
        </Link>
        <div className="relative">
          <img
            src={about}
            alt="Tùy chọn"
            className="relative h-5 w-5 mr-2 rounded-full cursor-pointer"
            onClick={() => setShowOptions((prev) => !prev)}
          />

          {showOptions && (
            <div className="absolute w-52 p-2 right-0 top-6 bg-white border border-gray-200 rounded-md shadow-md z-10">
              <button
                className="px-4 py-2 flex gap-2 text-sm hover:bg-[--color5] w-full text-left rounded-md"
                onClick={() => {
                  setShowReportModal(true);
                  setShowOptions(false);
                }}
              >
                <img src={report} alt="report" /> Báo cáo bài viết
              </button>
            </div>
          )}
        </div>
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
                      e.stopPropagation();
                      setIsZoomed((prev) => !prev);
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

        <div className="text-black px-4 pt-2 " onClick={onOke}>
          <Link
            to={`/chat/${post.creator?._id}`}
            className="flex items-center gap-2"
          >
            <span className="text-black flex gap-2">
              <img src={mess} alt="Message" />
              Nhắn tin
            </span>
          </Link>
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md relative overflow-hidden">
            <div className="max-h-[90vh] overflow-y-auto px-6 py-4 scrollbar-hide">
              <h2 className="flex justify-center text-xl font-bold mb-4">
                Báo cáo bài viết
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
                  htmlFor="image-upload"
                  className="text-[--color2] hover:text-[--color3] border border-[--color2] hover:border-[--color3] px-3 py-1 text-md rounded-lg text-center hover:scale-110 hover:border-2 cursor-pointer transition-all"
                >
                  Thêm ảnh
                </label>
              </div>

              <input
                type="file"
                id="image-upload"
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
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-gray-600 border rounded"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSubmitReport}
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

export default PostNoti;
