import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import userStore from '@/store/userStore'
import { Heart, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const ShowStoryPreview = ({ file, fileType, onClose, onPost, isNewStory, userStory, avatar, isLoading, onReact, reaction, reactions, onDelete }) => {
    const router = useRouter()
    // Chỉ log khi cần debug
    // console.log({ userStory })

    // Đảm bảo userStory không null trước khi truy cập thuộc tính
    const userPlaceholder = userStory?.username?.split(" ")?.map((name) => name?.[0])?.join("") || ""; //tên người dùng viết tắt

    //xóa tin (dành cho người đăng tin)
    const handleDeleteStory = () => {
        if (onDelete) onDelete();
        onClose();
    }

    //đi đến trang người đăng story
    const handleUserProfile = (e) => {
        e.stopPropagation() // Ngăn chặn event bubbling
        if (userStory?.id) {
            router.push(`/user-profile/${userStory.id}`)
        }
    }

    const { user } = userStore()
    // console.log({ id: user?.id, userStoryId: userStory?.id })

    return (
        <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50'>
            <div className='relative w-full max-w-md h-[70vh] flex flex-col bg-white rounded-lg overflow-hidden'>
                {/*Nút đóng*/}
                <Button className='absolute top-4 right-4 z-10 text-gray-600 hover:bg-gray-200'
                    variant='ghost'
                    onClick={onClose}
                >
                    <X className='h-6 w-6' />
                </Button>
                {/*Avt+username người đăng*/}
                <div className='absolute top-4 left-4 z-10 flex items-center'>
                    <Avatar
                        className='w-10 h-10 mr-2 cursor-pointer'
                        onClick={handleUserProfile}
                    >
                        {avatar ? (
                            <AvatarImage src={avatar} alt={userStory?.username || ""} />
                        ) : (
                            <AvatarFallback>{userPlaceholder}</AvatarFallback>
                        )}
                    </Avatar>
                    <span
                        className='text-gray-700 font-semibold cursor-pointer hover:text-gray-900'
                        onClick={handleUserProfile}
                    >
                        {userStory?.username || ""}
                    </span>
                </div>
                {/*file phuong tien*/}
                <div className='flex flex-grow items-center justify-center bg-gray-100'>
                    {fileType === 'image' ? (
                        <img
                            src={file}
                            alt='story_preview'
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <video
                            src={file}
                            controls
                            autoPlay
                            alt='story_preview'
                            className="max-w-full max-h-full object-contain"
                        />
                    )}
                </div>
                {/*Nút đăng*/}
                {isNewStory && (
                    <div className='absolute bottom-4 right-2 transform -translate-x-1/2'>
                        <Button className='bg-[#086280] hover:bg-[#23CAF1] text-white'
                            onClick={onPost}
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang đăng..." : "Đăng"}
                        </Button>
                    </div>
                )}
                {/*tym*/}
                {!isNewStory && user && userStory && (
                    <div className='absolute bottom-4 left-4 z-10'>
                        {/*Chỉ người đăng tin mới xem được số lượt tim và có thể xóa story*/}
                        {user?.id === userStory?.id && (
                            <div className='flex flex-col gap-2'>
                                <div className='flex items-center gap-2'>
                                    <Image
                                        src="/love.png"
                                        alt="loved"
                                        width={24}
                                        height={24}
                                        style={{ width: 'auto', height: 'auto' }}
                                    />
                                    <p className='text-lg font-semibold text-white'>{reactions?.length || 0}</p>
                                </div>
                                <Button
                                    className='bg-red-500 hover:bg-red-600 text-white'
                                    variant="ghost"
                                    onClick={() => handleDeleteStory()}
                                >
                                    Xóa story
                                </Button>
                            </div>
                        )}
                        {/*Nút thả tim cho người khác xem story*/}
                        {user?.id !== userStory?.id && (
                            <Button
                                variant="ghost"
                                className={`rounded-full p-2 ${reaction ? 'bg-red-100' : 'bg-gray-100'} hover:bg-red-100`}
                                onClick={() => onReact && onReact("tym")}
                            >
                                <Heart className={`h-6 w-6 ${reaction ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ShowStoryPreview