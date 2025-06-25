import { useEffect, useState } from "react";
import { getReports, updateReportStatus } from "../services/reportService";
import { format } from "date-fns";
import { Report } from "../types/report";

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getReports();

      let reportsArray: Report[] = [];

      if (Array.isArray(data)) {
        reportsArray = data;
      } else if (data && Array.isArray(data)) {
        reportsArray = data;
      } else if (data && Array.isArray(data)) {
        reportsArray = data;
      } else {
        console.warn("Dữ liệu trả về không đúng định dạng mảng reports");
      }

      setReports(reportsArray);
    } catch (error) {
      console.error("Lỗi lấy danh sách báo cáo:", error);
    }
  };

  const openModal = (report: Report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const updateStatus = async (status: "resolved" | "dismissed") => {
    if (!selectedReport) return;
    setLoadingUpdate(true);
    try {
      await updateReportStatus(selectedReport._id, status);
      setReports((prev) =>
        prev.map((r) => (r._id === selectedReport._id ? { ...r, status } : r))
      );
      setSelectedReport((prev) => (prev ? { ...prev, status } : prev));
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái báo cáo:", error);
      alert("Cập nhật trạng thái thất bại, vui lòng thử lại.");
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 overflow-hidden flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-4">Danh sách báo cáo</h2>

      <div className="flex-1 overflow-y-auto rounded border">
        <table className="min-w-full bg-white border border-gray-300 rounded">
          <thead className="sticky top-0 bg-white shadow z-10">
            <tr className="bg-gray-100">
              <th className="text-left p-2 border-b">Người báo cáo</th>
              <th className="text-left p-2 border-b">Loại</th>
              <th className="text-left p-2 border-b">Lý do</th>
              <th className="text-left p-2 border-b">Trạng thái</th>
              <th className="text-left p-2 border-b">Thời gian</th>
              <th className="text-left p-2 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  Không có báo cáo nào.
                </td>
              </tr>
            )}
            {reports.map((report) => (
              <tr key={report._id} className="border-t hover:bg-gray-50">
                <td className="p-2 flex items-center gap-2">
                  <img
                    src={report.reporter.avatar}
                    alt={report.reporter.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {report.reporter.username}
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      report.type === "post" ? "bg-orange-500" : "bg-black"
                    }`}
                  >
                    {report.type === "post" ? "Bài viết" : "Người dùng"}
                  </span>
                </td>
                <td className="p-2 max-w-[200px] truncate">{report.reason}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      report.status === "pending"
                        ? "bg-yellow-500"
                        : report.status === "resolved"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {report.status === "pending"
                      ? "Đang chờ"
                      : report.status === "resolved"
                      ? "Đã đồng ý"
                      : "Đã từ chối"}
                  </span>
                </td>
                <td className="p-2">
                  {format(new Date(report.createdAt), "dd/MM/yyyy HH:mm")}
                </td>
                <td className="p-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => openModal(report)}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Chi tiết */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
          <div className="bg-white max-h-screen overflow-y-auto p-6 rounded-md w-full max-w-lg shadow-lg relative">
            <h3 className="text-xl font-bold mb-4">Chi tiết báo cáo</h3>

            <p className="mb-2 flex items-center gap-2">
              <img
                src={selectedReport.reporter.avatar}
                alt={selectedReport.reporter.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <strong>Người báo cáo:</strong> {selectedReport.reporter.username}
            </p>

            <p className="mb-2">
              <strong>Loại:</strong>{" "}
              {selectedReport.type === "post" ? "Bài viết" : "Người dùng"}
            </p>
            <p className="mb-2">
              <strong>Lý do:</strong> {selectedReport.reason}
            </p>

            {selectedReport.type === "post" && selectedReport.targetPost && (
              <>
                <p className="mb-2">
                  <strong>Nội dung bài viết:</strong>{" "}
                  {selectedReport.targetPost.content}
                </p>

                {selectedReport.targetPost.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {selectedReport.targetPost.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Ảnh minh họa ${i + 1}`}
                        className="w-full rounded"
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {selectedReport.images && selectedReport.images.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold mb-1">Ảnh minh họa:</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedReport.images.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt={`Ảnh minh họa ${idx + 1}`}
                      className="w-full rounded"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => updateStatus("resolved")}
                disabled={loadingUpdate}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Đồng ý
              </button>
              <button
                onClick={() => updateStatus("dismissed")}
                disabled={loadingUpdate}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Từ chối
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
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
