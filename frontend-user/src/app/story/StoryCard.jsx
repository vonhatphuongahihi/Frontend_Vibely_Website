"use client"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { PlusIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import userStore from '@/store/userStore'
import { usePostStore } from '@/store/usePostStore'
import ShowStoryPreview from './ShowStoryPreview'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const StoryCard = ({ isAddStory, story, onReact, onDelete }) => {
  const [filePreview, setFilePreview] = useState(null)
  const { handleCreateStory } = usePostStore()
  const { user } = userStore() //lấy thông tin người dùng
  const router = useRouter()
  const storyUserPlaceholder = story?.user?.username?.split(" ")?.map((name) => name?.[0])?.join("") || ""; //tên người đăng bài viết tắt
  const userPlaceholder = user?.username?.split(" ")?.map((name) => name?.[0])?.join("") || ""; //tên người dùng viết tắt
  const [isNewStory, setIsNewStory] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  //chọn ảnh từ thiết bị
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  //Hàm chọn file
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setFileType(file.type.startsWith("video") ? "video" : "image")
      setFilePreview(URL.createObjectURL(file))
      setIsNewStory(true)
      setShowPreview(true)
    }
    event.target.value = ''
  }
  //Hàm tạo story
  const handleCreateStoryPost = async () => {
    try {
      setLoading(true)
      const formData = new FormData()
      if (selectedFile) {
        // Kiểm tra kích thước file
        if (selectedFile.size > 90 * 1024 * 1024) {
          toast.error("File quá lớn, vui lòng chọn file nhỏ hơn 90MB")
          setLoading(false)
          return
        }
        formData.append('file', selectedFile)
      } else {
        console.error("Không có file được chọn")
        toast.error("Vui lòng chọn một file để tạo story")
        setLoading(false)
        return
      }

      const result = await handleCreateStory(formData)
      if (result) {
        toast.success("Tạo story thành công")
        resetStoryState()
      }
    } catch (error) {
      console.error("Lỗi khi tạo story:", error)
      toast.error(error.message || "Đã xảy ra lỗi khi tạo story. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }
  // tải nội dung story nếu ko phải đang tạo tin mới
  const handleStoryClick = () => {

    if (!story) {
      console.error("Story không tồn tại");
      return;
    }

    if (!story.mediaUrl) {
      console.error("Story data is missing or incomplete:", story);
      return;
    }

    setFilePreview(story.mediaUrl);
    setFileType(story.mediaType);
    setIsNewStory(false);
    setShowPreview(true);
  }
  //tắt xem story
  const handleClosePreview = () => {
    resetStoryState()
  }
  // reset
  const resetStoryState = () => {
    setShowPreview(false)
    setSelectedFile(null)
    setFilePreview(null)
    setFileType(null)
    setIsNewStory(false)
    setLoading(false) // Thêm reset loading
  }

  //đi đến trang người đăng story
  const handleUserProfile = (e) => {
    e.stopPropagation() // Ngăn chặn event bubbling để không trigger handleStoryClick
    if (story?.user?.id) {
      router.push(`/user-profile/${story.user.id}`)
    }
  }

  // Chỉ log khi cần debug, tránh lỗi khi story là undefined
  // console.log({ isNewStory, user, story })
  
  // Debug reactions
  console.log("🔍 Story reactions:", story?.reactions);
  console.log("🔍 Current user ID:", user?.id);
  console.log("🔍 User reaction:", story?.reactions?.find(react => react?.userId === user?.id));

  return (
    <>
      <Card className="w-40 h-60 relative overflow-hidden group cursor-pointer rounded-xl bg-white border-none"
        onClick={isAddStory ? undefined : handleStoryClick}
      >
        <CardContent className="p-0 h-full">
          {/*Nếu là tạo tin*/}
          {isAddStory ? (
            <div className="w-full h-full flex flex-col">
              <div className="h-3/4 w-full relative border-b">
                <Avatar className="w-full h-full rounded-none">
                  {user?.profilePicture ? (
                    <AvatarImage src={user?.profilePicture} alt={user?.username} className="object-cover" />
                  ) : (
                    <p className='w-full h-full flex justify-center items-center text-4xl'>{userPlaceholder}</p>
                  )}
                </Avatar>
              </div>
              <div className="h-1/4 w-full bg-white flex flex-col items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-8 w-8 rounded-full bg-[#54C8FD] hover:bg-[#33A3F0] new-story"
                  onClick={() => { fileInputRef.current.click() }}
                >
                  <PlusIcon className='h-5 w-5 text-white' />
                </Button>
                <p className="text-xs mt-1 font-semibold">Tạo tin</p>
              </div>
              <input
                type="file"
                accept="image/*, video/*"
                className="hidden input-new-story"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          ) : story ? ( // Kiểm tra story tồn tại trước khi hiển thị
            <>
              {/*Xem tin*/}
              {story.mediaType && story.mediaUrl ? (
                story.mediaType === 'image' ? (
                  <img src={story.mediaUrl} alt={story?.user?.username} className="w-full h-full object-cover" />
                ) : (
                  <video
                    src={story.mediaUrl}
                    alt={story?.user?.username}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <p className="text-gray-500">Không thể hiển thị nội dung</p>
                </div>
              )}
              <div className="absolute top-2 left-2 ring-2 ring-blue-500 rounded-full ">
                <Avatar 
                  className="w-8 h-8 bg-gray-100 cursor-pointer" 
                  onClick={handleUserProfile}
                >
                  {story?.user?.profilePicture ? (
                    <AvatarImage src={story?.user?.profilePicture} alt={story?.user?.username} />
                  ) : (
                    <AvatarFallback>{storyUserPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-semibold truncate">{story?.user?.username}</p>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
      {/*Nội dung tin*/}
      {showPreview && filePreview && (
        <ShowStoryPreview
          file={filePreview}
          fileType={fileType}
          onClose={handleClosePreview}
          onPost={handleCreateStoryPost}
          isNewStory={isNewStory}
          userStory={isNewStory ? user : story?.user} //viet story moi thi username cua minh, nguoc lai dang xem cua ng khac
          avatar={isNewStory ? user?.profilePicture : story?.user?.profilePicture}
          isLoading={loading}
          reactions={story?.reactions}
          reaction={story?.reactions?.find(react => react?.userId === user?.id) ? "tym" : null}
          onReact={(reactType) => onReact && onReact(reactType)}
          onDelete={() => onDelete && onDelete()}
        />
      )}
    </>
  )
}

export default StoryCard
