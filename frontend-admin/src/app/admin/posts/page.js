"use client";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Input } from "@/components/ui/input";
import { deletePost, getAllPosts } from "@/service/post.service";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatedDate } from "@/lib/utils";
import Image from 'next/image'
import toast from "react-hot-toast";
import { ArrowDownWideNarrow } from "lucide-react";

function Posts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterPosts, setFilterPosts] = useState([]);
  const [postList, setPostList] = useState([]);
  const [filterMode, setFilterMode] = useState("Mới nhất");
  const [modeChooserOpen, setModeChooserOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const dropdownRef = useRef(null);

  //Tải ds bài viết
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const result = await getAllPosts();
      setPostList(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  //Bấm ngoài dropdown thì tắt
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setModeChooserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //Lọc bài viết theo từ khóa chỉ khi nhấn nút tìm
  const performSearch = useCallback((query) => {
    if (query && query.trim()) {
      const filterPost = postList.filter((post) =>
        post.id.toString() === query //tìm theo id
          || post?.user?.username?.toLowerCase().includes(query.toLowerCase()) //tìm theo tên người đăng
          || post?.content?.toLowerCase().includes(query.toLowerCase()) //tìm theo nội dung bài viết
      );
      if (filterPost.length < 1) toast.error("Không tìm thấy kết quả")
      setFilterPosts(filterPost);
      setIsSearchActive(true);
    } else {
      setFilterPosts([]);
      setIsSearchActive(false);
    }
  }, [postList]);

  const handleSearch = () => {
    // Nếu ô tìm kiếm trống thì clear kết quả tìm kiếm
    if (!searchQuery || searchQuery.trim() === '') {
      setFilterPosts([]);
      setIsSearchActive(false);
      return;
    }
    // Nếu có text thì thực hiện tìm kiếm
    performSearch(searchQuery);
  };

  // Xử lý thay đổi input - CHỈ cập nhật searchQuery, KHÔNG làm gì khác
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // KHÔNG clear filterPosts ở đây để tránh re-render
  };

  // Hàm sắp xếp (không mutate array gốc)
  const sortPosts = (posts, mode) => {
    if (!posts || posts.length === 0) return [];
    const sortedPosts = [...posts]; // Tạo bản sao
    if (mode === "Mới nhất") {
      return sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (mode === "Lượt react") {
      return sortedPosts.sort((a, b) => {
        const totalReactsA = Object.values(a.reactionStats || {}).reduce(
          (acc, val) => acc + val,
          0
        );
        const totalReactsB = Object.values(b.reactionStats || {}).reduce(
          (acc, val) => acc + val,
          0
        );
        return totalReactsB - totalReactsA;
      });
    } else if (mode === "Lượt bình luận") {
      return sortedPosts.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
    } else {
      return sortedPosts.sort((a, b) => (b.shareCount || 0) - (a.shareCount || 0));
    }
  };

  //Sắp xếp thay đổi mode
  const handleModeChooser = (mode) => {
    setFilterMode(mode);
    // Sắp xếp lại cả hai danh sách bằng cách tạo mới
    setPostList(prevPostList => sortPosts(prevPostList, mode));
    if (isSearchActive && filterPosts.length > 0) {
      setFilterPosts(prevFilterPosts => sortPosts(prevFilterPosts, mode));
    }
  };

  // Tối ưu hóa việc hiển thị - chỉ phụ thuộc vào những gì thực sự cần thiết
  const displayPosts = useMemo(() => {
    // Nếu đang trong chế độ tìm kiếm và có kết quả thì hiển thị kết quả tìm kiếm
    if (isSearchActive && filterPosts.length > 0) {
      return sortPosts(filterPosts, filterMode);
    }
    // Ngược lại hiển thị toàn bộ danh sách
    return sortPosts(postList, filterMode);
  }, [postList, filterPosts, filterMode, isSearchActive]);

  const handleDelete = async (postId) => {
    if (!postId) {
      toast.error("Không tìm thấy ID bài viết để xóa!");
      return;
    }
    await deletePost(postId)
    await fetchPosts()
    toast.success("Xóa bài viết thành công.")
  }

  const PostCard = ({ post }) => {
    return (
      <div className="flex bg-white rounded-lg my-2 relative drop-shadow-lg mx-3 md:mx-6 gap-6">
        {/*Nội dung*/}
        <div className="flex flex-col ml-5 w-1/2 pt-5">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar>
              {post?.user?.profilePicture ? (
                <AvatarImage
                  src={post?.user?.profilePicture}
                  alt={post?.user?.username}
                />
              ) : (
                <AvatarFallback>
                  {post?.user?.username
                    ?.split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-semibold">{post?.user?.username}</p>
              <p className="font-sm text-gray-500 text-xs">
                {formatedDate(post?.createdAt)}
              </p>
            </div>
          </div>
          <p className="mb-4">{post?.content}</p>
          {!post?.content && (
            <div className="h-10 italic text-gray-800">
              Không có tiêu đề
            </div>
          )}
          {post?.mediaUrl && post.mediaType === "image" && (
            <img
              src={post?.mediaUrl}
              alt="post_image"
              className="max-w-[500px] min-h-[200px] max-h-[300px] object-contain rounded-lg mb-5"
            />
          )}
          {post?.mediaUrl && post.mediaType === "video" && (
            <video
              controls
              className="max-w-[500px] min-h-[200px] max-h-[300px] object-contain rounded-lg mb-5"
            >
              <source src={post?.mediaUrl} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ thẻ video.
            </video>
          )}
          {!post?.mediaUrl && (
            <div className="h-[250px] italic text-gray-800">
              Không có file phương tiện
            </div>
          )}
        </div>
        {/*Thông số*/}
        <div className="flex flex-col space-x-3 w-1/3 mt-5 self-center">
          <div className="flex mb-3">
            <p className="font-['Roboto_Condensed'] text-sm md:text-xl hidden lg:block">Số lượt bày tỏ cảm xúc: &nbsp;</p>
            <p className="font-['Roboto_Condensed'] text-sm md:text-xl lg:hidden">Số lượt cảm xúc: &nbsp;</p>
            <p className="font-bold font-['Roboto_Condensed'] text-sm md:text-xl">{post?.reactionStats ? Object.values(post.reactionStats).reduce((acc, val) => acc + val, 0) : 0}</p>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-6 mb-7">
            <div className="flex items-center gap-1 md:gap-2">
              <Image src={"/like.png"} alt="like" width={30} height={30} />
              <p>{post?.reactionStats?.like}</p>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Image src={"/love.png"} alt="love" width={30} height={30} />
              <p>{post?.reactionStats?.love}</p>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Image src={"/haha.png"} alt="haha" width={30} height={30} />
              <p>{post?.reactionStats?.haha}</p>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Image src={"/wow.png"} alt="wow" width={30} height={30} />
              <p>{post?.reactionStats?.wow}</p>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Image src={"/sad.png"} alt="sad" width={30} height={30} />
              <p>{post?.reactionStats?.sad}</p>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Image src={"/angry.png"} alt="angry" width={30} height={30} />
              <p>{post?.reactionStats?.angry}</p>
            </div>
          </div>
          <div className="flex mb-3 lg:mb-7">
            <p className="font-['Roboto_Condensed'] text-sm md:text-xl">Số lượt bình luận: &nbsp;</p>
            <p className="font-bold font-['Roboto_Condensed'] text-sm md:text-xl">{post?.commentCount}</p>
          </div>
          <div className="flex mb-3 lg:mb-7">
            <p className="font-['Roboto_Condensed'] text-sm md:text-xl">Số lượt chia sẻ: &nbsp;</p>
            <p className="font-bold font-['Roboto_Condensed'] text-sm md:text-xl">{post?.shareCount}</p>
          </div>
          <div className="flex justify-end">
            <Button
              className="w-30 md:w-40 text-sm md:text-[20px] h-8 md:h-10 cursor-pointer hover:bg-gray-700 text-white bg-[#DF0000] font-['Roboto_Condensed'] rounded-[25px] overflow-hidden"
              onClick={() => {
                handleDelete(post?._id || post?.id)
              }}
            >
              <MdDelete className="w-10 h-10" />
              Xóa bài viết
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full min-h-screen bg-[#F4F7FE]">
      <Sidebar />
      <div className="flex w-full flex-col py-6 md:ml-52 overflow-y-auto">
        {/*Title*/}
        <div className="flex justify-between items-center mb-6 px-6">
          <h1 className="text-2xl font-semibold text-[#333]">Quản lý bài viết</h1>
        </div>
        {/*Search & Filter*/}
        <div className="flex items-center mb-10 py-3 px-3 md:px-6 justify-between min-h-[60px]">
          <div className="flex w-3/5 items-center gap-2 justify-start">
            <Input
              type="text"
              placeholder="Tìm kiếm"
              className="w-xl border px-4 py-2 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300 italic"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              className="w-14 md:w-24 h-10 cursor-pointer md:ml-2 px-6 py-2 bg-[#086280] text-white rounded-lg hover:bg-gray-700 transition duration-200"
              onClick={() => {
                handleSearch();
              }}
            >
              <FaSearch className="w-6 h-6" />
              Tìm
            </Button>
          </div>
          <div className="flex w-1/5 md:w-2/5 items-center justify-end md:gap-2 relative">
            <div className="lg:hidden ml-2 text-gray-500">
              <ArrowDownWideNarrow className="w-6 h-6" />
            </div>
            <div className="text-black text-sm hidden lg:block md:text-base lg:text-xl font-bold font-['Roboto_Condensed'] ml-2">
              Sắp xếp theo:
            </div>
            <Button
              className="w-28 md:w-40 h-10 text-sm md:text-base lg:text-[18px] cursor-pointer hover:bg-gray-700 text-white bg-[#07617f] font-['Roboto_Condensed'] rounded-[25px] overflow-hidden"
              onClick={() => {
                setModeChooserOpen(!modeChooserOpen);
              }}
            >
              {filterMode}
            </Button>
            {modeChooserOpen && (
              <div
                className="absolute top-full right-0 w-28 mt-2 md:w-40 bg-white border border-gray-300 rounded-md shadow-lg z-50"
                ref={dropdownRef}
              >
                <button
                  className="flex justify-center block w-full px-2 md:px-4 py-2 text-left bg-white text-[#07617f] hover:bg-[#07617f] hover:text-white text-sm md:text-base items-center gap-2"
                  onClick={() => {
                    setModeChooserOpen(false);
                    handleModeChooser("Mới nhất");
                  }}
                >
                  Mới nhất
                </button>
                <button
                  className="flex justify-center block w-full px-2 md:px-4 py-2 text-left bg-white text-[#07617f] hover:bg-[#07617f] hover:text-white text-sm md:text-base items-center gap-2"
                  onClick={() => {
                    setModeChooserOpen(false);
                    handleModeChooser("Lượt react");
                  }}
                >
                  Lượt react
                </button>
                <button
                  className="flex justify-center block w-full px-2 md:px-4 py-2 text-left bg-white text-[#07617f] hover:bg-[#07617f] hover:text-white text-sm md:text-base items-center gap-2"
                  onClick={() => {
                    setModeChooserOpen(false);
                    handleModeChooser("Lượt bình luận");
                  }}
                >
                  Lượt bình luận
                </button>
                <button
                  className="flex justify-center block w-full px-2 md:px-4 py-2 text-left bg-white text-[#07617f] hover:bg-[#07617f] hover:text-white text-sm md:text-base items-center gap-2"
                  onClick={() => {
                    setModeChooserOpen(false);
                    handleModeChooser("Lượt chia sẻ");
                  }}
                >
                  Lượt chia sẻ
                </button>
              </div>
            )}
          </div>
        </div>
        {/*List*/}
        {displayPosts.map((post, idx) => {
          return <PostCard key={post?._id || post?.id || idx} post={post} />;
        })}
      </div>
    </div>
  );
}

export default Posts;

