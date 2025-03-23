"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; 

export default function Thietlap() {
  const [code, setCode] = useState(""); // Mã xác nhận
  const router = useRouter(); 

  const handleFocus = () => {
    if (!code) {
      setCode("130304"); // Khi click vào input, mã xác nhận sẽ tự động điền
    }
  };

  const handleClick = () => {
    // Chuyển trang khi bấm button
    router.push("/forgot-password/password");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Code submitted:", code);
    // Thực hiện xác thực mã
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FDFF] p-6">
      <form onSubmit={handleSubmit} className="w-[34%] bg-white shadow-md rounded-lg p-8 text-center border border-[#0E42D2]">
        <div className="mb-6 flex justify-center">
          <Image src="/images/vibely_full_logo.png" alt="Vibely Logo" width={80} height={30} />
        </div>
        <p className="text-sm mb-4 text-left text-[#C6C6C8]">
          <strong>Vui lòng kiểm tra email và nhập mã xác nhận để hoàn thành quá 
          trình thiết lập lại mật khẩu</strong>
        </p>
        <div className="flex flex-col items-center w-full">
          <input
            type="text"
            placeholder="Nhập mã xác nhận"
            value={code} 
            onFocus={handleFocus} // Khi nhấn vào input, tự động điền mã
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[#0E42D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E42D2] text-[#C6C6C8] mb-4"
            required
          />
        </div>
        <button
          type="submit" 
          onClick={handleClick} // Gọi handleClick khi bấm button
          className="w-[40%] bg-[#23CAF1] text-sm text-white py-3 rounded-lg hover:bg-[#1AA3C8] transition duration-200 mb-4 font-bold"
        >
          Tiếp tục
        </button>

        <div className="flex justify-end text-gray-500 text-sm justify-center mb-4 ">
          <a className="mr-2" style={{ color: '#B0C4DE' }}>
            Chưa nhận được mã?
          </a>
          <a className="font-bold" style={{ color: '#086280' }}>
            Gửi lại
          </a>
        </div>

        <div className="flex justify-end text-gray-500 text-sm">
          <a href="/forgot-password" className="hover:underline mr-2" style={{ color: '#B0C4DE' }}>
            Quay trở lại
          </a>
          <a href="/user-login" className="font-bold" style={{ color: '#086280' }}>
            Đăng nhập
          </a>
        </div>
      </form>
    </div>
  );
}
