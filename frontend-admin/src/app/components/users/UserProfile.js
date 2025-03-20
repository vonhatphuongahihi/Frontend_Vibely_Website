'use client'

import React from 'react'
import Image from 'next/image'
import { FiMail, FiPhone } from 'react-icons/fi'

const UserProfile = ({ user }) => {
  if (!user) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col items-center">
        {/* User Avatar */}
        <div className="relative mb-4">
          <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-yellow-400">
            <Image 
              src={user.avatar} 
              alt={user.username} 
              width={160} 
              height={160} 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
            {user.id}
          </div>
        </div>
        
        {/* User Name */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{user.username}</h2>
        
        {/* Contact Icons */}
        <div className="flex space-x-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-full">
            <Image src="/images/users/school.png" alt="Graduation" width={24} height={24} />
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            <Image src="/images/users/tel.png" alt="Phone" width={24} height={24} />
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            <Image src="/images/users/email.png" alt="Mail" width={24} height={24} />
          </div>
        </div>
        
        {/* User Bio */}
        <div className="w-full mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>
        
        {/* User Details */}
        <div className="w-full grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Tuổi</h3>
            <p className="text-gray-600">22</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Giới tính</h3>
            <p className="text-gray-600">Nữ</p>
          </div>
        </div>
        
        {/* Friends */}
        <div className="w-full mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Bạn bè</h3>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="h-8 w-8 rounded-full overflow-hidden border-2 border-white">
                <Image src={user.avatar} alt="Friend" width={32} height={32} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Followers/Following */}
        <div className="w-full grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Người theo dõi</h3>
            <p className="text-gray-600">10</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Đang theo dõi</h3>
            <p className="text-gray-600">10</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile 