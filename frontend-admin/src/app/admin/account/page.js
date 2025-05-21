'use client'

import { getAdminById, updateAdminInfo} from '@/service/accountAdmin.service';
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { jwtDecode } from "jwt-decode";
import ProfileDetailsSection from '../../components/account/ProfileDetailsSection'
import ProfilePictureSection from '../../components/account/ProfilePictureSection'
import Sidebar from '../../components/sidebar/Sidebar'

const AccountPage = () => {
    const [userData, setUserData] = useState(null);
    const [adminId, setAdminId] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            console.error('Không tìm thấy token');
            return;
        }

        const decoded = jwtDecode(token);
        setAdminId(decoded.userId);
    }, []);

    // Khi đã có adminId thì mới fetch dữ liệu
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            console.error('Không tìm thấy token');
            return;
        }

        const decoded = jwtDecode(token);
        setAdminId(decoded.userId);

        // Lấy userData từ localStorage làm initial state nếu có
        const storedUserData = localStorage.getItem('adminData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    useEffect(() => {
        if (!adminId) return;

        const fetchUserData = async () => {
        if (!adminId) return;
            try {
                const response = await getAdminById(adminId);
                console.log('API trả về:', response);
                if (response?.data) {
                setUserData(response.data);
                localStorage.setItem('adminData', JSON.stringify(response.data));
                } else {
                console.error("Không tìm thấy dữ liệu cho adminId:", adminId);
                }
            } catch (error) {
                console.error("Lỗi khi fetch admin:", error);
            }
        };
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
            toast.success("Cập nhật thành công!");
            localStorage.setItem("adminData", JSON.stringify(userData));

        } catch (error) {
            toast.error("Lỗi khi cập nhật thông tin admin!");
        }
    };


    // Hàm xử lý khi cập nhật ảnh
    const handlePictureUpdate = async (imageUrl) => {
        try {
            const updatedUser = { ...userData, profilePicture: imageUrl };
            setUserData(updatedUser);

            await updateAdminInfo(adminId, updatedUser);
            toast.success("Cập nhật ảnh thành công!");
        } catch (error) {
            toast.error("Lỗi khi cập nhật ảnh!");
        }
    };

    return (
        <div className="flex w-full flex-row min-h-screen bg-[#F4F7FE]">
            <Sidebar />
            <div className="w-full md:w-4/5 md:ml-52 px-6 flex flex-col">
                {/* Header*/}
                <div className="w-full py-6 mb-[-15px] flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-[#333]">Tài khoản</h1>
                </div>

                {/* Content*/}
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
