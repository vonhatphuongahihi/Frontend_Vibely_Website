import React, { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { MessageCircle, MoreHorizontal, Share2, ThumbsUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PostComments from '@/app/posts/PostComments';
import { PiShareFatBold } from 'react-icons/pi';

export const PostsContent = ({post}) => {
  const [showComments,setShowComments] = useState(false)
  const [isShareDialogOpen,setIsShareDialogOpen] = useState(false)

  const generateSharedLink = () => {
    return `http://localhost:3000/${post?.id}`;
  };
  const handleShare = (platform) => {
    const url = generateSharedLink();
    let shareUrl;
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=}`;
        break;
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?url=}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setIsShareDialogOpen(false);
        return;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
    setIsShareDialogOpen(false);
  };

  
  return (
    <motion.div
      key={post?._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white shadow-md rounded-lg border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 cursor-pointer">
              <Avatar>
                <AvatarImage/>
                <AvatarFallback className="bg-gray-200">P</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  Võ Nhất Phương
                </p>
                <p className="font-sm text-gray-500 text-xs">
                  26-02-2025
                </p>
              </div>
            </div>
            <Button variant="ghost" className="hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <p className="mb-4">{post?.content}</p>
          {post?.mediaUrl && post.mediaType === "image" && (
            <img
              src={post?.mediaUrl}
              alt="post_image"
              className="w-full h-auto rounded-lg mb-2"
            />
          )}
          {post?.mediaUrl && post.mediaType === "video" && (
            <video controls className="w-full h-[500px] rounded-lg mb-3">
              <source src={post?.mediaUrl} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ thẻ video.
            </video>
          )}
          <div className="flex justify-between items-center mb-2">
            <span className="text-[15px] text-gray-500 hover:underline border-gray-400 cursor-pointer">
              2 lượt thích
            </span>
            <div className="flex gap-3">
              <span
                className="text-[15px] text-gray-500 hover:underline border-gray-400 cursor-pointer"
                onClick={() => setShowComments(!showComments)}
              >
                3 bình luận
              </span>
              <span className="text-[15px] text-gray-500 hover:underline border-gray-400 cursor-pointer">
                4 lượt chia sẻ
              </span>
            </div>
          </div>
          <Separator className="mb-1 border-b border-gray-300"/>
          <div className="flex justify-between mb-1">
            <Button
              variant="ghost"
              className={`flex-1 hover:bg-gray-100 text-gray-500 hover:text-gray-500 text-[15px] h-8`}
            >
              <ThumbsUp style={{ width: "20px", height: "20px" }} /> Thích
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 hover:bg-gray-100 text-gray-500 hover:text-gray-500 text-[15px] h-8`}
            >
              <MessageCircle style={{ width: "20px", height: "20px" }} /> Bình luận
            </Button>
            <Dialog
              open={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 hover:bg-gray-100 text-gray-500 hover:text-gray-500 text-[15px] h-8"
                >
                  <PiShareFatBold style={{ width: "20px", height: "20px" }} /> Chia sẻ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Chia sẻ bài viết này</DialogTitle>
                  <DialogDescription>
                    Chọn cách bạn muốn chia sẻ bài viết này
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4 ">
                  <Button
                    className="bg-gray-300 hover:bg-gray-200"
                    onClick={() => handleShare("facebook")}
                  >
                    Chia sẻ trên Facebook
                  </Button>
                  <Button 
                    className="bg-gray-300 hover:bg-gray-200"
                    onClick={() => handleShare("x")}
                  >
                    Chia sẻ trên X
                  </Button>
                  <Button 
                    className="bg-gray-300 hover:bg-gray-200"
                    onClick={() => handleShare("linkedin")}
                  >
                    Chia sẻ trên Linkedin
                  </Button>
                  <Button 
                    className="bg-gray-300 hover:bg-gray-200"
                    onClick={() => handleShare("copy")}
                  >
                    Sao chép liên kết
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Separator className="border-b border-gray-300" />
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PostComments
                  post={post}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
