import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { IRegisterInput } from "../types/auth";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IRegisterInput>();

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData();
  };

  const handleSignUp = async () => {
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("Đăng ký thành công:", response.data);
      navigate("/login");
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
          {["username", "email", "password", "confirmPassword"].map((field) => (
            <div className="relative w-80 mb-6" key={field}>
              <input
                type={field.includes("password") ? "password" : field}
                id={field}
                className="peer w-full border border-gray-300 bg-transparent dark:text-white rounded-md px-3 pt-4 pb-2 text-gray-900 focus:border-[#f5145f] focus:ring-1 focus:ring-[#f5145f] outline-none"
                placeholder=" "
                value={(formData as any)[field]}
                onChange={handleChange}
              />
              <label
                htmlFor={field}
                className="absolute left-3 -top-2 bg-white dark:bg-black px-1 text-sm text-[#f5145f] transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[#f5145f]"
              >
                {field === "username"
                  ? "Tên người dùng *"
                  : field === "email"
                  ? "Email *"
                  : field === "password"
                  ? "Mật khẩu *"
                  : "Xác nhận mật khẩu *"}
              </label>
            </div>
          ))}

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}

          <div
            className="bg-[#f5145f] text-lg text-white py-2 rounded-lg text-center hover:bg-[#f5145f8b] cursor-pointer"
            onClick={handleSignUp}
          >
            Đăng ký
          </div>
        </div>

        <div className="flex gap-4 my-6">
          <span>Bạn đã có tài khoản? </span>
          <Link to="/login" className="text-[#f5145f] hover:text-[#f5145f8b]">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
