'use client';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const AchievementPopup = ({ isOpen, onClose, achievements }) => {
    if (!achievements || achievements.length === 0) return null;

    useEffect(() => {
        if (isOpen) {
            // Tạo confetti
            const createConfetti = () => {
                const colors = ['#f0f', '#0ff', '#ff0', '#f00', '#0f0', '#00f'];
                const container = document.getElementById('confetti-container');

                for (let i = 0; i < 100; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.top = -10 + 'px';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                    confetti.style.animationDelay = (Math.random() * 2) + 's';
                    container.appendChild(confetti);

                    setTimeout(() => {
                        confetti.remove();
                    }, 5000);
                }
            };

            createConfetti();
        }
    }, [isOpen]);

    const handleShare = () => {
        toast.success('Đã chia sẻ thành tích!');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    {/* Confetti container */}
                    <div id="confetti-container" className="absolute inset-0 overflow-hidden pointer-events-none"></div>

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="card relative max-w-md w-full"
                    >
                        <div className="shine bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105">
                            <div className="p-8 text-center">
                                {/* Ribbon */}
                                <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-8 bg-red-600 transform rotate-45 translate-y-12 translate-x-8 shadow-lg">
                                        <div className="absolute top-0 left-0 w-8 h-8 bg-red-700 -translate-x-8"></div>
                                        <div className="absolute top-0 right-0 w-8 h-8 bg-red-700 translate-x-8"></div>
                                    </div>
                                </div>

                                {/* Badge */}
                                <div className="badge bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <img
                                        src={achievements[0].details.image}
                                        alt={achievements[0].details.title}
                                        className="w-20 h-20 object-contain"
                                    />
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">Chúc mừng!</h1>
                                <p className="text-xl text-gray-700 mb-6">Bạn đã đạt được thành tích mới</p>

                                {/* Achievement */}
                                <div className="bg-white bg-opacity-80 rounded-xl p-4 mb-6">
                                    <p className="text-3xl font-bold text-yellow-600 mb-1">
                                        {achievements[0].details.icon} {achievements[0].details.title}
                                    </p>
                                    <p className="text-gray-700">{achievements[0].details.description}</p>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={onClose}
                                        className="bg-gradient-to-r from-[#4ACFEF] to-[#476EFF] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                                    >
                                        Tiếp tục hành trình
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                                    >
                                        <i className="fas fa-share-alt mr-2"></i> Chia sẻ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AchievementPopup; 