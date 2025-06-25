import { useEffect, useState } from "react";
import { IPost } from "../types/post";
import { getReportedPosts, updatePostStatus } from "../services/reportService";

export default function ReportedPostsPage() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await getReportedPosts();
      setPosts(data);
    } catch (err) {
      console.error("Lỗi khi tải bài viết bị báo cáo:", err);
    }
  };

  const handleToggleStatus = async (status: "active" | "banned") => {
    if (!selectedPost) return;
    try {
      await updatePostStatus(selectedPost._id, status);
      setPosts(prev =>
        prev.map(p => (p._id === selectedPost._id ? { ...p, status } : p))
      );
      setShowModal(false);
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái bài viết:", err);
    }
  };

  const openModal = (post: IPost) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  return (
    <div className="h-screen bg-gray-100 overflow-hidden flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-4">Bài viết bị báo cáo</h2>

      <div className="flex-1 overflow-y-auto rounded border">
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 bg-white shadow">
            <tr>
              <th className="text-left p-2">Người đăng</th>
              <th className="text-left p-2">Nội dung</th>
              <th className="text-left p-2">Trạng thái</th>
              <th className="text-left p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} className="border-t">
                <td className="p-2">{post.creator?.username || "Ẩn danh"}</td>
                <td className="p-2 line-clamp-2 max-w-xs">{post.content}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-white ${post.status === "banned" ? "bg-red-500" : "bg-green-500"}`}>
                    {post.status === "banned" ? "Đã khóa" : "Hoạt động"}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => openModal(post)}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white max-h-screen overflow-y-auto w-full max-w-lg rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-semibold mb-4">Chi tiết bài viết</h3>
            <div className="text-gray-800 space-y-2">
              <p><strong>Người đăng:</strong> {selectedPost.creator?.username}</p>
              <p><strong>Email:</strong> {selectedPost.creator?.email}</p>
              <p><strong>Nội dung:</strong> {selectedPost.content}</p>
              {selectedPost.images?.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {selectedPost.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="ảnh"
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}
              <p><strong>Lượt thích:</strong> {selectedPost.likes.length}</p>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => handleToggleStatus("active")}
              >
                Mở khóa
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => handleToggleStatus("banned")}
              >
                Khóa bài viết
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
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
