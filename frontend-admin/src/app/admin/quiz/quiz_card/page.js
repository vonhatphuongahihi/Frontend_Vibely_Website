'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiMoreVertical, FiEdit2, FiTrash2, FiPlayCircle } from 'react-icons/fi'

const QuizCard = ({ quiz }) => {
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);

    // Xử lý click vào nút play
    const handlePlay = () => {
        router.push(`/admin/quiz/play/${quiz.id}`);
    };

    // Xử lý click vào nút edit
    const handleEdit = (e) => {
        e.stopPropagation();
        router.push(`/admin/quiz/edit/${quiz.id}`);
        setShowDropdown(false);
    };

    // Xử lý click vào nút delete
    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Bạn có chắc chắn muốn xóa Quiz này không?')) {
            console.log('Deleting quiz:', quiz.id);
            // Thêm logic xóa quiz ở đây
        }
        setShowDropdown(false);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group animate-fadeIn">
            {/* Quiz Thumbnail */}
            <div 
                className="relative aspect-[4/3] bg-gradient-to-br from-[#40A0C8] to-[#086280] cursor-pointer"
                onClick={handlePlay}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Quiz Icon */}
                    <div className="w-16 h-16 flex items-center justify-center">
                        <img src={quiz.imageUrl} alt={quiz.title} className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Options Button */}
                <div className="absolute top-2 right-2">
                    <div className="relative">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDropdown(!showDropdown);
                            }}
                            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
                        >
                            <FiMoreVertical className="w-5 h-5 text-white" />
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div 
                                className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100"
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    onClick={handleEdit}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                >
                                    <FiEdit2 className="w-4 h-4" />
                                    <span>Chỉnh sửa</span>
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                    <span>Xóa</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quiz Info */}
            <div className="p-4">
                <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">
                    {quiz.title}
                </h3>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {quiz.questionCount} câu hỏi
                    </p>
                    <p className="text-xs text-gray-400">
                        {new Date(quiz.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                </div>
            </div>

            {/* Quiz Stats */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                    {/* Lượt làm */}
                    <div className="flex-1 px-2 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-300">
                        <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-blue-50 rounded-full">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-4 w-4 text-[#086280]" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                                    />
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Lượt làm</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {quiz.playCount?.toLocaleString('vi-VN') || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-8 w-px bg-gray-200 mx-1"></div>

                    {/* Điểm trung bình */}
                    <div className="flex-1 px-2 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-300">
                        <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-green-50 rounded-full">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-4 w-4 text-green-600" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs  text-gray-500 font-medium">Điểm TB</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {quiz.averageScore ? (
                                        <span className="flex items-center">
                                            {quiz.averageScore.toFixed(1)}
                                            <span className="text-xs text-gray-400 ml-1">/10</span>
                                        </span>
                                    ) : (
                                        'Chưa có'
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuizCard


