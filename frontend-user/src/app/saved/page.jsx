"use client";
import SearchDocument from "@/app/components/SearchDocument";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import 'react-h5-audio-player/lib/styles.css';
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import LeftSideBar from "../components/LeftSideBar";

const SavedPage = () => {
    const router = useRouter();

    // State declarations
    const [levels, setLevels] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedLevelId, setSelectedLevelId] = useState(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [token, setToken] = useState(null);
    const [query, setQuery] = useState("");
    const [isPageLoading, setIsPageLoading] = useState(true);
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

    const truncateText = (text, maxLength) => {
        if (!text) return "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    // Get token from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem("auth_token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!token) return;

            try {
                const levelsRes = await axios.get(`${API_URL}/documents/levels`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setLevels(levelsRes.data.data);

                const docsRes = await axios.get(`${API_URL}/users/saved`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setDocuments(docsRes.data.data);
                setIsPageLoading(false);
            } catch (err) {
                toast.error("Lỗi khi lấy dữ liệu ban đầu");
                setIsPageLoading(false);
            }
        };

        fetchInitialData();
    }, [token]);

    // Fetch subjects when level changes
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
                toast.error("Lỗi khi lấy danh sách môn học");
            }
        };

        fetchSubjects();
    }, [selectedLevelId, token]);

    // Fetch filtered documents
    useEffect(() => {
        const fetchFilteredDocs = async () => {
            if (!token) return;

            let url = `${API_URL}/users/saved?`;
            if (query) url += `query=${query}&`;
            if (selectedLevelId) url += `level=${selectedLevelId}&`;
            if (selectedSubjectId) url += `subject=${selectedSubjectId}`;

            try {
                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setDocuments(res.data.data);
            } catch (err) {
                toast.error("Lỗi khi tìm kiếm tài liệu");
            }
        };

        fetchFilteredDocs();
    }, [query, selectedLevelId, selectedSubjectId, token]);

    // Gọi API để lấy danh sách tài liệu đã lưu
    useEffect(() => {
        if (token) {
            const fetchSavedDocuments = async () => {
                try {
                    const result = await axios.get(`${API_URL}/users/saved`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    // Lấy thông tin chi tiết cho từng document
                    const documentsWithDetails = await Promise.all(
                        result.data.data.map(async (doc) => {
                            try {
                                const docResult = await axios.get(`${API_URL}/documents/${doc._id}`, {
                                    headers: { Authorization: `Bearer ${token}` },
                                });
                                return docResult.data.data;
                            } catch (err) {
                                console.error(`Lỗi khi lấy chi tiết tài liệu ${doc._id}:`, err);
                                return null;
                            }
                        })
                    );

                    // Lọc bỏ các document null
                    setDocuments(documentsWithDetails.filter(doc => doc !== null));
                } catch (err) {
                    console.error("Lỗi khi lấy danh sách tài liệu đã lưu:", err);
                }
            };

            fetchSavedDocuments();
        }
    }, [token]);

    if (isPageLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
                <div className="w-16 h-16 border-4 border-[#23CAF1] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen p-5 bg-background pt-16 justify-center lg:justify-between">
            {/* Sidebar */}
            <div className="md:hidden">
                <LeftSideBar />
            </div>
            <Button
                variant="bigIcon"
                className="flex lg:hidden hover:bg-gray-100 absolute left-0 top-15"
                onClick={() => { setSidebarOpen(true) }}
            >
                <GiHamburgerMenu style={{ width: 24, height: 24 }} />
            </Button>

            {/* Sidebar content */}
            <div className={`fixed top-14 left-0 h-full sm:w-2/5 w-3/4 p-5 bg-white z-50 transform transition-transform duration-300  
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0 lg:static lg:w-1/5 rounded-xl shadow-lg overflow-auto`}
            >
                <Button variant="bigIcon" className="lg:hidden absolute top-4 right-2" onClick={() => setSidebarOpen(false)}>
                    <AiOutlineClose style={{ width: 24, height: 24, color: "black" }} />
                </Button>

                <p className="font-bold text-xl mb-4">Đã lưu</p>

                <SearchDocument onSearch={setQuery} initialQuery={query} />

                <Separator className="mt-1 mb-4 border-b border-gray-300" />

                {/* Level list */}
                <div className="flex flex-col">
                    <div
                        key="all-levels"
                        className={`w-full px-4 py-2 rounded-lg cursor-pointer 
                            ${selectedLevelId === null ? "bg-[#086280] text-white" : "bg-white hover:bg-gray-200"}`}
                        onClick={() => {
                            setSelectedLevelId(null);
                            setSelectedSubjectId(null);
                        }}
                    >
                        Tất cả cấp học
                    </div>
                    {levels.map((level) => (
                        <div
                            key={level.id}
                            className={`w-full px-4 py-2 rounded-lg cursor-pointer 
                                ${selectedLevelId === level.id ? "bg-[#086280] text-white" : "bg-white hover:bg-gray-200"}`}
                            onClick={() => {
                                setSelectedLevelId(level.id);
                                setSelectedSubjectId(null);
                            }}
                        >
                            {level.name}
                        </div>
                    ))}
                </div>

                <Separator className="mt-1 mb-4 border-b border-gray-300" />

                {/* Subject list */}
                {selectedLevelId && (
                    <div className="flex flex-col">
                        <div
                            key="all-subjects"
                            className={`w-full px-4 py-2 rounded-lg cursor-pointer 
                                ${selectedSubjectId === null ? "bg-[#086280] text-white" : "bg-white hover:bg-gray-200"}`}
                            onClick={() => setSelectedSubjectId(null)}
                        >
                            Tất cả môn học
                        </div>
                        {subjects.map((subject) => (
                            <div
                                key={subject.id}
                                className={`w-full px-4 py-2 rounded-lg cursor-pointer 
                                    ${selectedSubjectId === subject.id ? "bg-[#086280] text-white" : "bg-white hover:bg-gray-200"}`}
                                onClick={() => setSelectedSubjectId(subject.id)}
                            >
                                {subject.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Document list */}
            <div className="flex-1 p-4">
                <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mt-4">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="border border-gray-300 p-4 rounded-lg shadow-md bg-white cursor-pointer 
                                hover:shadow-xl transition-all duration-200 ease-in hover:bg-[#086280]/15"
                            onClick={() => router.push(`/saved/${doc.id}`)}
                        >
                            <div className="flex justify-center mb-3">
                                <img
                                    src={doc.fileType === "pdf" ? "/images/pdf-icon.png" : "/images/docx-icon.png"}
                                    alt="File Icon"
                                    className="h-28"
                                />
                            </div>
                            <h3 className="font-semibold text-[18px]">{truncateText(doc.title, 50)}</h3>
                            <p className="text-[13px] font-semibold mt-1 italic">{doc.pages} trang</p>
                            <div className="flex justify-between mt-2">
                                <p className="text-[13px] text-gray-500 font-semibold italic">{doc.levelName}</p>
                                <p className="text-[13px] text-gray-500 font-semibold italic">{doc.subjectName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SavedPage;