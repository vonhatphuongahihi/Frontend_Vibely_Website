"use client";
//import React from "react";
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import LeftSideBar from "../components/LeftSideBar";
import VideoCard from "./VideoCard";
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import { usePostStore } from '@/store/usePostStore';

const Page = () => {
    const [isPostFormOpen, setIsPostFormOpen] = useState(false)
    //lấy các bài viết, story, phương thức từ usePostStore
    const {posts,stories, fetchStories, fetchPosts, handleCreatePost, handleCreateStory, handleReactPost, handleCommentPost, handleSharePost } = usePostStore() ;
    const route = useRouter()
    useEffect(()=>{
      fetchPosts()  //tải các bài viết
    },[fetchPosts])
    const[reactPosts, setReactPosts] = useState(new Set()); // danh sách những bài viết mà người dùng đã react
    useEffect(()=>{
      const saveReacts = localStorage.getItem('reactPosts')
      if(saveReacts){
        setReactPosts(JSON.parse(saveReacts))
      }
    },[])
    const handleReact = async(postId, reactType)=>{
      console.log("reactType: ", reactType)
      const updatedReactPosts = { ...reactPosts }; 
      if(updatedReactPosts && updatedReactPosts[postId]=== reactType){ 
        delete updatedReactPosts[postId]; // hủy react nếu nhấn lại
      }
      else{ 
        updatedReactPosts[postId] = reactType; // cập nhật cảm xúc mới
      }
      //lưu danh sách mới vào biến
      setReactPosts(updatedReactPosts)
      //lưu vào cục bộ
      localStorage.setItem('reactPosts', JSON.stringify(updatedReactPosts));
  
      try {
        await handleReactPost(postId, updatedReactPosts[postId] || null) //api
        await fetchPosts()// tải lại danh sách
      } catch (error) {
        console.log(error)
        toast.error("Đã xảy ra lỗi khi bày tỏ cảm xúc với bài viết này. Vui lòng thử lại.")
      }
    }

    const handleBack = ()=>{
        route.push('/')
    }
    const videoPost = posts?.filter(post => post.mediaType === "video")

    return (
        <div className='mt-12 min-h-screen'>
            <LeftSideBar/>
            <main className='ml-0 md:ml-64 p-6'>
                <Button variant="ghost" className="mb-4"
                onClick={handleBack}
                >
                    <ChevronLeft className='mr-2 h-4 w-4'/> Quay lại bảng tin
                </Button>
                <div className='max-w-3xl mx-auto'>
                    {videoPost.map((post) => (
                        <VideoCard
                            key={post?._id}
                            post={post}
                            reaction = {reactPosts[post?._id]||null} //loại react
                            onReact={(reactType) => handleReact(post?._id, reactType)}  // chức năng react
                            onComment = { async(commentText)=>{  //chức năng comment
                    
                            await handleCommentPost(post?._id, commentText)
                            await fetchPosts()
                            }}
                            onShare = { async()=>{  //chức năng share
                            await handleSharePost(post?._id)
                            await fetchPosts()
                  }}
                        />
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Page