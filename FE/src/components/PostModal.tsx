import ava from "../assets/img/avatar.jpg";
import close from "../assets/img/close.svg";
import closeblack from "../assets/img/CloseBlack.svg";
import React, { useEffect, useState } from "react";
import { apiCreatePost, apiUpdatePost } from "@/services/post";
import { IPost } from "@/types/post";
import { useUser } from "@/contexts/UserContext";

interface PostModalProps {
  onClose: () => void;
  onPostSuccess?: () => void;
  postToEdit?: IPost | null;
}

const PostModal: React.FC<PostModalProps> = ({
  onClose,
  onPostSuccess,
  postToEdit,
}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [rows, setRows] = useState(1);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const maxRows = 6;

  useEffect(() => {
    if (postToEdit) {
      setContent(postToEdit.content || "");
      setPreviews(postToEdit.images || []);
    }
  }, [postToEdit]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lineCount = e.target.value.split("\n").length;
    setContent(e.target.value);
    setRows(Math.min(maxRows, Math.max(1, lineCount)));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setSelectedImages((prev) => [...prev, ...filesArray]);

      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...previewUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePostSubmit = async () => {
    if (!content.trim() && selectedImages.length === 0) return;

    const formData = new FormData();
    formData.append("content", content);
    selectedImages.forEach((file) => formData.append("images", file));

    try {
      setLoading(true);
      if (postToEdit) {
        await apiUpdatePost(postToEdit._id, formData); 
      } else {
        await apiCreatePost(formData);
      }

      setContent("");
      setSelectedImages([]);
      setPreviews([]);
      onClose();
      onPostSuccess?.();
    } catch (err) {
      console.error("Lỗi khi đăng/chỉnh sửa bài:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-400 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white max-h-[95vh] overflow-y-auto w-full max-w-xl p-5 rounded-lg shadow-xl text-gray-800 relative scrollbar-hide">
      <div className="flex justify-between items-center mb-4">
          <div></div>
          <h2 className="text-xl font-semibold ">
            Tạo bài đăng mới
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <img src={closeblack} alt="Close" className="text-black" />
          </button>
        </div>

        <div className="flex mb-4 justify-between items-center">
          <div className="flex space-x-2 items-center">
            <img
              src={user?.avatar || ava}
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-[--color3] object-cover"
            />
            <div>
              <p className=" font-semibold">{user?.username}</p>
            </div>
          </div>
          <label
            htmlFor="image-upload"
            className="text-[--color2] hover:text-[--color3] border border-[--color2] hover:border-[--color3] p-1 text-md rounded-lg text-center hover:scale-110 hover:border-2 cursor-pointer"
          >
            Thêm ảnh
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <textarea
          className="w-full resize-none focus:outline-none text-lg"
          rows={rows}
          value={content}
          onChange={handleInput}
          placeholder="Bạn đang nghĩ gì?"
        ></textarea>

        {previews.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold py-2">Ảnh đã thêm</p>
            <div className="grid grid-cols-3 gap-3">
              {previews.map((src, index) => (
                <div key={index} className="relative group">
                  <img
                    src={src}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute w-4 h-4 p-1 top-1 right-1 bg-black bg-opacity-60 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <img src={close} alt="Close" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          className="w-full mt-4 bg-[--color2] text-lg text-white py-2 rounded-lg text-center hover:bg-[--color3] cursor-pointer"
          onClick={handlePostSubmit}
          disabled={loading}
        >
          {postToEdit
            ? loading
              ? "Đang chỉnh sửa..."
              : "Chỉnh sửa bài"
            : loading
            ? "Đang đăng..."
            : "Đăng bài"}
        </button>
      </div>
    </div>
  );
};

export default PostModal;
