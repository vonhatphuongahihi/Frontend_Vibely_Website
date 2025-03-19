"use client";
//import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatedDate } from '@/lib/utils';

const VideoComments = ({comments}) => {
    return (
        <div>
            <h3 className="font-semibold mb-3">Bình luận</h3>
            <div className="pr-2">
                {comments?.map((comment,index)=>(
                    <div key={comment?._id} className='flex items-start space-x-2 mb-4'>
                        <Avatar className="h-8 w-8 cursor-pointer">
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
            </div>
        </div>
    )
}

export default VideoComments