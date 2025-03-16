"use client";
import Sidebar from '@/app/components/sidebar/Sidebar'
import React, { useState } from 'react'
import FilterBar from '@/app/components/FilterBar'
import PostItem from '@/app/components/posts/PostItem'

const dummyPosts = [
    {
        id: 1,
        author: "HacThienCau",
        avatar: "/images/joo_jae_yi.jpg",
        time: "1 phút trước",
        content: "JaeYi",
        image: "/images/joo_jae_yi.jpg",
        reactions: {
            total: 2,
            like: 1,
            heart: 1,
            laugh: 0,
            wow: 0,
            sad: 0,
            angry: 0
        },
        comments: 1,
        shares: 0,
    },
    {
        id: 2,
        author: "Yoo Jae Yi",
        avatar: "/images/joo_jae_yi.jpg",
        time: "9 ngày trước",
        content: "Cảm giác sau khi làm xong code cái react và cmt 😆",
        image: "/images/joo_jae_yi.jpg",
        reactions: {
            total: 4,
            like: 2,
            heart: 2,
            laugh: 0,
            wow: 0,
            sad: 0,
            angry: 0
        },
        comments: 3,
        shares: 12,
    },
];

const Posts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("newest");

    const filteredPosts = dummyPosts
        .filter((post) => post.content.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            switch (filter) {
                case "likes":
                    return b.likes - a.likes;
                case "comments":
                    return b.comments - a.comments;
                case "shares":
                    return b.shares - a.shares;
                default:
                    return 0;
            }
        });

    return (
        <div className="flex flex-row w-full min-h-screen bg-[#F4F7FE]">
            <div className="w-1/5 flex-shrink-0">
                <Sidebar />
            </div>
            <div className="w-4/5 ml-[-20px] py-6 mr-16 overflow-y-auto">

                <h2 className='font-semibold mb-6 text-[18px] text-[#2B3674]'>Quản lý bài viết</h2>

                <FilterBar onSearch={setSearchTerm} onFilterChange={setFilter} />

                <div className="space-y-4">
                    {filteredPosts.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Posts;