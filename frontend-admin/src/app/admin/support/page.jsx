'use client';

import DeleteInquiryPopup from "@/app/components/support/popup/DeleteInquiryPopup";
import ResponseInquiryPopup from "@/app/components/support/popup/ResponseInquiryPopup";
import SupportTable from "@/app/components/support/SupportTable";

import Sidebar from '@/app/components/sidebar/Sidebar';
import SearchBar from "@/app/components/support/SearchBar";
import { useState } from 'react';

const inquiries = [
    {
        userId: 1,
        username: "Hoàng Gia Minh",
        email: "hoanggiaminh27012004@gmail.com",
        message: "Tôi đã thực hiện đổi mật khẩu nhưng không thành công",
        status: "Chưa phản hồi",
        createdAt: "16/03/2025"
    },
    {
        userId: 2,
        username: "Nguyễn Thị Hồng",
        email: "thihong11@gmail.com",
        message: "Tôi không thể tải tài liệu lên",
        status: "Đã phản hồi",
        createdAt: "16/03/2025"
    },
    {
        userId: 3,
        username: "Trần Văn Hùng",
        email: "vanhung@gmail.com",
        message: "Tôi không thể tải tài liệu lên",
        status: "Chưa phản hồi",
        createdAt: "16/03/2025"
    },
]

const Support = () => {
    const [modalType, setModalType] = useState(null);
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    const openModal = (type) => {
        setModalType(type);
    };

    const closeModal = () => setModalType(null);

    return (
        <div className="flex flex-row w-full min-h-screen bg-[#F4F7FE]">
            {/* Sidebar */}
            <div className="w-1/5 flex-shrink-0">
                <Sidebar />
            </div>
            
            {/* Nội dung chính */}
            <div className="w-4/5 ml-[-20px] py-6 mr-16 overflow-y-auto">
                <h2 className="font-semibold mb-6 text-2xl text-[#2B3674]">Hỗ trợ</h2>
                
                {/* Tìm kiếm và lọc */}
                <SearchBar />
                
                {/* Document Table */}
                <SupportTable inquiries={inquiries} openModal={openModal} setSelectedInquiry={setSelectedInquiry} />
            </div>

            {modalType === "responseInquiry" && (
                <ResponseInquiryPopup isOpen onClose={closeModal} inquiry={selectedInquiry}/>
            )}
            
            {modalType === "deleteInquiry" && (
                <DeleteInquiryPopup isOpen onClose={closeModal}/>
            )}
        </div>
    );
}

export default Support;