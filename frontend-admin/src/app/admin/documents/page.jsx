'use client';

import AddDocumentPopup from "@/app/components/documents/popup/AddDocumentPopup";
import AddLevelPopup from '@/app/components/documents/popup/AddLevelPopup';
import AddSubjectPopup from "@/app/components/documents/popup/AddSubjectPopup";
import DeleteDocumentPopup from "@/app/components/documents/popup/DeleteDocumentPopup";
import UpdateDocumentPopup from "@/app/components/documents/popup/UpdateDocumentPopup";

import DocumentTable from '@/app/components/documents/DocumentTable';
import SearchBar from "@/app/components/documents/SearchBar";
import Sidebar from '@/app/components/sidebar/Sidebar';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import toast from "react-hot-toast";
import { FaBook, FaFileAlt, FaGraduationCap, FaPlus } from 'react-icons/fa';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

const Documents = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [modalType, setModalType] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);

    const [levels, setLevels] = useState([]); // Danh sách cấp học
    const [subjects, setSubjects] = useState([]); // Danh sách môn học
    const [documents, setDocuments] = useState([]); // Danh sách tài liệu
    const [selectedLevelId, setSelectedLevelId] = useState(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [token, setToken] = useState(null);
    const [query, setQuery] = useState("");

    const [subjectsByLevel, setSubjectsByLevel] = useState({});

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Lấy token từ localStorage trên client
    useEffect(() => {
        const storedToken = localStorage.getItem("adminToken");
        if (storedToken) {
            setToken(storedToken);
        } else {
            console.error("Lỗi: Không tìm thấy token");
        }
    }, []);

    // Gọi API để lấy cấp học và danh sách tài liệu ban đầu
    useEffect(() => {
        const fetchLevel = async () => {
            if (!token) return;

            try {
                const levelsRes = await axios.get(`${API_URL}/documents/levels`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setLevels(levelsRes.data.data);

                const docsRes = await axios.get(`${API_URL}/documents`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setDocuments(docsRes.data.data);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu ban đầu:", err);
            }
        };

        fetchLevel();
    }, [token]);

    // Gọi API lấy danh sách môn học khi chọn cấp học
    useEffect(() => {
        const fetchSubjects = async () => {
            if (!selectedLevelId) {
                setSubjects([]);
                return;
            }

            try {
                const res = await axios.get(`${API_URL}/documents/subjects/${selectedLevelId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setSubjects(res.data.data);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách môn học:", err);
            }
        };

        fetchSubjects();
    }, [selectedLevelId, token]);

    // Gọi API để tìm kiếm tài liệu theo query và lọc theo cấp học, môn học
    useEffect(() => {
        const fetchFilteredDocs = async () => {
            if (!token) return;

            let url = `${API_URL}/documents?`;
            if (query) url += `query=${query}&`;
            if (selectedLevelId) url += `level=${selectedLevelId}&`;
            if (selectedSubjectId) url += `subject=${selectedSubjectId}`;

            try {
                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setDocuments(res.data.data);
            } catch (err) {
                console.error("Lỗi khi lọc tài liệu:", err);
            }
        };

        fetchFilteredDocs();
    }, [query, selectedLevelId, selectedSubjectId, token]);

    // Mở và đóng modal
    const openModal = (type) => {
        setModalType(type);
        setDropdownOpen(false);
    };

    const closeModal = () => setModalType(null);

    // Gọi API thêm cấp học
    const addLevel = async (levelName) => {
        try {
            const res = await axios.post(`${API_URL}/documents/levels`, { name: levelName }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setLevels([...levels, res.data.data]);
            toast.success("Thêm cấp học thành công!");
            closeModal();
        } catch (err) {
            toast.error("Thêm cấp học thất bại!");
            console.error("Lỗi khi thêm cấp học:", err);
        }
    }

    // Gọi API thêm môn học
    const addSubject = async ({ subjectName, levelId }) => {
        try {
            const res = await axios.post(`${API_URL}/documents/subjects`, { name: subjectName, levelId }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (levelId === selectedLevelId) {
                setSubjects([...subjects, res.data.data]);
            }
            toast.success("Thêm môn học thành công!");
            closeModal();
        } catch (err) {
            toast.error("Thêm môn học thất bại!");
            console.error("Lỗi khi thêm môn học:", err);
        }
    }

    // Gọi API lấy danh sách môn học theo cấp học
    const fetchSubjectsByLevel = async (levelId) => {
        try {
            const res = await axios.get(`${API_URL}/documents/subjects/${levelId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return res.data.data;
        } catch (error) {
            console.error("Lỗi khi tải danh sách môn học:", error);
            return [];
        }
    };

    // Gọi API thêm tài liệu
    const addDocument = async (document) => {
        try {
            const res = await axios.post(`${API_URL}/documents`, {
                title: document.title,
                level: document.levelId,
                subject: document.subjectId,
                pages: document.pages,
                fileType: document.format,
                fileUrl: document.url
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("New document:", res.data.data);
            setDocuments([res.data.data, ...documents]);
            toast.success("Thêm tài liệu thành công!");
            closeModal();
        } catch (err) {
            toast.error("Thêm tài liệu thất bại!");
            console.error("Lỗi khi thêm tài liệu:", err);
        }
    }

    // Gọi API cập nhật tài liệu
    const updateDocument = async (document) => {
        try {
            const res = await axios.put(`${API_URL}/documents/${document._id}`, {
                title: document.title,
                level: document.level,
                subject: document.subject,
                pages: document.pages,
                fileType: document.fileType,
                fileUrl: document.fileUrl
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setDocuments(documents.map((doc) => (doc._id === res.data.data._id ? res.data.data : doc)));
            toast.success("Cập nhật tài liệu thành công!");
            closeModal();
        } catch (err) {
            toast.error("Cập nhật tài liệu thất bại!");
            console.error("Lỗi khi cập nhật tài liệu:", err);
        }
    }

    // Gọi API xóa tài liệu
    const deleteDocument = async () => {
        try {
            await axios.delete(`${API_URL}/documents/${selectedDocument._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setDocuments(documents.filter((doc) => doc._id !== selectedDocument._id));
            toast.success("Xóa tài liệu thành công!");
            closeModal();
        } catch (err) {
            toast.error("Xóa tài liệu thất bại!");
            console.error("Lỗi khi xóa tài liệu:", err);
        }
    }


    return (
        <div className="flex flex-row w-full min-h-screen bg-[#F4F7FE]">
            {/* Sidebar */}
            <Sidebar />
            {/* Nội dung chính */}
            <div className="w-full md:w-4/5 md:ml-52 py-6 px-6 overflow-y-auto">
            <h1 className="text-2xl font-semibold text-[#333]">Quản lý tài liệu</h1>

                {/* Tìm kiếm và lọc */}
                <SearchBar
                    onSearch={setQuery}
                    initialQuery={query}
                    levels={levels}
                    subjects={subjects}
                    selectedLevelId={selectedLevelId}
                    setSelectedLevelId={setSelectedLevelId}
                    selectedSubjectId={selectedSubjectId}
                    setSelectedSubjectId={setSelectedSubjectId}
                />
                {/* <SearchBar onSearch={setQuery} initialQuery={query} levels={levels} subjects={subjects}/> */}

                {/* Nút Thêm */}
                <div className="flex justify-end mt-6">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            className="flex items-center gap-4 bg-[#086280] text-white px-6 py-2 hover:bg-[#07556F] 
                                cursor-pointer text-[16px] rounded-md transition-all duration-200"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <FaPlus size={16} /> Thêm
                        </button>

                        {/* Dropdown */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-400 rounded-lg shadow-md">
                                <button
                                    className="group flex items-center gap-3 px-4 py-2 hover:bg-[#086280] 
                                        hover:rounded-lg hover:text-white w-full cursor-pointer"
                                    onClick={() => openModal("addLevel")}
                                >
                                    <FaGraduationCap className="text-[#086280] group-hover:text-white" />
                                    Thêm cấp học
                                </button>
                                <button
                                    className="group flex items-center gap-3 px-4 py-2 hover:bg-[#086280] 
                                        hover:rounded-lg hover:text-white w-full cursor-pointer"
                                    onClick={() => openModal("addSubject")}
                                >
                                    <FaBook className="text-[#086280] group-hover:text-white" /> Thêm môn học
                                </button>
                                <button className="group flex items-center gap-3 px-4 py-2 hover:bg-[#086280] 
                                    hover:rounded-lg hover:text-white w-full cursor-pointer"
                                    onClick={() => openModal("addDocument")}
                                >
                                    <FaFileAlt className="text-[#086280] group-hover:text-white" /> Thêm tài liệu
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Document Table */}
                <DocumentTable documents={documents} openModal={openModal} setSelectedDoc={setSelectedDocument} />
            </div>

            {modalType == "addLevel" && (
                <AddLevelPopup isOpen addLevel={addLevel} onClose={closeModal} />
            )}

            {modalType === "addSubject" && (
                <AddSubjectPopup isOpen levels={levels} addSubject={addSubject} onClose={closeModal} />
            )}

            {modalType === "addDocument" && (
                <AddDocumentPopup isOpen levels={levels} fetchSubjects={fetchSubjectsByLevel} addDocument={addDocument} onClose={closeModal} />
            )}

            {modalType === "updateDocument" && (
                <UpdateDocumentPopup isOpen levels={levels} fetchSubjects={fetchSubjectsByLevel} document={selectedDocument} updateDocument={updateDocument} onClose={closeModal} />
            )}

            {modalType === "deleteDocument" && (
                <DeleteDocumentPopup isOpen documentTitle={selectedDocument.title} onConfirm={deleteDocument} onClose={closeModal} />
            )}

        </div>
    );
}

export default Documents;