'use client'

import React from 'react'
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts'

const ChartSection = ({ userData, postData }) => {
  // Định nghĩa gradient cho biểu đồ người dùng
  const userGradient = {
    id: 'userGradient',
    colors: [
      { offset: '0%', color: '#0BB5FF' },
      { offset: '100%', color: '#2F80ED' }
    ]
  }

  // Định nghĩa gradient cho biểu đồ bài viết
  const postGradient = {
    id: 'postGradient',
    colors: [
      { offset: '0%', color: '#8E33FF' },
      { offset: '100%', color: '#6A02FF' }
    ]
  }

  // Tùy chỉnh tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded border border-gray-200">
          <p className="text-gray-700 font-medium">Tháng {label}</p>
          <p className="text-blue-600 font-semibold">{`${payload[0].value} ${payload[0].name === 'count' ? (payload[0].payload.type === 'user' ? 'người dùng' : 'bài viết') : ''}`}</p>
        </div>
      );
    }
    return null;
  };

  // Thêm thuộc tính type để phân biệt loại dữ liệu
  const userDataWithType = userData.map(item => ({ ...item, type: 'user' }));
  const postDataWithType = postData.map(item => ({ ...item, type: 'post' }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Biểu đồ người dùng theo tháng */}
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="bg-gray-100 text-xs px-2 py-1 rounded">Tháng</span>
            <h3 className="text-2xl font-bold mt-2 text-[#2B3674]">500 <span className="text-sm font-normal text-gray-500">Người dùng</span></h3>
            <span className="text-green-500 text-sm">+2.45%</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={userDataWithType}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              barSize={24}
            >
              <defs>
                <linearGradient id={userGradient.id} x1="0" y1="0" x2="0" y2="1">
                  {userGradient.colors.map((color, index) => (
                    <stop key={index} offset={color.offset} stopColor={color.color} />
                  ))}
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#A3AED0', fontSize: 12 }}
                dy={10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
              <Bar 
                dataKey="count" 
                name="Người dùng"
                radius={[8, 8, 0, 0]} 
                fill={`url(#${userGradient.id})`}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Biểu đồ bài viết theo tháng */}
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="bg-gray-100 text-xs px-2 py-1 rounded">Tháng</span>
            <h3 className="text-2xl font-bold mt-2 text-[#2B3674]">2000 <span className="text-sm font-normal text-gray-500">Bài viết</span></h3>
            <span className="text-green-500 text-sm">+5.45%</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={postDataWithType}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              barSize={24}
            >
              <defs>
                <linearGradient id={postGradient.id} x1="0" y1="0" x2="0" y2="1">
                  {postGradient.colors.map((color, index) => (
                    <stop key={index} offset={color.offset} stopColor={color.color} />
                  ))}
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#A3AED0', fontSize: 12 }}
                dy={10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
              <Bar 
                dataKey="count" 
                name="Bài viết"
                radius={[8, 8, 0, 0]} 
                fill={`url(#${postGradient.id})`}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default ChartSection 