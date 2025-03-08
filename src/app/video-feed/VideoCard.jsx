"use client";
//import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MessageCircle, Send, ThumbsUp } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { PiShareFatBold } from "react-icons/pi";
import VideoComments from "./VideoComments";
import { formatedDate } from "@/lib/utils";
import Image from "next/image";
import userStore from "@/store/userStore";

const VideoCard = ({ post, reaction, onReact, onComment, onShare }) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("")
  const {user} = userStore();
  const [showReactionChooser, setShowReactionChooser] = useState(false);
  const [isChoosing, setIsChoosing] = useState(false);
  const totalReact =
    post?.reactionStats?.like +
    post?.reactionStats?.love +
    post?.reactionStats?.haha +
    post?.reactionStats?.wow +
    post?.reactionStats?.sad +
    post?.reactionStats?.angry;
  const commentInputRef = useRef(null);
  const handleCommentClick = () => {
    setShowComments(!showComments);
    setTimeout(() => {
      commentInputRef?.current?.focus();
    }, 0);
  };
  const handleCommentSubmit = async() =>{
    if(commentText.trim()){
        //console.log("handleCommentSubmit: ",commentText)
        onComment({text : commentText})
        setCommentText("")
    }
}
  const [topReactions, setTopReactions] = useState([]);
  useEffect(() => {
    //đảm bảo object hợp lệ
    if (!post?.reactionStats || typeof post?.reactionStats !== "object") {
      setTopReactions([]);
      return;
    }
    // cập nhật danh sách top reactions
    const filteredReactions = Object.entries(post?.reactionStats)
      .filter(([key, value]) => value > 0) // loại bỏ reaction có số lượng = 0
      .sort((a, b) => b[1] - a[1]) // sắp xếp giảm dần theo số lượng
      .slice(0, 3); // lấy 3 reaction nhiều nhất

    setTopReactions(filteredReactions);
  }, [post?.reactionStats]); // Chạy lại khi reactionStats thay đổi
  const userPostPlaceholder = post?.user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join(""); // tên người đăng bài viết tắt
  const userPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join(""); // tên người dùng viết tắt
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
  const handleReaction = (reaction) => {
    console.log(
      "(PostCard.jsx/handleReaction) Reaction in post that has id",
      post?._id,
      ":",
      reaction
    );
    setIsChoosing(false); //đã chọn được 'cảm xúc'
    onReact(reaction);
    setShowReactionChooser(false); // Ẩn thanh reaction sau khi chọn
  };

  return (
    <motion.div
      key={post?._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 border border-gray-200"
    >
      <div>
        <div className="flex items-center justify-between my-3 px-3 ">
          <div className="flex items-center gap-2">
            <Avatar>
              {post?.user?.profilePicture ? (
                <AvatarImage
                  src={post?.user?.profilePicture}
                  alt={post?.user?.username}
                />
              ) : (
                <AvatarFallback>{userPostPlaceholder}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-semibold">{post?.user?.username}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span className="text-xs">{formatedDate(post?.createdAt)}</span>
          </div>
        </div>
        <div className="relative aspect-video bg-black mb-2">
          {post?.mediaUrl && (
            <video controls className="w-full h-[500px] rounded-lg mb-4">
              <source src={post?.mediaUrl} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ thẻ video
            </video>
          )}
        </div>

        <div className="md:flex justify-between px-2 mb-2 items-center">
          <div className="flex">
            <Button
              onMouseEnter={() => setShowReactionChooser(true)} //mở bảng để mukbang cảm xúc :))
              onMouseLeave={() =>
                setTimeout(() => setShowReactionChooser(false), 500)
              }
              variant="ghost"
              className={`flex-1 hover:bg-gray-100 text-gray-500 hover:text-gray-500 text-[15px] h-8 
                ${
                  reaction == "like"
                    ? "text-blue-600"
                    : reaction == "love"
                    ? "text-red-600"
                    : reaction == "haha" ||
                      reaction == "sad" ||
                      reaction == "wow"
                    ? "text-yellow-400"
                    : reaction == "angry"
                    ? "text-orange-500"
                    : ""
                }
              `}
            >
              {reaction == "like" ? (
                <Image src={"/like.png"} alt="haha" width={20} height={20} />
              ) : reaction == "love" ? (
                <Image src={"/love.png"} alt="haha" width={20} height={20} />
              ) : reaction == "haha" ? (
                <Image src={"/haha.png"} alt="haha" width={20} height={20} />
              ) : reaction == "wow" ? (
                <Image src={"/wow.png"} alt="haha" width={20} height={20} />
              ) : reaction == "sad" ? (
                <Image src={"/sad.png"} alt="haha" width={20} height={20} />
              ) : reaction == "angry" ? (
                <Image src={"/angry.png"} alt="haha" width={20} height={20} />
              ) : (
                <ThumbsUp style={{ width: "20px", height: "20px" }} />
              )}
              {reaction == "love"
                ? "Yêu thích"
                : reaction == "haha"
                ? "Haha"
                : reaction == "wow"
                ? "Wow"
                : reaction == "sad"
                ? "Buồn"
                : reaction == "angry"
                ? "Phẫn nộ"
                : "Thích"}
            </Button>
            {(showReactionChooser || isChoosing) && ( //nếu đang để chuột ở nút mở bảng chọn hoặc trong bảng chọn thì bảng chọn sẽ luôn hiện tránh tình trạng chưa chọn xong đã bị ẩn
              <div
                className={
                  "absolute bottom-10 bg-white flex shadow gap-1 transition-all opacity-100 scale-100 translate-y-0 rounded-2xl"
                }
                onMouseEnter={() => setIsChoosing(true)} //đang chọn
                onMouseLeave={() => setTimeout(() => setIsChoosing(false), 500)}
              >
                <motion.button
                  whileHover={{ scale: 2 }} //phóng to biểu tượng lên
                  className="px-2 py-2"
                  onClick={() => {
                    handleReaction("like");
                  }}
                >
                  <Image
                    src={"/like.gif"}
                    alt="like"
                    width={30}
                    height={30}
                    unoptimized
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 2 }}
                  className="px-2 py-2"
                  onClick={() => {
                    handleReaction("love");
                  }}
                >
                  <Image
                    src={"/love.gif"}
                    alt="love"
                    width={30}
                    height={30}
                    unoptimized
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 2 }}
                  className="px-2 py-2"
                  onClick={() => {
                    handleReaction("haha");
                  }}
                >
                  <Image
                    src={"/haha.gif"}
                    alt="haha"
                    width={30}
                    height={30}
                    unoptimized
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 2 }}
                  className="px-2 py-2"
                  onClick={() => {
                    handleReaction("wow");
                  }}
                >
                  <Image
                    src={"/wow.gif"}
                    alt="wow"
                    width={30}
                    height={30}
                    unoptimized
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 2 }}
                  className="px-2 py-2"
                  onClick={() => {
                    handleReaction("sad");
                  }}
                >
                  <Image
                    src={"/sad.gif"}
                    alt="sad"
                    width={30}
                    height={30}
                    unoptimized
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 2 }}
                  className="px-2 py-2"
                  onClick={() => {
                    handleReaction("angry");
                  }}
                >
                  <Image
                    src={"/angry.gif"}
                    alt="angry"
                    width={30}
                    height={30}
                    unoptimized
                  />
                </motion.button>
              </div>
            )}
            <Button
              variant="ghost"
              className={`flex-1 hover:bg-gray-100 text-gray-500 hover:text-gray-500 text-[15px] h-8`}
              onClick={handleCommentClick}
            >
              <MessageCircle style={{ width: "20px", height: "20px" }} /> Bình
              luận
            </Button>
            <Dialog
              open={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 hover:bg-gray-100 text-gray-500 hover:text-gray-500 text-[15px] h-8"
                  onClick={onShare} //bấm vô là tăng lượt share :))
                >
                  <PiShareFatBold style={{ width: "20px", height: "20px" }} />{" "}
                  Chia sẻ
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
          <div className="flex ml-2 text-gray-500">
            <Button
              variant="ghost"
              size="sm"
              className="font-normal text-[14px] hover:underline px-2"
            >
              {topReactions.map((reaction) => (
                <Image
                  src={`/${reaction[0]}.png`}
                  alt={`${reaction[0]}`}
                  width={18}
                  height={18}
                  key={reaction[0]}
                />
              ))}
              {
                totalReact > 0 &&
                  (totalReact > 1000000
                    ? totalReact / 1000000 + "M" //Nếu tổng lượt react >1tr thì hiển thị kiểu 1M, 2M,...
                    : totalReact > 1000
                    ? totalReact / 1000 + "k"
                    : totalReact) //Nếu tổng lượt react >1000 thì hiển thị kiểu 1k, 2k,...
              }
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="font-normal text-[14px] hover:underline px-2"
              onClick={() => setShowComments(!showComments)}
            >
              {post?.commentCount > 0 &&
                (post?.commentCount > 1000000
                  ? post?.commentCount / 1000000 + " triệu" //Nếu tổng lượt react >1tr thì hiển thị kiểu 1 triệu, 2 triệu,...
                  : post?.commentCount > 1000
                  ? post?.commentCount / 1000 + " ngàn"
                  : post?.commentCount + //Nếu tổng lượt react >1000 thì hiển thị kiểu 1 ngàn, 2 ngàn,...
                    " bình luận")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="font-normal text-[14px] hover:underline px-2"
            >
              {post?.shareCount > 0 &&
                (post?.shareCount > 1000000
                  ? post?.shareCount / 1000000 + " triệu" //Nếu tổng lượt react >1tr thì hiển thị kiểu 1 triệu, 2 triệu,...
                  : post?.shareCount > 1000
                  ? post?.shareCount / 1000 + " ngàn"
                  : post?.shareCount + //Nếu tổng lượt react >1000 thì hiển thị kiểu 1 ngàn, 2 ngàn,...
                    " lượt chia sẻ")}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Separator className="border-b border-gray-300" />
              <ScrollArea className="h-[300px] w-full rounded-md px-4 py-2">
                <VideoComments comments={post?.comments} />
              </ScrollArea>
              <div className="flex items-center mt-4 p-2 border-t border-gray-300">
                <Avatar className="h-10 w-10 rounded-full mr-3 cursor-pointer">
                  {user?.profilePicture ? (
                    <AvatarImage
                      src={user?.profilePicture}
                      alt={user?.username}
                    />
                  ) : (
                    <AvatarFallback className="bg-gray-200">
                      {userPlaceholder}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Input
                  className="flex-1 mr-2 bg-[#F0F2F5] rounded-xl border-none"
                  placeholder="Viết bình luận..."
                value={commentText}
                ref={commentInputRef}
                onChange={(e)=> setCommentText(e.target.value)}
                onKeyDown={(e)=> e.key==='Enter'&& handleCommentSubmit()}
                />
                <Button variant="ghost" size="icon" className="hover:bg-gray-100"
                    onClick={handleCommentSubmit}
                >
                    <Send className="text-[#086280]" style={{ width: "20px", height: "20px" }}/>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default VideoCard;
