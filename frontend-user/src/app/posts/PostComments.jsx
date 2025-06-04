//import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatedDate } from "@/lib/utils";
import userStore from "@/store/userStore";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import { useEffect, useState } from "react";
import PostComment from "./PostComment";
import { usePostStore } from "@/store/usePostStore";
import { useRouter } from "next/navigation";

const PostComments = ({ post, onComment, commentInputRef, onReplyComment, onDeleteComment, onDeleteReply, onLikeComment }) => {
    const [showAllComments, setShowAllComments] = useState(false);
    const [commentText, setCommentText] = useState("")
    const [isCommenting, setIsCommenting] = useState(false);
    const { user } = userStore();
    const router = useRouter();
    const visibleComments = showAllComments ? post?.comments : post?.comments?.slice(0, 2);
    const userPlaceholder = user?.username?.split(" ").map((name) => name[0]).join(""); // tên người dùng viết tắt

    const { handleReplyComment, handleDeleteComment, handleDeleteReply, handleLikeComment } = usePostStore()

    const handleCommentSubmit = async () => {
        if (commentText.trim() && !isCommenting) {
            setIsCommenting(true);
            try {
                await onComment({ text: commentText });
                setCommentText("");
            } catch (error) {
                console.error("Error submitting comment:", error);
            } finally {
                setIsCommenting(false);
            }
        }
    }

    return (
        <div className="mt-2">
            <h3 className="font-semibold mb-3">Bình luận</h3>
            <div className="max-h-60 overflow-y-auto pr-2">
                {/*Danh sách các cmt*/}
                {visibleComments?.map((comment, index) => (
                    <PostComment key={index} comment={comment}
                        onReply={async (replyText) => {
                            if (onReplyComment) {
                                await onReplyComment(post?.id, comment?.id, replyText)
                            } else {
                                await handleReplyComment(post?.id, comment?.id, replyText)
                            }
                        }}
                        onDeleteComment={async () => {
                            if (onDeleteComment) {
                                await onDeleteComment(post?.id, comment?.id)
                            } else {
                                await handleDeleteComment(post?.id, comment?.id)
                            }
                        }}
                        onDeleteReply={async (replyId) => {
                            if (onDeleteReply) {
                                await onDeleteReply(post?.id, comment?.id, replyId)
                            } else {
                                await handleDeleteReply(post?.id, comment?.id, replyId)
                            }
                        }}
                        likeComment={async () => {
                            if (onLikeComment) {
                                await onLikeComment(post?.id, comment?.id)
                            } else {
                                await handleLikeComment(post?.id, comment?.id)
                            }
                        }}
                    />
                ))}
                {/*Tùy chỉnh hiển thị số lượng cmt*/}
                {post?.comments?.length > 2 && (
                    <p
                        className="w-40 mt-2 text-blue-500 cursor-pointer text-[16px] hover:underline"
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
            {/*Viết bình luận*/}
            <div className="flex items-center space-x-2 mt-4">
                <Avatar className='w-8 h-8 cursor-pointer' onClick={() => router.push(`/user-profile/${user?.id}`)}>
                    {user?.profilePicture ? (
                        <AvatarImage src={user?.profilePicture} alt={user?.username} />
                    ) : (
                        <AvatarFallback className="bg-gray-200">{userPlaceholder}</AvatarFallback>
                    )}
                </Avatar>
                <Input
                    placeholder="Viết bình luận..."
                    className="flex-grow cursor-poiter rounded-full h-12"
                    value={commentText}
                    ref={commentInputRef}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                    disabled={isCommenting}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent"
                    onClick={handleCommentSubmit}
                    disabled={isCommenting}
                >
                    <Send className="text-[#086280]" style={{ width: "20px", height: "20px" }} />
                </Button>
            </div>
        </div>
    )
}

export default PostComments;