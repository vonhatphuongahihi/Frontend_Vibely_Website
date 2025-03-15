"use client"
import StorySection from '@/app/story/StorySection'
import { useEffect, useState } from 'react'
import LeftSideBar from '../components/LeftSideBar'
import RightSideBar from '../components/RightSideBar'
import NewPostForm from '../posts/NewPostForm'
import PostCard from '../posts/PostCard'
import { usePostStore } from '@/store/usePostStore'
import toast from 'react-hot-toast'

const Homepage = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false)
  //lấy các bài viết, story, phương thức từ usePostStore
  const {posts,stories, fetchStories, fetchPosts, handleCreatePost, handleCreateStory, handleReactPost, handleCommentPost, handleSharePost } = usePostStore();
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

  return (
    <div className="flex flex-col min-h-screen text-foreground">
        <main className="pt-16 flex flex-1">
          <LeftSideBar />
          <div className="flex-1 px-4 py-6 md:ml-64 lg:mr-64 lg:max-w-2xl xl:max-w-3xl mxx-auto">
            <div className="lg:ml-2 xl:ml-28">
              <StorySection />
              <NewPostForm 
                isPostFormOpen={isPostFormOpen}
                setIsPostFormOpen={setIsPostFormOpen}
              />

              <div className='mt-6 space-y-6'>
                {posts.map(post => (
                  <PostCard key={post._id} 
                  post={post} 
                  reaction = {reactPosts[post?._id]||null} //loại react
                  onReact={(reactType) => handleReact(post?._id, reactType)}  // chức năng react
                  onComment = { async(commentText)=>{  //chức năng comment
                    //console.log("onComment: ",commentText)
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
            </div>
          </div>
          <div className="hidden lg:block lg:w-64 xl:w-80 fixed top-16 right-0 bottom-0 overflow-y-auto p-4">
            <RightSideBar />              
          </div>
        </main>
        
    </div>
  )
}

export default Homepage