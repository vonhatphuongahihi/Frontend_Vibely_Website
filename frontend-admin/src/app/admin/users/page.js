'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Sidebar from '../../components/sidebar/Sidebar'
import { FiSearch, FiTrash2 } from 'react-icons/fi'
import UserDropdown from '../../components/dashboard/UserDropdown'
import UserProfile from '../../components/users/UserProfile'

const UsersPage = () => {
  // Dữ liệu người dùng mẫu
  const users = [
    { id: '001', username: 'Ngô Thị Như Quỳnh', email: 'nhuquynh@gmail.com', joinDate: '01/01/2024', posts: 3, avatar: '/images/dashboard/quynh1.jpg' },
    { id: '002', username: 'Ngô Thị Như Quỳnh', email: 'nhuquynh@gmail.com', joinDate: '01/01/2024', posts: 3, avatar: '/images/dashboard/quynh1.jpg' },
    { id: '003', username: 'Ngô Thị Như Quỳnh', email: 'nhuquynh@gmail.com', joinDate: '01/01/2024', posts: 3, avatar: '/images/dashboard/quynh1.jpg' },
    { id: '004', username: 'Ngô Thị Như Quỳnh', email: 'nhuquynh@gmail.com', joinDate: '01/01/2024', posts: 3, avatar: '/images/dashboard/quynh1.jpg' },
    { id: '005', username: 'Ngô Thị Như Quỳnh', email: 'nhuquynh@gmail.com', joinDate: '01/01/2024', posts: 3, avatar: '/images/dashboard/quynh1.jpg' },
    { id: '006', username: 'Ngô Thị Như Quỳnh', email: 'nhuquynh@gmail.com', joinDate: '01/01/2024', posts: 3, avatar: '/images/dashboard/quynh1.jpg' },
    { id: '007', username: 'Ngô Thị Như Quỳnh', email: 'nhuquynh@gmail.com', joinDate: '01/01/2024', posts: 3, avatar: '/images/dashboard/quynh1.jpg' },
    { id: '008', username: 'Ngô Thị Như Quỳnh', email: 'nhuquynh@gmail.com', joinDate: '01/01/2024', posts: 3, avatar: '/images/dashboard/quynh1.jpg' },
    { id: '009', username: 'Ngô Thị Như Quỳnh', email: 'nhuquynh@gmail.com', joinDate: '01/01/2024', posts: 3, avatar: '/images/dashboard/quynh1.jpg' },
    { id: '010', username: 'Ngô Thị Như Quỳnh', email: 'nhuquynh@gmail.com', joinDate: '01/01/2024', posts: 3, avatar: '/images/dashboard/quynh1.jpg' },
    { id: '011', username: 'Ngô Thị Như Quỳnh', email: 'nhuquynh@gmail.com', joinDate: '01/01/2024', posts: 3, avatar: '/images/dashboard/quynh1.jpg' },
    { id: '012', username: 'Ngô Thị Như Quỳnh', email: 'nhuquynh@gmail.com', joinDate: '01/01/2024', posts: 3, avatar: '/images/dashboard/quynh1.jpg' },
  ];

  // State để theo dõi người dùng được chọn
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [usersList, setUsersList] = useState(users);

  // Xử lý khi click vào người dùng
  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  // Xử lý khi tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
    console.log('Searching for:', searchQuery);
  };

  // Xử lý khi xóa người dùng
  const handleDeleteUser = (userId, e) => {
    e.stopPropagation(); // Ngăn không cho click vào hàng kích hoạt handleUserClick
    
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      // Lọc ra danh sách người dùng mới không bao gồm người dùng bị xóa
      const updatedUsers = usersList.filter(user => user.id !== userId);
      
      // Cập nhật danh sách người dùng
      setUsersList(updatedUsers);
      
      // Nếu người dùng đang được chọn là người dùng bị xóa, chọn người dùng khác
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(updatedUsers.length > 0 ? updatedUsers[0] : null);
      }
      
      console.log(`Đã xóa người dùng có ID: ${userId}`);
    }
  };

  return (
    <div className="flex w-full flex-row min-h-screen bg-[#F4F7FE]">
      {/* Sidebar */}
      <div className="w-1/5 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Container */}
      <div className="w-4/5 flex flex-col">
        {/* Header Row */}
        <div className="w-full ml-[-20px] py-6 px-6 mb-[-15px] flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#333]">Quản lý người dùng</h1>
          <div className="flex items-center space-x-4">
            {/* Notifications icon */}
            <button className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            {/* User dropdown */}
            <UserDropdown />
          </div>
        </div>

        {/* Content Area */}
        <div className="py-6 px-6 ml-[-20px] overflow-y-auto flex">
          {/* User List Section */}
          <div className="w-4/5 pr-6">
            {/* Search Bar */}
            <div className="mb-6">
              <form onSubmit={handleSearch} className="flex">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full p-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="ml-2 px-6 py-2 bg-[#0D6EFD] text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  <div className="flex items-center">
                    <FiSearch className="mr-1" />
                    <span>Tìm</span>
                  </div>
                </button>
              </form>
            </div>
            
            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-gray-600 font-medium">ID</th>
                    <th className="px-4 py-3 text-gray-600 font-medium">USERNAME</th>
                    <th className="px-4 py-3 text-gray-600 font-medium">EMAIL</th>
                    <th className="px-4 py-3 text-gray-600 font-medium">NGÀY THAM GIA</th>
                    <th className="px-4 py-3 text-gray-600 font-medium text-center">SỐ BÀI VIẾT</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usersList.map((user, index) => (
                    <tr 
                      key={index} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedUser && selectedUser.id === user.id ? 'bg-blue-50' : ''}`}
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="px-4 py-3 text-gray-800">{user.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                            <Image src={user.avatar} alt={user.username} width={32} height={32} className="h-full w-full object-cover" />
                          </div>
                          <span className="text-gray-800">{user.username}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-gray-600">{user.joinDate}</td>
                      <td className="px-4 py-3 text-gray-600 text-center">{user.posts}</td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          className="text-red-400 hover:text-red-600 transition-colors duration-200"
                          onClick={(e) => handleDeleteUser(user.id, e)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* User Profile Section */}
          <div className="w-1/5 mr-5">
            <UserProfile user={selectedUser} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
