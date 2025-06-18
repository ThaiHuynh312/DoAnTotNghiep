import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";

export default function Dashboard() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  getDashboardStats()
    .then(setStats)
    .catch((err) => {
      console.error('Lỗi khi lấy dữ liệu thống kê:', err.message || err);
      setError('Không thể tải dữ liệu thống kê');
    });
}, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!stats) return <p>Loading...</p>;

  return (
    <div className="h-screen bg-gray-100 overflow-hidden flex flex-col p-4">
      <h2 className="text-2xl font-bold p-4 mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white shadow rounded p-4">
            <p className="text-gray-500">{key}</p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
