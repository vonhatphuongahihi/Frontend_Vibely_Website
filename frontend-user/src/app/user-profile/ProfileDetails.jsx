import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createOrUpdateUserBio } from "@/service/user.service";
import { usePostStore } from "@/store/usePostStore";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Home, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import NewPostForm from "../posts/NewPostForm";
import { MutualFriends } from "./profileContent/MutualFriends";
import { PostsContent } from "./profileContent/PostsContent";
import { SavedDocuments } from "./profileContent/SavedDocuments";

export const ProfileDetails = ({
  activeTab,
  id,
  profileData,
  isOwner,
  fetchProfile,
  setProfileData,
}) => {
  const [isEditBioModal, setIsEditBioModal] = useState(false);
  const [bio, setBio] = useState("");
  const [tempBio, setTempBio] = useState(bio);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  // const handleSaveBio = () => {
  //   setBio(tempBio);
  //   setIsEditBioModal(false);
  // };

  const handleSaveBio = async () => {
    try {
      if (!tempBio.trim()) {
        alert("Tiểu sử không được để trống!");
        return;
      }

      const fullBio = {
        ...profileData.bio,
        bioText: tempBio, // chỉ thay đổi phần bioText
      };

      const updatedBio = await createOrUpdateUserBio(id, fullBio);

      setProfileData((prev) => ({
        ...prev,
        bio: updatedBio,
      }));

      // Đóng modal chỉnh sửa
      setIsEditBioModal(false);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật Bio:", error);
    }
  };

  const {
    userPosts,
    stories,
    fetchStories,
    fetchUserPost,
    handleCreatePost,
    handleCreateStory,
    handleReactPost,
    handleCommentPost,
    handleSharePost,
    handleDeletePost,
    setCurrentUserId,
    handleReplyComment,
    handleDeleteComment,
    handleDeleteReply,
    handleLikeComment,
  } = usePostStore();

  useEffect(() => {
    if (id) {
      setIsPostsLoading(true);
      console.log("🔍 Setting currentUserId to:", id);
      setCurrentUserId(id); // Lưu ID của user hiện tại đang xem profile
      fetchUserPost(id).finally(() => setIsPostsLoading(false));
    }
  }, [id, fetchUserPost, setCurrentUserId]);

  const [reactPosts, setReactPosts] = useState(new Set()); // danh sách những bài viết mà người dùng đã react
  useEffect(() => {
    const saveReacts = localStorage.getItem("reactPosts");
    if (saveReacts) {
      setReactPosts(JSON.parse(saveReacts));
    }
  }, []);
  const handleReact = async (postId, reactType) => {
    const updatedReactPosts = { ...reactPosts };

    if (updatedReactPosts && updatedReactPosts[postId] === reactType) {
      delete updatedReactPosts[postId]; // hủy react nếu nhấn lại
    } else {
      updatedReactPosts[postId] = reactType; // cập nhật cảm xúc mới
    }

    setReactPosts(updatedReactPosts);
    localStorage.setItem("reactPosts", JSON.stringify(updatedReactPosts));

    try {
      await handleReactPost(postId, reactType);
    } catch (error) {
      console.log(error);
      toast.error(
        "Đã xảy ra lỗi khi bày tỏ cảm xúc với bài viết này. Vui lòng thử lại."
      );
    }
  };
  const router = useRouter();

  const [isPostFormOpen, setIsPostFormOpen] = useState(false)
  const tabContent = {
    posts: (
      <div className="flex flex-col lg:flex-row gap-6 ">
        <div className="w-full lg:w-[30%]">
          <Card className="bg-white shadow-md rounded-lg border border-gray-200">
            <CardContent className="p-6">
              <p className="text-xl font-semibold mb-4 dark:text-gray-300">
                Giới thiệu
              </p>
              {/* Hiện Textarea khi nhấn Chỉnh sửa tiểu sử */}
              {isEditBioModal ? (
                <div>
                  <textarea
                    className="w-full p-2 border rounded-md text-gray-700 add-bio"
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    maxLength={101}
                  />
                  <div className="flex justify-end items-center mt-2 text-sm text-gray-500">
                    <span>{tempBio.length}/101</span>
                  </div>
                  <div className="flex justify-between gap-2 my-4">
                    <Button
                      className="bg-gray-400 text-white px-12 py-2 rounded-md"
                      onClick={() => setIsEditBioModal(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      className="bg-[#086280] text-white px-8 py-2 rounded-md save-bio"
                      onClick={handleSaveBio}
                    >
                      Hoàn tất
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="flex justify-center text-gray-600 dark:text-gray-300 mb-4">
                    {profileData?.bio?.bioText || "Chưa có tiểu sử"}
                  </p>
                  {isOwner && (
                    <Button
                      className="w-full bg-[#086280] text-white mb-4 edit-bio"
                      onClick={() => setIsEditBioModal(true)}
                    >
                      Chỉnh sửa tiểu sử
                    </Button>
                  )}
                </>
              )}
              <div className="space-y-2 mb-4 dark:text-gray-300">
                {profileData?.bio?.education && (
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-[#086280]" />
                    <p>
                      Đã học tại{" "}
                      <span className="font-semibold">
                        {profileData?.bio?.education}
                      </span>
                    </p>
                  </div>
                )}
                {profileData?.bio?.workplace && (
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-[#086280]" />
                    <p>
                      Làm việc tại{" "}
                      <span className="font-semibold">
                        {profileData?.bio?.workplace}
                      </span>
                    </p>
                  </div>
                )}
                {profileData?.bio?.liveIn && (
                  <div className="flex items-center">
                    <Home className="w-5 h-5 mr-2 text-[#086280]" />
                    <p>
                      Sống tại{" "}
                      <span className="font-semibold">
                        {profileData?.bio?.liveIn}
                      </span>
                    </p>
                  </div>
                )}
                {profileData?.bio?.hometown && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-[#086280]" />
                    <p>
                      Đến từ{" "}
                      <span className="font-semibold">
                        {profileData?.bio?.hometown}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Bài viết đã đăng của người dùng */}
        <div className="w-full lg:w-[70%] space-y-6 mb-4">
          {isOwner &&
            <NewPostForm
              isPostFormOpen={isPostFormOpen}
              setIsPostFormOpen={setIsPostFormOpen}
            />
          }
          {isPostsLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-12 h-12 border-4 border-[#23CAF1] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : userPosts?.length > 0 ? (
            userPosts.map((post) => (
              <PostsContent
                key={post?.id}
                post={post}
                reaction={reactPosts[post?.id] || null} // Loại react
                onReact={(reactType) => handleReact(post?.id, reactType)} // Chức năng react
                onComment={async (commentText) => {
                  // Chức năng comment
                  await handleCommentPost(post?.id, commentText);
                  await fetchUserPost(id); // Reload dữ liệu từ server như homepage
                }}
                onReplyComment={async (postId, commentId, replyText) => {
                  await handleReplyComment(postId, commentId, replyText);
                  await fetchUserPost(id); // Reload sau khi reply
                }}
                onDeleteComment={async (postId, commentId) => {
                  await handleDeleteComment(postId, commentId);
                  await fetchUserPost(id); // Reload sau khi xóa comment
                }}
                onDeleteReply={async (postId, commentId, replyId) => {
                  await handleDeleteReply(postId, commentId, replyId);
                  await fetchUserPost(id); // Reload sau khi xóa reply
                }}
                onLikeComment={async (postId, commentId) => {
                  await handleLikeComment(postId, commentId);
                  await fetchUserPost(id); // Reload sau khi like comment
                }}
                onShare={async () => {
                  // Chức năng share
                  await handleSharePost(post?.id);
                }}
                onDelete={async () => {
                  // Chức năng xóa bài viết
                  await handleDeletePost(post?.id);
                }}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <img
                src="/nopost.png"
                alt="No posts illustration"
                className="h-[280px] mx-auto"
              />
              <p className="text-center text-gray-500">
                Chưa có bài viết
              </p>
            </div>
          )}
        </div>
      </div>
    ),
    videos: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <Card className="bg-white shadow-md rounded-lg border border-gray-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold mb-4 dark:text-gray-300">
                Video
              </p>
            </div>
            {userPosts?.some(
              (post) => post?.mediaType === "video" && post?.mediaUrl
            ) ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {userPosts
                  ?.filter(
                    (post) => post?.mediaType === "video" && post?.mediaUrl
                  )
                  .map((post) => (
                    <div key={post?.id} onClick={() => router.push(`/posts/${post?.id}`)} className="w-[220px] h-[180px] cursor-pointer">
                      <video
                        //controls
                        className="w-full h-full object-cover rounded-lg"
                      >
                        <source src={post?.mediaUrl} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                      </video>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <img
                  src="/novideo.png"
                  alt="No posts illustration"
                  className="h-[180px] mx-auto"
                />
                <p className="text-center text-gray-500">
                  Bạn chưa đăng Video nào
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    ),
    friends: <MutualFriends id={id} isOwner={isOwner} />,
    photos: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <Card className="bg-white shadow-md rounded-lg border border-gray-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold mb-4 dark:text-gray-300">
                Ảnh
              </p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {userPosts?.filter(
                (post) => post?.mediaType === "image" && post?.mediaUrl
              ).length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center space-y-4 col-span-full">
                  <img
                    src="/novideo.png"
                    alt="No posts illustration"
                    className="h-[180px] mx-auto"
                  />
                  <p className="text-center text-gray-500">
                    Bạn chưa đăng hình ảnh nào
                  </p>
                </div>
              ) : (
                userPosts
                  .filter(
                    (post) => post?.mediaType === "image" && post?.mediaUrl
                  )
                  .map((post) => (
                    <img
                      key={post?.id}
                      src={post?.mediaUrl}
                      alt="user_all_photos"
                      className="w-[200px] h-[150px] object-cover rounded-lg cursor-pointer"
                      onClick={() => router.push(`/posts/${post?.id}`)}
                    />
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
    files: <SavedDocuments isOwner={isOwner} />,
  };
  return <div>{tabContent[activeTab] || null}</div>;
};
