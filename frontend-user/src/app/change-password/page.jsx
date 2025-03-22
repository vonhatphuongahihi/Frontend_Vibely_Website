"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }
    console.log("Mật khẩu mới:", password);
    setSuccess(true);
    setTimeout(() => {
      router.push("/user-login"); // Điều hướng về trang đăng nhập
    }, 3000); // Chuyển hướng sau 3 giây
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="w-[42.857%] bg-white shadow-md rounded-lg p-8 text-center border border-[#0E42D2]">
        <div className="mb-6 flex justify-center">
          <Image src="/images/vibely_full_logo.png" alt="Vibely Logo" width={180} height={50} />
        </div>
        <p className="text-lg mb-6 text-[#1CA2C1]">
          Cùng học tập và kết bạn ở khắp mọi nơi trên thế giới trên Vibely
        </p>
        <div className="w-full">
          <label className="block text-left font-semibold text-gray-700 mb-1">Nhập mật khẩu cũ</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-3 border border-[#0E42D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E42D2] mb-4"
            required
          />
          <label className="block text-left font-semibold text-gray-700 mb-1">Nhập mật khẩu mới</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-[#0E42D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E42D2] mb-4"
            required
          />
          <label className="block text-left font-semibold text-gray-700 mb-1">Nhập lại mật khẩu mới</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-[#0E42D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E42D2] mb-6"
            required
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && (
            <p className="text-green-500 mb-4">
              Đã đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-[#23CAF1] text-white py-3 rounded-lg hover:bg-[#1AA3C8] transition duration-200 font-bold"
        >
          Đặt lại mật khẩu
        </button>
      </form>
    </div>
  );
}
