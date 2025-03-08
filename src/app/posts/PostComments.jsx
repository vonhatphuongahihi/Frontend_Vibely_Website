//import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatedDate } from "@/lib/utils";
import userStore from "@/store/userStore";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import { useEffect, useState } from "react";

const PostComments = ({post, onComment, commentInputRef}) => {
    const [showAllComments, setShowAllComments] = useState(false);
    const [commentText, setCommentText] = useState("")
    const {user} = userStore();
    const visibleComments = showAllComments ? post?.comments : post?.comments?.slice(0, 2);
    const userPlaceholder = user?.username?.split(" ").map((name) => name[0]).join(""); // tên người dùng viết tắt

    const handleCommentSubmit = async() =>{
        if(commentText.trim()){
            //console.log("handleCommentSubmit: ",commentText)
            onComment({text : commentText})
            setCommentText("")
        }
    }
    return (
        <div className="mt-2">
            <h3 className="font-semibold mb-3">Bình luận</h3>
            <div className="max-h-60 overflow-y-auto pr-2">
                {visibleComments?.map((comment, index) => (
                    <div key={index} className="flex items-start space-x-2 mb-2">
                        <Avatar className="h-8 w-8">
                            {comment?.user?.profilePicture ? (
                                <AvatarImage src={comment?.user?.profilePicture} alt={comment?.user?.username}/>
                            ):(
                                <AvatarFallback className="bg-gray-200">{comment?.user?.username?.split(" ").map((name) => name[0]).join("")}</AvatarFallback>
                            )}                         
                        </Avatar>
                        <div className='flex flex-col'>
                            <div className='bg-[#F0F2F5] rounded-lg px-3 py-2'>
                                <p className='font-semibold text-[13px]'>{comment?.user?.username}</p>
                                <p className='text-[15px]'>{comment?.text}</p>
                            </div>
                            <div className='flex items-center text-xs text-gray-500'>
                                <Button variant="ghost" size="sm" className="px-2 hover:underline">Thích</Button>
                                <Button variant="ghost" size="sm" className="px-2 hover:underline">Phản hồi</Button>
                                <span className="px-2 hover:underline">{formatedDate(comment?.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {post?.comments?.length > 2 && (
                    <p
                        className="w-40 mt-2 text-blue-500 cursor-pointer"
                        onClick={() => setShowAllComments(!showAllComments)}
                    >
                        {showAllComments ? (
                            <>Rút gọn <ChevronUp className="ml-2 h-4 w-4" /></>
                        ) : (
                            <>Tất cả bình luận <ChevronDown className="ml-2 h-4 w-4" /></>
                        )}
                    </p>
                )}
            </div>
            <div className="flex items-center space-x-2 mt-4">
                <Avatar className='w-8 h-8'>
                    {user?.profilePicture ? (
                        <AvatarImage src={user?.profilePicture} alt={user?.username}/>
                    ):(
                        <AvatarFallback className="bg-gray-200">{userPlaceholder}</AvatarFallback>
                    )}
                </Avatar>
                <Input
                placeholder="Viết bình luận..."
                className="flex-grow cursor-poiter rounded-full h-12 "
                value={commentText}
                ref={commentInputRef}
                onChange={(e)=> setCommentText(e.target.value)}
                onKeyDown={(e)=> e.key==='Enter'&& handleCommentSubmit()}
                />
                <Button variant="ghost" size="icon" className="hover:bg-transparent"
                    onClick={handleCommentSubmit}
                >
                    <Send className="text-[#086280]" style={{ width: "20px", height: "20px" }}/>
                </Button>
            </div>
        </div>
    )
}

export default PostComments;