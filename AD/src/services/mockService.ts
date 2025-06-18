export const getDashboardStats = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        'Tổng người dùng': 1200,
        'Gia sư đang bật tìm kiếm': 430,
        'Tổng bài viết': 890,
        'Tổng tin nhắn': 12500,
      });
    }, 500);
  });
};

export const getUsers = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { _id: '1', username: 'Nguyễn Văn A', email: 'a@example.com', role: 'student' },
        { _id: '2', username: 'Trần Thị B', email: 'b@example.com', role: 'tutor' },
      ]);
    }, 500);
  });
};