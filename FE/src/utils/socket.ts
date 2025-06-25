import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  // ❌ withCredentials: true, ← Không cần và sai type
  auth: {
    token: localStorage.getItem("access_token"),
  },
});

export default socket;
