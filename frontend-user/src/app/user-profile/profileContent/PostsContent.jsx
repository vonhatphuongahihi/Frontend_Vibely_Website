import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, MoreHorizontal, ThumbsUp, X } from 'lucide-react'
import { QRCodeCanvas } from "qrcode.react"
import { useEffect, useRef, useState } from 'react'
import { AiOutlineCopy, AiOutlineDelete } from "react-icons/ai"
import { FaFacebook, FaLinkedin } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { PiShareFatBold } from "react-icons/pi"

import PostComments from '@/app/posts/PostComments'
import { formatedDate } from '@/lib/utils'
import userStore from '@/store/userStore'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export const PostsContent = ({ post, onReact, onComment, onShare, onDelete }) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showReactionChooser, setShowReactionChooser] = useState(false)
  const [isChoosing, setIsChoosing] = useState(false)
  const totalReact = post?.reactionStats?.like + post?.reactionStats?.love + post?.reactionStats?.haha + post?.reactionStats?.wow + post?.reactionStats?.sad + post?.reactionStats?.angry
  const commentInputRef = useRef(null)
  const router = useRouter()

  const { user } = userStore()
  const [reaction, setReaction] = useState(null)

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const dropdownRef = useRef(null);
  const popupRef = useRef(null);
  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserProfile = () => {
    router.push(`/user-profile/${post?.user?.id}`)
  }

  const handleSinglePost = () => {
    router.push(`/posts/${post?.id}`)
  }

  const handleCommentClick = () => {
    setShowComments(!showComments)
    setTimeout(() => {
      commentInputRef?.current?.focus();
    }, 0)
  }
  const userPostPlaceholder = post?.user?.username?.split(" ").map((name) => name[0]).join(""); // tên người đăng bài viết tắt
  const [topReactions, setTopReactions] = useState([]);
  const [reactionUserGroups, setReactionUserGroups] = useState({}); // Lưu danh sách user theo từng reaction
  const [currentReactionDetail, setCurrentReaction] = useState("like"); //reaction hiện tại của bảng chi tiết, mặc định là like
  useEffect(() => {
    // Kiểm tra post và user trước khi set reaction
    if (!post || !user) {
      setReaction(null);
      setTopReactions([]);
      setReactionUserGroups({});
      return;
    }

    // Set current user's reaction từ post.reactions
    if (post.reactions && post.reactions.length > 0) {
      const userReaction = post.reactions.find(react => {
        // Xử lý cả trường hợp react.user.id và react.userId từ backend
        const reactUserId = react?.user?.id || react?.userId;
        return reactUserId === user.id;
      });
      setReaction(userReaction ? userReaction.type : null);
    } else {
      setReaction(null);
    }

    // Process reaction stats để tính top reactions
    if (!post.reactionStats || typeof post.reactionStats !== "object") {
      setTopReactions([]);
      setReactionUserGroups({});
      return;
    }

    // Tính top reactions từ reactionStats để cập nhật ngay
    const reactionStatsArray = Object.entries(post.reactionStats)
      .filter(([type, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    setTopReactions(reactionStatsArray.map(([type]) => type));

    // Group reactions by type để hiển thị danh sách user
    if (post.reactions && post.reactions.length > 0) {
      const reactionGroups = post.reactions.reduce((acc, react) => {
        if (!acc[react.type]) {
          acc[react.type] = [];
        }
        // Xử lý user object: có thể là react.user hoặc cần tạo từ react.userId
        const userObj = react.user || { id: react.userId };
        if (userObj) {
          acc[react.type].push(userObj);
        }
        return acc;
      }, {});
      setReactionUserGroups(reactionGroups);
    } else {
      setReactionUserGroups({});
    }
  }, [post?.id, user?.id, post?.reactionStats, post?.reactions]); // Thêm post?.reactions vào dependencies

  const generateSharedLink = () => {
    return `https://vibely-study-social-website.vercel.app/posts/${post?.id}`;
  };
  const handleShare = (platform) => {
    const url = generateSharedLink();
    let shareUrl;
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setIsShareDialogOpen(false);
        onShare()
        return;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
    onShare()
    setIsShareDialogOpen(false);
  };
  const handleReaction = (reaction) => {
    setIsChoosing(false)  //đã chọn được 'cảm xúc'
    onReact(reaction);
    setShowReactionChooser(false); // Ẩn thanh reaction sau khi chọn
  };

  //mở bảng chi tiết reaction
  const [reactDetailOpen, setReactDetailOpen] = useState(false)
  const handleReactionDetail = () => {
    setReactDetailOpen(true);
  }

  return (
    <motion.div
      key={post?.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white shadow-md rounded-lg border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4 relative">
            <div className="flex items-center space-x-3 cursor-pointer">
              <Avatar>
                {post?.user?.profilePicture ? (
                  <AvatarImage src={post?.user?.profilePicture} alt={post?.user?.username} />
                ) : (
                  <AvatarFallback>{userPostPlaceholder}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-semibold" onClick={handleUserProfile}>
                  {post?.user?.username} {/*tên người đăng bài*/}
                </p>
                <p className="font-sm text-gray-500 text-xs" onClick={handleSinglePost}>
                  {formatedDate(post?.createdAt)} {/*thời gian đăng bài*/}
                </p>
              </div>
            </div>
            <Button onClick={() => setDropdownOpen(!dropdownOpen)} variant="ghost"
              className={`hover:bg-gray-100 ${post?.user?.id === user?.id ? "flex" : "hidden"}`}  //chủ bài viết mới có option này
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            {dropdownOpen && (
              <div className="absolute top-10 right-4 w-40 bg-white border border-gray-300 rounded-md shadow-lg" ref={dropdownRef}>
                <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-200 flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setDropdownOpen(false)
                    setPopupOpen(true)
                  }}
                >
                  <AiOutlineDelete style={{ width: "20px", height: "20px" }} />
                  Xóa bài viết
                </button>
              </div>
            )}
          </div>

          {popupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg" ref={popupRef}>
                <h2 className="text-lg font-bold mb-4">Bạn có chắc chắn muốn xóa?</h2>
                <p className="text-md mb-4">Hành động này không thể hoàn tác và toàn bộ nội dung của bài viết sẽ bị xóa bỏ.</p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setPopupOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      setPopupOpen(false);
                      onDelete();
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          )}
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

          {/*Bảng hiện danh sách các người dùng đã bày tỏ cảm xúc - tùy theo cảm xúc mà phân loại và hiển thị*/}
          {reactDetailOpen && currentReactionDetail && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
              <div className="bg-white p-6 h-96 rounded-lg shadow-lg flex flex-col">
                <div className='flex items-center justify-between gap-20 md:gap-40 pb-5'>
                  <div className='flex md:gap-10 h-10 justify-center items-center'>
                    <motion.button whileHover={{ scale: 1.2 }}  //phóng to biểu tượng lên
                      className={`px-2 py-2 ${currentReactionDetail === "like" ? "border-b-2 border-[#086280]" : ""} `}
                      onClick={() => {
                        setCurrentReaction("like")
                      }}>
                      <Image src={"/like.png"} alt="like" width={30} height={30} unoptimized />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.2 }}
                      className={`px-2 py-2 ${currentReactionDetail === "love" ? "border-b-2 border-[#086280]" : ""} `}
                      onClick={() => {
                        setCurrentReaction("love")
                      }}>
                      <Image src={"/love.png"} alt="love" width={30} height={30} unoptimized />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.2 }}
                      className={`px-2 py-2 ${currentReactionDetail === "haha" ? "border-b-2 border-[#086280]" : ""} `}
                      onClick={() => {
                        setCurrentReaction("haha")
                      }}>
                      <Image src={"/haha.png"} alt="haha" width={30} height={30} unoptimized />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.2 }}
                      className={`px-2 py-2 ${currentReactionDetail === "wow" ? "border-b-2 border-[#086280]" : ""} `}
                      onClick={() => {
                        setCurrentReaction("wow")
                      }}>
                      <Image src={"/wow.png"} alt="wow" width={30} height={30} unoptimized />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.2 }}
                      className={`px-2 py-2 ${currentReactionDetail === "sad" ? "border-b-2 border-[#086280]" : ""} `}
                      onClick={() => {
                        setCurrentReaction("sad")
                      }}>
                      <Image src={"/sad.png"} alt="sad" width={30} height={30} unoptimized />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.2 }}
                      className={`px-2 py-2 ${currentReactionDetail === "angry" ? "border-b-2 border-[#086280]" : ""} `}
                      onClick={() => {
                        setCurrentReaction("angry")
                      }}>
                      <Image src={"/angry.png"} alt="angry" width={30} height={30} unoptimized />
                    </motion.button>
                  </div>
                  {/*Nút đóng bảng*/}
                  <Button variant="ghost" className="hover:bg-gray-200" onClick={() => {
                    setReactDetailOpen(false)
                    setCurrentReaction("like")
                  }}>
                    <X style={{ width: "20px", height: "20px" }} />
                  </Button>
                </div>
                {/*Danh sách người dùng*/}
                {reactionUserGroups?.[currentReactionDetail]?.map((user, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-2 cursor-pointer mb-2 "
                      onClick={() => {
                        router.push(`/user-profile/${user?.id}`);
                        setReactDetailOpen(false)
                      }}
                    >
                      <Avatar className="h-10 w-10 ml-2">
                        {user?.profilePicture ? (
                          <AvatarImage
                            src={user?.profilePicture}
                            alt={user?.username || 'User'}
                          />
                        ) : (
                          <AvatarFallback>
                            {user?.username ? 
                              user.username.split(" ").map((name) => name[0]).join("") : 
                              user?.id?.slice(0, 2).toUpperCase() || "U"
                            }
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <p className="text-sm font-medium leading-none">
                        {user?.username || `User ${user?.id?.slice(0, 8) || 'Unknown'}`}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/*Top 3 cảm xúc nhiều nhất + tính tổng số lượt bày tỏ*/}
          <div className="flex justify-between items-center mb-2">
            <span className="text-[15px] text-gray-500 hover:underline border-gray-400 cursor-pointer flex"
              onClick={() => { handleReactionDetail() }}>
              {
                topReactions.map((reaction) => (
                  <Image src={`/${reaction}.png`} alt={reaction} width={18} height={18} key={reaction} />
                ))
              }
              &nbsp;
              {
                totalReact > 0 && (
                  totalReact > 1000000 ? totalReact / 1000000 + "M" :  //Nếu tổng lượt react >1tr thì hiển thị kiểu 1M, 2M,...
                    totalReact > 1000 ? totalReact / 1000 + "k" : totalReact  //Nếu tổng lượt react >1000 thì hiển thị kiểu 1k, 2k,...
                )}
            </span>
            <div className="flex gap-3">
              <span
                className="text-[15px] text-gray-500 hover:underline border-gray-400 cursor-pointer"
                onClick={() => setShowComments(!showComments)}
              >
                {
                  post?.commentCount > 0 && (
                    post?.commentCount > 1000000 ? post?.commentCount / 1000000 + " triệu" :  //Nếu tổng lượt react >1tr thì hiển thị kiểu 1 triệu, 2 triệu,...
                      post?.commentCount > 1000 ? post?.commentCount / 1000 + " ngàn" : post?.commentCount  //Nếu tổng lượt react >1000 thì hiển thị kiểu 1 ngàn, 2 ngàn,...
                        + " bình luận")}
              </span>
              <span className="text-[15px] text-gray-500 hover:underline border-gray-400 cursor-pointer">
                {
                  post?.shareCount > 0 && (
                    post?.shareCount > 1000000 ? post?.shareCount / 1000000 + " triệu" :  //Nếu tổng lượt react >1tr thì hiển thị kiểu 1 triệu, 2 triệu,...
                      post?.shareCount > 1000 ? post?.shareCount / 1000 + " ngàn" : post?.shareCount  //Nếu tổng lượt react >1000 thì hiển thị kiểu 1 ngàn, 2 ngàn,...
                        + " lượt chia sẻ")}
              </span>
            </div>
          </div>
          <Separator className="mb-1 border-b border-gray-300" />
          <div className="flex justify-between mb-1 relative" >
            <Button
              onMouseEnter={() => setShowReactionChooser(true)} //mở bảng để mukbang cảm xúc :))
              onMouseLeave={() => setTimeout(() => setShowReactionChooser(false), 500)}
              variant="ghost"
              className={`flex-1 hover:bg-gray-100 text-gray-500 hover:text-gray-500 text-[15px] h-8 
                ${reaction == "like" ? 'text-blue-600'
                  : reaction == "love" ? "text-red-600"
                    : reaction == "haha" || reaction == "sad" || reaction == "wow" ? "text-yellow-400"
                      : reaction == "angry" ? "text-orange-500" : ""}
              `}
            >
              {reaction == "like" ? <Image src={"/like.png"} alt="haha" width={24} height={24} />
                : reaction == "love" ? <Image src={"/love.png"} alt="haha" width={24} height={24} />
                  : reaction == "haha" ? <Image src={"/haha.png"} alt="haha" width={24} height={24} />
                    : reaction == "wow" ? <Image src={"/wow.png"} alt="haha" width={24} height={24} />
                      : reaction == "sad" ? <Image src={"/sad.png"} alt="haha" width={24} height={24} />
                        : reaction == "angry" ? <Image src={"/angry.png"} alt="haha" width={24} height={24} />
                          : <ThumbsUp style={{ width: "20px", height: "20px" }} />}
              {reaction == "love" ? "Yêu thích"
                : reaction == "haha" ? "Haha"
                  : reaction == "wow" ? "Wow"
                    : reaction == "sad" ? "Buồn"
                      : reaction == "angry" ? "Phẫn nộ"
                        : "Thích"}
            </Button>
            {(showReactionChooser || isChoosing) && ( //nếu đang để chuột ở nút mở bảng chọn hoặc trong bảng chọn thì bảng chọn sẽ luôn hiện tránh tình trạng chưa chọn xong đã bị ẩn
              <div
                className={"absolute bottom-10 bg-white flex shadow gap-1 transition-all opacity-100 scale-100 translate-y-0 rounded-2xl"}
                onMouseEnter={() => setIsChoosing(true)}  //đang chọn
                onMouseLeave={() => setTimeout(() => setIsChoosing(false), 500)}
              >
                <motion.button whileHover={{ scale: 2 }}  //phóng to biểu tượng lên
                  className="px-2 py-2" onClick={() => {
                    handleReaction('like')
                  }}>
                  <Image src={"/like.gif"} alt="like" width={30} height={30} unoptimized />
                </motion.button>
                <motion.button whileHover={{ scale: 2 }}
                  className="px-2 py-2" onClick={() => {
                    handleReaction('love')
                  }}>
                  <Image src={"/love.gif"} alt="love" width={30} height={30} unoptimized />
                </motion.button>
                <motion.button whileHover={{ scale: 2 }}
                  className="px-2 py-2" onClick={() => {
                    handleReaction('haha')
                  }}>
                  <Image src={"/haha.gif"} alt="haha" width={30} height={30} unoptimized />
                </motion.button>
                <motion.button whileHover={{ scale: 2 }}
                  className="px-2 py-2" onClick={() => {
                    handleReaction('wow')
                  }}>
                  <Image src={"/wow.gif"} alt="wow" width={30} height={30} unoptimized />
                </motion.button>
                <motion.button whileHover={{ scale: 2 }}
                  className="px-2 py-2" onClick={() => {
                    handleReaction('sad')
                  }}>
                  <Image src={"/sad.gif"} alt="sad" width={30} height={30} unoptimized />
                </motion.button>
                <motion.button whileHover={{ scale: 2 }}
                  className="px-2 py-2" onClick={() => {
                    handleReaction('angry')
                  }}>
                  <Image src={"/angry.gif"} alt="angry" width={30} height={30} unoptimized />
                </motion.button>
              </div>
            )}
            <Button
              variant="ghost"
              className={`flex-1 hover:bg-gray-100 text-gray-500 hover:text-gray-500 text-[15px] h-8`}
              onClick={handleCommentClick}
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
                <div className="flex items-center justify-around my-[10px]">
                  <Button
                    className="hover:bg-gray-200 flex-col justify-between"
                    variant="ghost"
                    size="bigIcon"
                    onClick={() => handleShare("facebook")}
                  >
                    <FaFacebook style={{ width: "40px", height: "40px", color: "#1877F2" }} />
                    Facebook
                  </Button>
                  <Button
                    className="hover:bg-gray-200 flex-col justify-between"
                    variant="ghost"
                    size="bigIcon"
                    onClick={() => handleShare("x")}
                  >
                    <FaXTwitter style={{ width: "40px", height: "40px", color: "#000000" }} />
                    X
                  </Button>
                  <Button
                    className="hover:bg-gray-200 flex-col justify-between"
                    variant="ghost"
                    size="bigIcon"
                    onClick={() => handleShare("linkedin")}
                  >
                    <FaLinkedin style={{ width: "40px", height: "40px", color: "#0088CC" }} />
                    LinkedIn
                  </Button>
                  <Button
                    className="hover:bg-gray-200 flex-col justify-between"
                    variant="ghost"
                    size="bigIcon"
                    onClick={() => handleShare("copy")}
                  >
                    <AiOutlineCopy style={{ width: "40px", height: "40px", color: "#000000" }} />
                    Sao chép liên kết
                  </Button>
                </div>
                <div>
                  <div className='flex justify-center items-center'>

                    <QRCodeCanvas value={generateSharedLink()} size={200} />
                  </div>
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
                  onComment={onComment}
                  commentInputRef={commentInputRef}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
