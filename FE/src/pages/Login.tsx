import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ILoginInput } from "../types/auth";
import { toast } from "react-toastify";
import { apiLogin } from "../services/authService";
import { useUser } from "@/contexts/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [formData, setFormData] = useState<ILoginInput>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLogin = async () => {
    setError("");

    if (!formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const response = await apiLogin({
        email: formData.email,
        password: formData.password,
      });
      if (response.status === "200") {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        setUser(response.data.user);
        toast.success("Đăng nhập thành công!");
        navigate("/");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <h2 className="font-bold text-[32px] uppercase my-8">Đăng nhập</h2>
        <form
          className="flex flex-col w-80"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="relative w-80 mb-6">
            <input
              type="email"
              id="email"
              className="peer w-full border border-gray-300 bg-transparent dark:text-white rounded-md px-3 pt-4 pb-2 text-gray-900 focus:border-[--color2] focus:ring-1 focus:ring-[--color2] outline-none"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
            />
            <label
              htmlFor="email"
              className="absolute left-3 -top-2 bg-white dark:bg-black  px-1 text-sm text-[--color2] transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[--color2]"
            >
              Email
            </label>
          </div>

          <div className="relative w-80 mb-6">
            <input
              type="password"
              id="password"
              className="peer w-full border border-gray-300 bg-transparent dark:text-white rounded-md px-3 pt-4 pb-2 text-gray-900  focus:border-[--color2] focus:ring-1 focus:ring-[--color2] outline-none "
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
            />
            <label
              htmlFor="password"
              className="absolute left-3 -top-2 bg-white dark:bg-black px-1 text-sm text-[--color2] transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[--color2]"
            >
              Mật khẩu
            </label>
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <button
            className="bg-[--color2] text-lg text-white py-2 rounded-lg text-center hover:bg-[--color3] cursor-pointer"
            type="submit"
          >
            Đăng nhập
          </button>
        </form>

        <div className="flex gap-4 my-6">
          <span>Bạn chưa có tài khoản?</span>
          <Link
            to={"/sign-up"}
            className="text-[--color2] hover:text-[--color3]"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
