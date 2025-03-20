'use client'

import React, { useRef } from 'react'
import Image from 'next/image'

const ProfilePictureSection = ({ userData, onPictureUpdate }) => {
  // Tạo một reference đến input file ẩn
  const fileInputRef = useRef(null);
  
  // Hàm xử lý click vào nút Upload picture
  const handleUploadClick = () => {
    // Kích hoạt sự kiện click trên input file ẩn
    fileInputRef.current.click();
  };
  
  // Hàm xử lý khi người dùng chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Gọi callback từ component cha, truyền file đã chọn
      onPictureUpdate(file);
    }
  };
  
  return (
    <div className="w-full md:w-1/3">
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center">
        <div className="w-40 h-40 rounded-full overflow-hidden mb-6 relative group">
          <Image 
            src={userData.avatar} 
            alt="Profile picture" 
            width={160} 
            height={160} 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {userData.firstname} {userData.lastname}
        </h2>
        <p className="text-gray-500 mb-1">{userData.address} {userData.country}</p>
        <p className="text-gray-500 mb-6">GTM-7</p>
        
        {/* Nút upload ảnh */}
        <button 
          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
          onClick={handleUploadClick}
          type="button"
        >
          Upload picture
        </button>
        
        {/* Input file ẩn */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}

export default ProfilePictureSection 