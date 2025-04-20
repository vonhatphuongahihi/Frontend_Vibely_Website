'use client';

import DeleteInquiryPopup from "@/app/components/support/popup/DeleteInquiryPopup";
import ResponseInquiryPopup from "@/app/components/support/popup/ResponseInquiryPopup";
import SupportTable from "@/app/components/support/SupportTable";

import Sidebar from '@/app/components/sidebar/Sidebar';
import SearchBar from "@/app/components/support/SearchBar";
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";

const Support = () => {
    const [modalType, setModalType] = useState(null);
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    const [inquiries, setInquiries] = useState([]);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("");
    const [token, setToken] = useState("");
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';


    // Lấy token từ localStorage trên client
    useEffect(() => {
        const storedToken = localStorage.getItem("adminToken");
        if (storedToken) {
            setToken(storedToken);
        } else {
            console.error("Lỗi: Không tìm thấy token");
        }
    }, []);

    // Lấy danh sách thắc mắc
    useEffect(() => {
        const fetchInquiries = async () => {
            if (!token) return;

            let url = `${API_URL}/inquiry?`;
            if (query) url += `query=${query}&`;
            if (status) url += `status=${status}`;

            try {
                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setInquiries(res.data.data);
            } catch (err) {
                console.error("Lỗi khi lọc thắc mắc", err);
            }
        };

        fetchInquiries();
    }, [query, status, token]);

    const handleSearch = (q, s) => {
        setQuery(q !== undefined ? q : query);
        setStatus(s !== undefined ? s : status);
    };

    // Xóa thắc mắc
    const deleteInquiry = async () => {
        if (!selectedInquiry?._id) return;

        try {
            const res = await axios.delete(`${API_URL}/inquiry/${selectedInquiry._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 200) {
                setInquiries((prev) => prev.filter((inquiry) => inquiry._id !== selectedInquiry._id));
                toast.success("Xóa thắc mắc thành công!");
                setSelectedInquiry(null);
                closeModal();
            }
        } catch (err) {
            toast.error("Xóa thắc mắc thất bại!");
            console.error("Lỗi khi xóa thắc mắc", err);
        }
    }

    // Cập nhật thắc mắc
    const updateInquiry = async (inquiry) => {
        try {
            console.log("inquiry", inquiry.inquiryId);
            const res = await axios.put(`${API_URL}/inquiry/${inquiry.inquiryId}`, {
                status: "Đã phản hồi",
                response: inquiry.response,
            }
                , {
                    headers: { Authorization: `Bearer ${token}` },
                });

            if (res.status === 200) {
                const updatedInquiry = res.data.inquiry;
                setInquiries((prev) => prev.map((inquiry) => (inquiry._id === updatedInquiry._id ? updatedInquiry : inquiry)));
                toast.success("Phản hồi thắc mắc thành công!");
                setSelectedInquiry(null);
                closeModal();
            }
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
            <h1 className="text-2xl font-semibold text-[#333]">Hỗ trợ</h1>

                {/* Tìm kiếm và lọc */}
                <SearchBar onSearch={handleSearch} initialQuery={query} initialStatus={status} />

                {/* Document Table */}
                <SupportTable inquiries={inquiries} openModal={openModal} setSelectedInquiry={setSelectedInquiry} />
            </div>

            {modalType === "responseInquiry" && (
                <ResponseInquiryPopup isOpen inquiry={selectedInquiry} onUpdate={updateInquiry} onClose={closeModal} />
            )}

            {modalType === "deleteInquiry" && (
                <DeleteInquiryPopup isOpen onConfirm={deleteInquiry} onClose={closeModal} />
            )}
        </div>
    );
}

export default Support;