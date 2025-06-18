import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Chatpage from "./pages/Chatpage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastProvider } from "./contexts/ToastProvider";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import Sidebar from "./components/Sidebar";
import MyCalendar from "./components/Calendar";

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/sign-up"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <ToastProvider>
      <div className="flex">
        {shouldShowHeader && <Sidebar />}
        <div className={`flex-1 ${shouldShowHeader ? "ml-[220px]" : ""}`}>
          <Routes>
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute element={<Homepage />} />} />
            <Route
              path="/profile/:id"
              element={<PrivateRoute element={<ProfilePage />} />}
            />
            <Route
              path="/chat"
              element={<PrivateRoute element={<Chatpage />} />}
            />
            <Route
              path="/chat/:id"
              element={<PrivateRoute element={<Chatpage />} />}
            />
            <Route
              path="/search"
              element={<PrivateRoute element={<SearchPage />} />}
            />
            <Route
              path="/calendar"
              element={<PrivateRoute element={<MyCalendar />} />}
            />
            <Route
              path="/calendar/:userId"
              element={<PrivateRoute element={<MyCalendar />} />}
            />
          </Routes>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
