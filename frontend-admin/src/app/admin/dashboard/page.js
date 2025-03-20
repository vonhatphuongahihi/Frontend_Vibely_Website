import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import ChartSection from '../../components/dashboard/ChartSection'
import UserDropdown from '../../components/dashboard/UserDropdown'
import Image from 'next/image'

const Dashboard = () => {
    // Dữ liệu mẫu cho biểu đồ
    const userData = [
        { month: '01', count: 30 }, { month: '02', count: 20 }, { month: '03', count: 45 },
        { month: '04', count: 28 }, { month: '05', count: 38 }, { month: '06', count: 52 },
        { month: '07', count: 18 }, { month: '08', count: 32 }, { month: '09', count: 24 },
        { month: '10', count: 42 }, { month: '11', count: 28 }, { month: '12', count: 36 }
    ]

    const postData = [
        { month: '01', count: 120 }, { month: '02', count: 90 }, { month: '03', count: 170 },
        { month: '04', count: 110 }, { month: '05', count: 130 }, { month: '06', count: 180 },
        { month: '07', count: 80 }, { month: '08', count: 140 }, { month: '09', count: 100 },
        { month: '10', count: 160 }, { month: '11', count: 90 }, { month: '12', count: 130 }
    ]

    return (
        <div className="flex w-full flex-row min-h-screen bg-[#F4F7FE]">
            {/* Sidebar */}
            <div className="w-1/5 flex-shrink-0">
                <Sidebar />
            </div>
            
            {/* Main Content */}
            <div className="w-4/5 ml-[-20px] py-6 overflow-y-auto">
                {/* Header with User Dropdown */}
                <div className="flex justify-between items-center mb-6 px-6">
                    <h1 className="text-2xl font-semibold text-[#333]">Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        {/* Notifications icon */}
                        <button className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                        {/* User dropdown */}
                        <UserDropdown />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-6">
                    {/* Tổng số người dùng */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center">
                            <div>
                                <Image src="/images/dashboard/users.png" alt="user" width={50} height={50} />
                            </div>
                            <div className='ml-3'>
                                <p className="text-gray-500 text-sm">Tổng số người dùng</p>
                                <h2 className="text-2xl font-bold text-[#2B3674]">500</h2>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tổng số bài viết */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center">
                            <div>
                                <Image src="/images/dashboard/posts.png" alt="posts" width={50} height={50} />
                            </div>
                            <div className='ml-3'>
                                <p className="text-gray-500 text-sm">Tổng số bài viết</p>
                                <h2 className="text-2xl font-bold text-[#2B3674]">2000</h2>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tổng số tài liệu */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center">
                            <div>
                                <Image src="/images/dashboard/documents.png" alt="documents" width={50} height={50} />
                            </div>
                            <div className='ml-3'>
                                <p className="text-gray-500 text-sm">Tổng số tài liệu</p>
                                <h2 className="text-2xl font-bold text-[#2B3674]">50</h2>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tổng số thắc mắc */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center">
                            <div>
                                <Image src="/images/dashboard/questions.png" alt="questions" width={50} height={50} />
                            </div>
                            <div className='ml-3'>
                                <p className="text-gray-500 text-sm">Tổng số thắc mắc</p>
                                <h2 className="text-2xl font-bold text-[#2B3674]">20</h2>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Biểu đồ */}
                <div className="px-6">
                    <ChartSection userData={userData} postData={postData} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
