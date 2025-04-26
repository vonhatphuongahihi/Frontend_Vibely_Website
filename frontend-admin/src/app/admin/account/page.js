'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import ProfilePictureSection from '../../components/account/ProfilePictureSection'
import ProfileDetailsSection from '../../components/account/ProfileDetailsSection'
import { getAdminById, updateAdminInfo } from '@/service/accountAdmin.service'

const AccountPage = () => {
    const [userData, setUserData] = useState(null);
    const adminId = "67d52f779c79c05e5f9766df"

    useEffect(() => {
        const fetchUserData = async () => {
            if (!adminId) {
                console.error("Không tìm thấy adminId");
                return;
            }

            try {
                const data = await getAdminById(adminId);
                console.log("Fetched data:", data);
                if (data) {
                    setUserData(data?.admin || {});
                    localStorage.setItem("adminData", JSON.stringify(data));
                } else {
                    console.error("Không tìm thấy dữ liệu cho adminId:", adminId);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const storedData = localStorage.getItem("adminData");
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setUserData(parsedData);
            } catch (e) {
                console.error("Error parsing stored data:", e);
            }
        }

        fetchUserData();
    }, [adminId]);



    // Hàm xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Hàm xử lý khi submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAdminInfo(adminId, userData);
            alert("Cập nhật thành công!");

            // Gọi lại API để cập nhật dữ liệu mới nhất
            const updatedData = await getAdminById(adminId);
            setUserData(updatedData);
            localStorage.setItem("adminData", JSON.stringify(updatedData));
        } catch (error) {
            alert("Cập nhật thất bại!");
            console.error(error);
        }
    };


    // Hàm xử lý khi cập nhật ảnh
    const handlePictureUpdate = async (file) => {
        const imageUrl = URL.createObjectURL(file);
        setUserData(prev => ({ ...prev, avatar: imageUrl }));

        try {
            await updateAdminInfo(adminId, { ...userData, avatar: imageUrl });
            alert("Cập nhật ảnh thành công!");
        } catch (error) {
            alert("Lỗi khi cập nhật ảnh!");
            console.error(error);
        }
    };

    return (
        <div className="flex w-full flex-row min-h-screen bg-[#F4F7FE]">
            <Sidebar />
            <div className="w-full md:w-4/5 md:ml-52 px-6 flex flex-col">
                {/* Header Row */}
                <div className="w-full py-6 mb-[-15px] flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-[#333]">Tài khoản</h1>
                </div>

                {/* Content Area */}
                <div className="w-full flex-grow lg:mx-6 p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            {/* Profile Picture Section */}
                            {userData && (
                                <ProfilePictureSection userData={userData} onPictureUpdate={handlePictureUpdate} />
                            )}
                            {userData && (
                                <ProfileDetailsSection
                                    userData={userData}
                                    handleInputChange={handleInputChange}
                                    handleSubmit={handleSubmit}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountPage
