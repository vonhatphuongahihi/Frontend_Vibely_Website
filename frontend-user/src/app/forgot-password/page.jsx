"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter(); // Khởi tạo router

  const handleFocus = () => {
    if (!email) {
      setEmail("vonhatphuongahihi@gmail.com"); // Khi click vào, hiện email này
    }
  };

  const handleClick = () => {
    // Chuyển trang khi bấm button
    router.push("/forgot-password/code-confirm");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    // Thực hiện gửi yêu cầu đặt lại mật khẩu
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="w-1/2 bg-white shadow-md rounded-lg p-8 text-center">
        <div className="mb-6 flex justify-center">
          <Image src="/images/vibely_full_logo.png" alt="Vibely Logo" width={200} height={50} />
        </div>
        <p className="text-lg mb-4" style={{ color: '#1CA2C1' }}>
          Để tiếp tục quá trình thiết lập lại mật khẩu, vui lòng nhập email của bạn
        </p>
        <div className="flex flex-col items-center w-full">
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onFocus={handleFocus} // Khi nhấn vào input, email sẽ hiện ra
            onChange={(e) => setEmail(e.target.value)}
            className="w-[83%] px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            required
          />
        </div>

        <button
          type="button" // Tránh reload form
          onClick={handleClick} // Gọi handleClick khi bấm button
          className="w-1/3 bg-[#23CAF1] text-white py-3 rounded-lg hover:bg-[#1AA3C8] transition duration-200 mb-4 font-bold"
        >
          Tiếp tục
        </button>

        <div className="flex justify-end text-gray-500 mr-14">
          <a href="/login" className="hover:underline mr-2" style={{ color: '#B0C4DE' }}>
            Quay trở lại
          </a>
          <a href="/login" className="font-bold" style={{ color: '#086280' }}>
            Đăng nhập
          </a>
        </div>
      </form>
    </div>
  );
}
