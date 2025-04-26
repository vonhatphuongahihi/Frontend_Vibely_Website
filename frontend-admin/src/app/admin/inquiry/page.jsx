'use client';

import DeleteInquiryPopup from "@/app/components/support/popup/DeleteInquiryPopup";
import ResponseInquiryPopup from "@/app/components/support/popup/ResponseInquiryPopup";
import SupportTable from "@/app/components/support/SupportTable";
import Sidebar from '@/app/components/sidebar/Sidebar';
import SearchBar from "@/app/components/support/SearchBar";
import { getInquiries, updateInquiry, deleteInquiry } from '@/service/inquiryAdmin.service';
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";

const Inquiry = () => {
    const [modalType, setModalType] = useState(null);
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    const [inquiries, setInquiries] = useState([]);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("");

    // Lấy danh sách thắc mắc
    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const data = await getInquiries(query, status);
                setInquiries(data.data);
            } catch (err) {
                console.error("Lỗi khi lọc thắc mắc", err);
            }
        };

        fetchInquiries();
    }, [query, status]);

    const handleSearch = (q, s) => {
        setQuery(q !== undefined ? q : query);
        setStatus(s !== undefined ? s : status);
    };

    // Xóa thắc mắc
    const handleDeleteInquiry = async () => {
        if (!selectedInquiry?._id) return;

        try {
            await deleteInquiry(selectedInquiry._id);
            setInquiries((prev) => prev.filter((inquiry) => inquiry._id !== selectedInquiry._id));
            toast.success("Xóa thắc mắc thành công!");
            setSelectedInquiry(null);
            closeModal();
        } catch (err) {
            toast.error("Xóa thắc mắc thất bại!");
            console.error("Lỗi khi xóa thắc mắc", err);
        }
    }

    // Cập nhật thắc mắc
    const handleUpdateInquiry = async (inquiry) => {
        try {
            const data = await updateInquiry(inquiry.inquiryId, {
                status: "responded",
                response: inquiry.response,
            });

            const updatedInquiry = data.data;
            setInquiries((prev) => prev.map((inquiry) => (inquiry._id === updatedInquiry._id ? updatedInquiry : inquiry)));
            toast.success("Phản hồi thắc mắc thành công!");
            setSelectedInquiry(null);
            closeModal();
        } catch (err) {
            toast.error("Phản hồi thắc mắc thất bại!");
            console.error("Lỗi khi phản hồi thắc mắc", err);
        }
    }

    // Mở và đóng modal
    const openModal = (type) => {
        setModalType(type);
    };

    const closeModal = () => setModalType(null);

    return (
        <div className="flex flex-row w-full min-h-screen bg-[#F4F7FE]">
            {/* Sidebar */}
            <Sidebar />
            {/* Nội dung chính */}
            <div className="w-full md:w-4/5 md:ml-52 py-6 px-6 overflow-y-auto">
                <h1 className="text-2xl font-semibold text-[#333]">Quản lý thắc mắc</h1>

                {/* Tìm kiếm và lọc */}
                <SearchBar onSearch={handleSearch} initialQuery={query} initialStatus={status} />

                {/* Inquiry Table */}
                <SupportTable inquiries={inquiries} openModal={openModal} setSelectedInquiry={setSelectedInquiry} />
            </div>

            {modalType === "responseInquiry" && (
                <ResponseInquiryPopup isOpen inquiry={selectedInquiry} onUpdate={handleUpdateInquiry} onClose={closeModal} />
            )}

            {modalType === "deleteInquiry" && (
                <DeleteInquiryPopup isOpen onConfirm={handleDeleteInquiry} onClose={closeModal} />
            )}
        </div>
    );
}

export default Inquiry; 