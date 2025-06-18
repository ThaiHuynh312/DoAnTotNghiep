interface Props {
  isOpen: boolean;
  onClose: () => void;

  title: string;
  date: string;
  startTime: string;
  endTime: string;
  repeat: boolean;
  repeatWeekday: number;
  repeatFrom: string;
  repeatTo: string;
  editing: boolean;

  setTitle: (val: string) => void;
  setDate: (val: string) => void;
  setStartTime: (val: string) => void;
  setEndTime: (val: string) => void;
  setRepeat: (val: boolean) => void;
  setRepeatWeekday: (val: number) => void;
  setRepeatFrom: (val: string) => void;
  setRepeatTo: (val: string) => void;

  onSubmit: (data: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    repeat: boolean;
    repeatWeekday: number;
    repeatFrom: string;
    repeatTo: string;
  }) => void;

  onDelete?: () => void;
}

const ScheduleModal: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  date,
  startTime,
  endTime,
  repeat,
  repeatWeekday,
  repeatFrom,
  repeatTo,
  editing,
  setTitle,
  setDate,
  setStartTime,
  setEndTime,
  setRepeat,
  setRepeatWeekday,
  setRepeatFrom,
  setRepeatTo,
  onSubmit,
  onDelete,
}) => {

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (end <= start) {
      alert("⛔ Thời gian kết thúc phải sau thời gian bắt đầu.");
      return;
    }

    if (repeat) {
      if (!repeatFrom || !repeatTo) {
        alert("⛔ Vui lòng chọn ngày bắt đầu và kết thúc cho lịch lặp.");
        return;
      }
      if (new Date(repeatTo) < new Date(repeatFrom)) {
        alert("⛔ Ngày kết thúc lặp phải sau ngày bắt đầu lặp.");
        return;
      }
    }

    onSubmit({
      title,
      date,
      startTime,
      endTime,
      repeat,
      repeatWeekday,
      repeatFrom,
      repeatTo,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-400 bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl max-h-[95vh] overflow-y-auto p-5 rounded-xl shadow-xl text-gray-800 relative scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          {editing ? "Chỉnh sửa lịch trình" : "Thêm lịch trình"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ngày</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Giờ bắt đầu
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Giờ kết thúc
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={repeat}
                onChange={(e) => setRepeat(e.target.checked)}
              />
              Lặp lại hàng tuần
            </label>
          </div>

          {repeat && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Thứ</label>
                <select
                  value={repeatWeekday}
                  onChange={(e) => setRepeatWeekday(Number(e.target.value))}
                  className="w-full border p-2 rounded"
                >
                  <option value={0}>Chủ Nhật</option>
                  <option value={1}>Thứ Hai</option>
                  <option value={2}>Thứ Ba</option>
                  <option value={3}>Thứ Tư</option>
                  <option value={4}>Thứ Năm</option>
                  <option value={5}>Thứ Sáu</option>
                  <option value={6}>Thứ Bảy</option>
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={repeatFrom}
                    onChange={(e) => setRepeatFrom(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={repeatTo}
                    onChange={(e) => setRepeatTo(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            {editing && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Xóa
              </button>
            )}

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editing ? "Cập nhật" : "Lưu sự kiện"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
