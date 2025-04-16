'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/sidebar/Sidebar'
import UserDropdown from '../../components/dashboard/UserDropdown'

const CreateQuizPage = () => {
    const router = useRouter();
    const [quizTitle, setQuizTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [questions, setQuestions] = useState([{
        question: '',
        imageUrl: '',
        choices: {
            A: '',
            B: '',
            C: '',
            D: ''
        },
        correctAnswer: ''
    }]);

    const handleSave = () => {
        // Hiển thị thông báo thành công
        alert('Quiz đã được tạo thành công!');
        
        // Chuyển hướng về trang danh sách quiz
        router.push('/admin/quiz/quiz_card');
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, {
            question: '',
            imageUrl: '',
            choices: {
                A: '',
                B: '',
                C: '',
                D: ''
            },
            correctAnswer: ''
        }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        if (field.startsWith('choice')) {
            const choice = field.split('.')[1];
            newQuestions[index].choices[choice] = value;
        } else {
            newQuestions[index][field] = value;
        }
        setQuestions(newQuestions);
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
                <div className="px-6 ml-[-20px] mr-[20px]">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-lg shadow-sm p-6 animate-fadeIn">
                            {/* Quiz Title Section */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-[#40A0C8] text-white rounded-full flex items-center justify-center mr-3">
                                        1
                                    </div>
                                    <h2 className="text-lg font-bold">Quiz title:</h2>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nhập tiêu đề Quiz"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A0C8]"
                                    value={quizTitle}
                                    onChange={(e) => setQuizTitle(e.target.value)}
                                />
                            </div>

                            {/* Image URL Section */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-[#40A0C8] text-white rounded-full flex items-center justify-center mr-3">
                                        2
                                    </div>
                                    <h2 className="text-lg font-bold">Image URL:</h2>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nhập đường dẫn hình ảnh"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A0C8]"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            </div>

                            {/* Quiz Questions Section */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-[#40A0C8] text-white rounded-full flex items-center justify-center mr-3">
                                        3
                                    </div>
                                    <h2 className="text-lg font-bold">Quiz Questions:</h2>
                                </div>

                                {questions.map((question, index) => (
                                    <div key={index} className="mb-8 p-6 border border-gray-200 rounded-lg">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Question {index + 1}:
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập câu hỏi"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A0C8]"
                                                value={question.question}
                                                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Image URL:
                                            </label>
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Nhập đường dẫn hình ảnh cho câu hỏi"
                                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A0C8]"
                                                    value={question.imageUrl}
                                                    onChange={(e) => handleQuestionChange(index, 'imageUrl', e.target.value)}
                                                />
                                                {question.imageUrl && (
                                                    <div className="ml-2 w-16 h-16 border rounded-lg overflow-hidden">
                                                        <img 
                                                            src={question.imageUrl} 
                                                            alt={`Question ${index + 1} image`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder-image.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Choices:
                                            </label>
                                            {Object.keys(question.choices).map((choice) => (
                                                <div key={choice} className="mb-2">
                                                    <div className="flex items-center">
                                                        <span className="w-8">{choice}:</span>
                                                        <input
                                                            type="text"
                                                            placeholder={`Nhập câu trả lời ${choice}`}
                                                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A0C8]"
                                                            value={question.choices[choice]}
                                                            onChange={(e) => handleQuestionChange(index, `choice.${choice}`, e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Correct Answer:
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập đáp án"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A0C8]"
                                                value={question.correctAnswer}
                                                onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={handleAddQuestion}
                                    className="w-full py-3 bg-[#086280] text-white rounded-lg hover:bg-[#3590B5] transition-colors duration-200"
                                >
                                    Thêm câu hỏi
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end mt-6 space-x-4 mb-6">
                            <button
                                onClick={() => router.push('/admin/quiz')}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave} 
                                className="px-6 py-3 bg-[#086280] text-white rounded-lg hover:bg-[#064d63] transition-colors duration-200 flex items-center space-x-2"
                            >
                                <span>Lưu</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateQuizPage
