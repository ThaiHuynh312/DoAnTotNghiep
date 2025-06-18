import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IRegisterInput } from "../types/auth";
import { apiRegister } from "../services/authService";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<
    IRegisterInput & { confirmPassword: string }
  >({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSignUp = async () => {
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await apiRegister({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === "201") {
        toast.success("Đăng ký thành công!");
        navigate("/login");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <h2 className="font-bold text-[32px] uppercase my-8">Đăng ký</h2>

        <div className="flex flex-col w-80">
          {error && <p className="text-red-500 mb-2">{error}</p>}

          <div className="relative w-80 mb-6">
            <input
              type="text"
              id="username"
              className="peer w-full border border-gray-300 bg-transparent dark:text-white rounded-md px-3 pt-4 pb-2 text-gray-900 focus:border-[--color2] focus:ring-1 focus:ring-[--color2] outline-none"
              placeholder=" "
              value={formData.username}
              onChange={handleChange}
            />
            <label
              htmlFor="username"
              className="absolute left-3 -top-2 bg-white dark:bg-black px-1 text-sm text-[--color2] transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[--color2]"
            >
              Tên người dùng {"\u002A"}
            </label>
          </div>

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
              className="absolute left-3 -top-2 bg-white dark:bg-black px-1 text-sm text-[--color2] transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[--color2]"
            >
              Email {"\u002A"}
            </label>
          </div>

          <div className="relative w-80 mb-6">
            <input
              type="password"
              id="password"
              className="peer w-full border border-gray-300 bg-transparent dark:text-white rounded-md px-3 pt-4 pb-2 text-gray-900 focus:border-[--color2] focus:ring-1 focus:ring-[--color2] outline-none"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
            />
            <label
              htmlFor="password"
              className="absolute left-3 -top-2 bg-white dark:bg-black px-1 text-sm text-[--color2] transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[--color2]"
            >
              Mật khẩu {"\u002A"}
            </label>
          </div>

          <div className="relative w-80 mb-6">
            <input
              type="password"
              id="confirmPassword"
              className="peer w-full border border-gray-300 bg-transparent dark:text-white rounded-md px-3 pt-4 pb-2 text-gray-900 focus:border-[--color2] focus:ring-1 focus:ring-[--color2] outline-none"
              placeholder=" "
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-3 -top-2 bg-white dark:bg-black px-1 text-sm text-[--color2] transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[--color2]"
            >
              Xác nhận mật khẩu {"\u002A"}
            </label>
          </div>

          <div
            className="bg-[--color2] text-lg text-white py-2 rounded-lg text-center hover:bg-[--color3] cursor-pointer"
            onClick={handleSignUp}
          >
            Đăng ký
          </div>
        </div>

        <div className="flex gap-4 my-6">
          <span>Bạn đã có tài khoản? </span>
          <Link to={"/login"} className="text-[--color2] hover:text-[--color3]">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
