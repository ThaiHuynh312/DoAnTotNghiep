import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Homepage from "./pages/Homepage";
import Chatpage from "./pages/Chatpage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastProvider } from "./contexts/ToastProvider";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import MapView from "./components/MapView";

const userLat = 10.7769;
const userLng = 106.7009;

const nearbyTutors = [
  { id: "1", name: "Gia sư A", lat: 10.78, lng: 106.71, distanceKm: 1.2 },
  { id: "2", name: "Gia sư B", lat: 10.77, lng: 106.69, distanceKm: 0.9 },
  { id: "3", name: "Gia sư C", lat: 10.75, lng: 106.71, distanceKm: 2.5 },
];

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/sign-up"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);
  return (
    <>
      <ToastProvider>
        {shouldShowHeader && <Header />}
        <Routes>
          <Route
            path="/map"
            element={
              <div className="w-full h-screen">
                <MapView
                  userLat={userLat}
                  userLng={userLng}
                  nearbyTutors={nearbyTutors}
                />
              </div>
            }
          />
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
        </Routes>
      </ToastProvider>
    </>
  );
}

export default App;
