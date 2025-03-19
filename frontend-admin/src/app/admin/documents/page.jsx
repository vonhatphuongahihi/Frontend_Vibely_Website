'use client';

import DocumentTable from "@/app/components/documents/DocumentTable";
import AddDocumentPopup from "@/app/components/documents/popup/AddDocumentPopup";
import AddLevelPopup from '@/app/components/documents/popup/AddLevelPopup';
import AddSubjectPopup from "@/app/components/documents/popup/AddSubjectPopup";
import DeleteDocumentPopup from "@/app/components/documents/popup/DeleteDocumentPopup";
import UpdateDocumentPopup from "@/app/components/documents/popup/UpdateDocumentPopup";

import SearchBar from "@/app/components/documents/SearchBar";
import Sidebar from '@/app/components/sidebar/Sidebar';
import { useState } from 'react';
import { FaBook, FaFileAlt, FaGraduationCap, FaPlus } from 'react-icons/fa';

const documents = [
    {
        title: 'Đề kiểm tra số 1 cuối HKI - Vật lý 12',
        level: 'Trung học phổ thông',
        subject: 'Vật lý',
        pages: 4,
        fileType: 'docx',
        fileUrl: 'https://fileexample.com',
        uploadDate: '16/03/2025',
        updateDate: '16/03/2025',
    },
    {
        title: 'Đề kiểm tra số 1 cuối HKI - Hóa học 12',
        level: 'Trung học phổ thông',
        subject: 'Hóa học',
        pages: 4,
        fileType: 'docx',
        fileUrl: 'https://fileexample.com',
        uploadDate: '16/03/2025',
        updateDate: '16/03/2025',
    },
];

const Documents = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);

    const openModal = (type) => {
        setModalType(type);
        setDropdownOpen(false);
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
                <h2 className="font-semibold mb-6 text-2xl text-[#2B3674]">Quản lý tài liệu</h2>
                
                {/* Tìm kiếm và lọc */}
                <SearchBar />
                    
                {/* Nút Thêm */}
                <div className="flex justify-end mt-6">
                    <div className="relative">
                        <button
                            className="flex items-center gap-4 bg-[#086280] text-white px-6 py-2 hover:bg-[#07556F] 
                                cursor-pointer text-[16px] rounded-md transition-all duration-200"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <FaPlus size={16}/> Thêm
                        </button>
                        
                        {/* Dropdown */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-400 rounded-lg shadow-md">
                                <button 
                                    className="group flex items-center gap-3 px-4 py-2 hover:bg-[#086280] 
                                        hover:rounded-lg hover:text-white w-full cursor-pointer"
                                    onClick={() => openModal("addLevel")}
                                >
                                    <FaGraduationCap className="text-[#086280] group-hover:text-white"/>
                                    Thêm cấp học
                                </button>
                                <button 
                                    className="group flex items-center gap-3 px-4 py-2 hover:bg-[#086280] 
                                        hover:rounded-lg hover:text-white w-full cursor-pointer"
                                    onClick={() => openModal("addSubject")}
                                >
                                    <FaBook className="text-[#086280] group-hover:text-white"/> Thêm môn học
                                </button>
                                <button className="group flex items-center gap-3 px-4 py-2 hover:bg-[#086280] 
                                    hover:rounded-lg hover:text-white w-full cursor-pointer"
                                    onClick={() => openModal("addDocument")}
                                >
                                    <FaFileAlt className="text-[#086280] group-hover:text-white"/> Thêm tài liệu
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Document Table */}
                <DocumentTable documents={documents} openModal={openModal} setSelectedDoc={setSelectedDocument} />
            </div>

            {modalType == "addLevel" && (
                <AddLevelPopup isOpen onClose={closeModal}/>
            )}

            {modalType === "addSubject" && (
                <AddSubjectPopup isOpen onClose={closeModal}/>
            )}

            {modalType === "addDocument" && (
                <AddDocumentPopup isOpen onClose={closeModal}/>
            )}

            {modalType === "updateDocument" && (
                <UpdateDocumentPopup isOpen onClose={closeModal} document={selectedDocument}/>
            )}
            
            {modalType === "deleteDocument" && (
                <DeleteDocumentPopup isOpen onClose={closeModal} documentTitle={selectedDocument.title}/>
            )}

        </div>
    );
}

export default Documents;