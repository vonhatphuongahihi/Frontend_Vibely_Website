'use client'

import React, { useState } from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import UserDropdown from '../../components/dashboard/UserDropdown'
import ProfilePictureSection from '../../components/account/ProfilePictureSection'
import ProfileDetailsSection from '../../components/account/ProfileDetailsSection'

const userInfo = {
    id: '1',
    firstname: 'Như',
    lastname: 'Quỳnh',
    email: 'nhuquynh@gmail.com',
    phone: '0909090909',
    address: 'Hà Nội',
    country: 'Việt Nam',
    city: 'Hà Nội',
    avatar: '/images/dashboard/quynh1.jpg',
    state: 'Hà Nội'
}

const AccountPage = () => {
    const [userData, setUserData] = useState(userInfo);
    
    // Hàm xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Hàm xử lý khi submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting updated data:', userData);
    };

    // Hàm xử lý khi cập nhật ảnh
    const handlePictureUpdate = (file) => {
        // Tạo URL tạm thời để hiển thị ảnh được chọn
        const imageUrl = URL.createObjectURL(file);
        
        setUserData(prev => ({
            ...prev,
            avatar: imageUrl
        }));
        
        console.log('File selected:', file);
    };

    return (
        <div className="flex w-full flex-row min-h-screen bg-[#F4F7FE]">
            <div className="w-1/5 flex-shrink-0">
                <Sidebar />
            </div>
            <div className="w-4/5 flex flex-col">
                {/* Header Row */}
                <div className="w-full ml-[-20px] py-6 px-6 mb-[-15px] flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-[#333]">Tài khoản</h1>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                        <UserDropdown />
                    </div>
                </div>
                
                {/* Content Area */}
                <div className="py-6 px-6 ml-[-20px] overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Profile Picture Section */}
                            <ProfilePictureSection 
                                userData={userData} 
                                onPictureUpdate={handlePictureUpdate} 
                            />

                            {/* Profile Details Section */}
                            <ProfileDetailsSection 
                                userData={userData}
                                handleInputChange={handleInputChange}
                                handleSubmit={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountPage

