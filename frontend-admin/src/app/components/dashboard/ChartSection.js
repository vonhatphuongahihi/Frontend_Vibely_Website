'use client'

import React from 'react'
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts'
import dayjs from 'dayjs'

const ChartSection = ({ userStats, postStats, timeRange }) => {
    const userGradient = {
        id: 'userGradient',
        colors: [
            { offset: '0%', color: '#0BB5FF' },
            { offset: '100%', color: '#2F80ED' }
        ]
    }

    const postGradient = {
        id: 'postGradient',
        colors: [
            { offset: '0%', color: '#8E33FF' },
            { offset: '100%', color: '#6A02FF' }
        ]
    }

    const formatDate = (date) => {
        const d = dayjs(date);
        if (!d.isValid()) return "";
        if (timeRange === 'day') {
            return d.format('DD/MM/YYYY');
        } else if (timeRange === 'month') {
            return d.format('MM/YYYY');
        } else if (timeRange === 'year') {
            return d.format('YYYY');
        }
        return date;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const formatted = formatDate(label);
            return (
                <div className="bg-white p-2 shadow-md rounded border border-gray-200">
                    {formatted && <p className="text-gray-700 font-medium">{formatted}</p>}
                    <p className="text-blue-600 font-semibold">{`${payload[0].value} ${payload[0].payload.type === 'user' ? 'người dùng' : 'bài viết'}`}</p>
                </div>
            );
        }
        return null;
    };

    const userStatsWithType = userStats.map(item => ({ ...item, type: 'user', date: formatDate(item.date) }));
    const postStatsWithType = postStats.map(item => ({ ...item, type: 'post', date: formatDate(item.date) }));

    const totalUsers = userStats.reduce((sum, item) => sum + item.count, 0);
    const totalPosts = postStats.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-2xl font-bold mt-2 text-[#2B3674]">{totalUsers} <span className="text-sm font-normal text-gray-500">Người dùng</span></h3>
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={userStatsWithType} margin={{ top: 20, right: 20, left: 0, bottom: 5 }} barSize={24}>
                            <defs>
                                <linearGradient id={userGradient.id} x1="0" y1="0" x2="0" y2="1">
                                    {userGradient.colors.map((color, index) => (
                                        <stop key={index} offset={color.offset} stopColor={color.color} />
                                    ))}
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#A3AED0', fontSize: 12 }}
                                dy={10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                            <Bar dataKey="count" name="Người dùng" radius={[8, 8, 0, 0]} fill={`url(#${userGradient.id})`} animationDuration={1500} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-2xl font-bold mt-2 text-[#2B3674]">{totalPosts} <span className="text-sm font-normal text-gray-500">Bài viết</span></h3>
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={postStatsWithType} margin={{ top: 20, right: 20, left: 0, bottom: 5 }} barSize={24}>
                            <defs>
                                <linearGradient id={postGradient.id} x1="0" y1="0" x2="0" y2="1">
                                    {postGradient.colors.map((color, index) => (
                                        <stop key={index} offset={color.offset} stopColor={color.color} />
                                    ))}
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#A3AED0', fontSize: 12 }}
                                dy={10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                            <Bar dataKey="count" name="Bài viết" radius={[8, 8, 0, 0]} fill={`url(#${postGradient.id})`} animationDuration={1500} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default ChartSection