'use client'

import React, { useState } from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import UserDropdown from '../../components/dashboard/UserDropdown'
import { FiSearch } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import QuizCard from './quiz_card/page'

// Mock data cho quiz
const mockQuizzes = [
    {
        id: 1,
        title: 'Ngữ văn lớp 12',
        questionCount: 2,
        createdAt: '2024-02-20T10:00:00Z',
        playCount: 150,
        averageScore: 8.5,
        imageUrl: '/images/quiz_image.png'
    },
];

const QuizPage = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // Xử lý tìm kiếm tại đây
        console.log('Searching for:', searchQuery);
    };

    const handleCreateQuiz = () => {
        router.push('/admin/add_quiz');
    };

    return (
        <div className="flex w-full flex-row min-h-screen bg-[#F4F7FE]">
            <div className="w-1/5 flex-shrink-0">
                <Sidebar />
            </div>
            
            <div className="w-4/5 flex flex-col">
                {/* Header */}
                <div className="w-full ml-[-20px] py-6 px-6 mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-[#333]">Quiz - Ngân hàng câu hỏi</h1>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                        <UserDropdown />
                    </div>
                </div>

                {/* Content Area */}
                <div className="py-6 px-6 ml-[-20px] mr-[20px]">
                    <div className="max-w-7xl mx-auto">
                        {/* Search and Create Section */}
                        <div className="flex justify-between items-center mb-8">
                            {/* Search Bar */}
                            <div className="flex-grow max-w-3xl">
                                <form onSubmit={handleSearch} className="flex">
                                    <div className="relative flex-grow">
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm..."
                                            className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#086280]"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="ml-2 px-6 py-2 bg-[#086280] text-white rounded-lg hover:bg-[#064d63] transition duration-200"
                                    >
                                        <div className="flex items-center">
                                            <FiSearch className="mr-2" size={20} />
                                            <span>Tìm</span>
                                        </div>
                                    </button>
                                </form>
                            </div>

                            {/* Create Quiz Button */}
                            <button 
                                onClick={handleCreateQuiz}
                                className="ml-4 px-6 py-3 bg-[#086280] text-white rounded-lg flex items-center space-x-2 hover:bg-[#064d63] transition-all duration-300 transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                <span>Tạo Quiz</span>
                            </button>
                        </div>

                        {/* Quiz List Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-4">Danh sách Quiz đã tạo</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {mockQuizzes.map((quiz) => (
                                    <QuizCard key={quiz.id} quiz={quiz} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuizPage
