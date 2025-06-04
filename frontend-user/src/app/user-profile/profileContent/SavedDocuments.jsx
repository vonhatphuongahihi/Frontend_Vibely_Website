import { Card, CardContent } from "@/components/ui/card";
import { useSavedDocumentsStore } from "@/store/useSavedDocumentsStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import { toast } from "react-hot-toast";
import { GoBookmarkSlashFill } from "react-icons/go";

export const SavedDocuments = ({isOwner, userId}) => {
    const { savedDocuments, fetchSavedDocuments, fetchSavedDocumentById, unsaveDocument } = useSavedDocumentsStore();
    const router = useRouter();
    const handleNavigation = (path) => {
        if (!isOwner) {
            return;
        }
        router.push(path);
    };

    useEffect(() => {
        fetchSavedDocuments(userId);
    }, [fetchSavedDocuments]);

    const handleUnsaveDocument = async (documentId) => {
        await unsaveDocument(documentId);
    };

    // Hàm cắt chuỗi văn bản
    const truncateText = (text, maxLength) => {
        if (!text) return "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
        >
            <Card className="bg-white shadow-md rounded-lg border border-gray-200">
                <CardContent className="p-6">
                    <p className="text-xl font-semibold mb-4 dark:text-gray-300">
                        Tài liệu
                    </p>

                    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                        {savedDocuments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center space-y-4 col-span-full">
                                <img
                                    src="/novideo.png"
                                    alt="No saved documents"
                                    className="h-[180px] mx-auto"
                                />
                                <p className="text-center text-gray-500">
                                    Bạn chưa lưu tài liệu nào
                                </p>
                            </div>
                        ) : (
                        savedDocuments.map((doc) => (
                            <div
                                key={doc.id}
                                className={`relative flex flex-col p-4 border border-gray-200 rounded-lg shadow-md bg-white
                                    ${isOwner ? 'cursor-pointer hover:shadow-xl hover:bg-[#086280]/15 transition-all duration-200 ease-in' : ''}`}
                                onClick={() => handleNavigation(`/saved/${doc.id}`)}
                            >
                                {/* Icon File */}
                                <div className="flex justify-center mb-3">
                                    <img 
                                        src={doc.fileType === "pdf" ? "/images/pdf-icon.png" : "/images/docx-icon.png"} 
                                        alt="File Icon"
                                        className="h-28"
                                    />
                                </div>

                                {/* Thông tin tài liệu */}
                                <h3 className="font-semibold text-[17px]">{truncateText(doc.title, 50)}</h3>
                                <p className="text-[13px] font-semibold mt-1 italic">{doc.pages} trang</p>
                                {/* Level và Subject trên cùng một hàng */}
                                <div className="flex justify-between text-[13px] text-gray-500 font-semibold italic mt-2">
                                    <span>{doc.levelName}</span>
                                    <span>{doc.subjectName}</span>
                                </div>

                                {/* Nút Hành Động */}
                                {isOwner &&
                                    <button 
                                        className="absolute top-2 right-2 bg-gray-200 p-2 rounded-full cursor-pointer 
                                            hover:bg-[#086280] hover:text-white transition-all duration-200 ease-in"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUnsaveDocument(doc.id);
                                        }}
                                    >
                                        <GoBookmarkSlashFill/>
                                    </button>
                                }
                            </div>
                        )))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};
