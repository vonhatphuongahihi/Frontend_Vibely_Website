"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }
    console.log("Mật khẩu mới:", password);
    router.push("/user-login"); // Điều hướng về trang đăng nhập
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FDFF] p-6">
      <form onSubmit={handleSubmit} className="w-[31%] bg-white shadow-md rounded-lg p-6 text-center border border-[#0E42D2]">
        <div className="mb-6 flex justify-center">
          <Image src="/images/vibely_full_logo.png" alt="Vibely Logo" width={80} height={30} />
        </div>
        <p className="text-sm text-center mb-4 text-[#1CA2C1]">
          Cùng học tập và kết bạn ở khắp mọi nơi trên thế giới trên Vibely
        </p>
        <div className="w-full">
          <label className="block text-left text-sm font-bold text-[#086280] mb-1">Nhập mật khẩu mới</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-[#0E42D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E42D2] mb-4"
            required
          />
          <label className="block text-left text-sm font-bold text-[#086280] mb-1">Nhập lại mật khẩu mới</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-[#0E42D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E42D2] mb-6"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#23CAF1] text-white text-sm py-3 rounded-lg hover:bg-[#1AA3C8] transition duration-200 font-bold"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
