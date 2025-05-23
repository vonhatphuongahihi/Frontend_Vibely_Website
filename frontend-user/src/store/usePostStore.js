import { addCommentToPost, addReplyToPost, createPost, createStory, deleteComment, deletePost, deleteReply, deleteStory, editPost, getAllPosts, getAllStories, getAllUserPosts, likeComment, reactPost, reactStory, sharePost } from '@/service/post.service';
import toast from 'react-hot-toast';
import { create } from 'zustand';
//quản lý trạng thái các bài viết và story
export const usePostStore = create((set) => ({
    posts: [],   //lưu danh sách tất cả bài viết.
    stories: [], //lưu danh sách tất cả story

    userPosts: [],   //lưu danh sách bài viết của người dùng

    loading: false,  //trạng thái tải
    error: null, //lưu lỗi

    fetchPosts: async () => {
        set({ loading: true })
        try {
            const posts = await getAllPosts();
            set({ posts, loading: false })
        } catch (error) {
            set({ error, loading: false })
        }
    },

    //fetch user posts
    fetchUserPost: async (userId) => {
        set({ loading: true });
        try {
            const userPosts = await getAllUserPosts(userId);
            set({ userPosts, loading: false });
        } catch (error) {
            set({ error, loading: false });
        }
    },

    fetchStories: async () => {
        set({ loading: true })
        try {
            const res = await getAllStories();
            console.log("Raw story data từ API:", res);
            
            if (!res || res.length === 0) {
                console.log("Không có story nào được trả về từ API");
                set({ stories: [], loading: false });
                return;
            }
            
            // Kiểm tra cấu trúc dữ liệu
            const sampleStory = res[0];
            console.log("Mẫu story đầu tiên:", sampleStory);
            console.log("Các thuộc tính của story:", Object.keys(sampleStory));
            
            // Chuyển đổi dữ liệu nếu cần
            const processedStories = res.map(story => {
                // Đảm bảo các trường cần thiết đều có
                return {
                    ...story,
                    id: story.id || story._id, // Đảm bảo có id
                    mediaUrl: story.mediaUrl, // Đảm bảo có mediaUrl
                    mediaType: story.mediaType, // Đảm bảo có mediaType
                    user: story.user || {} // Đảm bảo có user
                };
            });
            
            const now = new Date();
            const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Lùi lại 24 giờ
            //Story chỉ tồn tại trong 24h 
            const filterStories = processedStories.filter(story => {
                const storyDate = new Date(story.createdAt);
                return storyDate >= last24Hours; // Chỉ lấy story có thời gian >= thời gian 24h trước
            });
            
            console.log("Stories sau khi lọc và xử lý:", filterStories);
            set({ stories: filterStories, loading: false })
        } catch (error) {
            console.error("Lỗi khi fetch stories:", error);
            set({ error, loading: false })
        }
    },

    handleCreatePost: async (postData) => {
        try {
            set({ loading: true });
            const newPost = await createPost(postData);
            set((state) => ({
                posts: [newPost, ...state.posts],   //thêm bài đăng mới vào danh sách các bài đăng
                loading: false,
            }));
            toast.success("Tạo bài đăng thành công.");
            return newPost;
        } catch (error) {
            console.error("Lỗi chi tiết khi tạo bài viết:", error);
            set({ error, loading: false });
            
            // Hiển thị thông báo lỗi cụ thể
            if (error.message) {
                toast.error(error.message);
            } else if (error.response?.status === 413) {
                toast.error("File quá lớn. Vui lòng chọn file nhỏ hơn.");
            } else {
                toast.error("Đã xảy ra lỗi khi đăng bài. Vui lòng thử lại.");
            }
            
            return null;
        }
    },

    handleEditPost: async (postId, postData) => {
        set({ loading: true })
        try {
            const editedPost = await editPost(postId, postData)
            set((state) => ({
                posts: state.posts.map((post) =>
                    post?.id === postId
                        ? editedPost
                        : post
                ),
                loading: false
            }))
            toast.success("Sửa bài viết thành công.")
        } catch (error) {
            set({ error, loading: false })
            toast.error("Đã xảy ra lỗi khi đăng bài. Vui lòng thử lại.")
        }
    },

    handleCreateStory: async (storyData) => {
        set({ loading: true })
        try {
            const newStory = await createStory(storyData)  //thêm story mới vào danh sách các story
            if (newStory) { // Kiểm tra newStory có tồn tại không
                set((state) => ({
                    stories: [newStory, ...state.stories],
                    loading: false,
                }))
                toast.success("Tạo story thành công.")
                return newStory; // Trả về story đã tạo để component có thể sử dụng
            } else {
                set({ loading: false })
                toast.error("Không thể tạo story. Dữ liệu không hợp lệ.")
                return null;
            }
        } catch (error) {
            console.error("Lỗi trong store khi tạo story:", error);
            set({ error, loading: false })
            toast.error("Đã xảy ra lỗi khi đăng story. Vui lòng thử lại.")
            throw error; // Ném lỗi để component có thể bắt và xử lý
        }
    },

    handleDeleteStory: async (storyId) => {
        set({ loading: true })
        try {
            await deleteStory(storyId)
            toast.success("Xóa story thành công.")
        } catch (error) {
            set({ error, loading: false })
            toast.error("Đã xảy ra lỗi khi xóa story. Vui lòng thử lại.")
        }
    },

    handleReactPost: async (postId, reactType) => {
        set({ loading: true });
        try {
            const updatedStats = await reactPost(postId, reactType);
            set((state) => ({
                posts: state.posts.map(post =>
                    post.id === postId ? { ...post, reactionStats: updatedStats.reactionStats } : post
                ),
                loading: false
            }));
        } catch (error) {
            set({ error, loading: false });
            toast.error("Lỗi khi react bài viết. Vui lòng thử lại.");
        }
    },
    handleReactStory: async (storyId) => {
        set({ loading: true });
        try {
            const updatedStats = await reactStory(storyId);
            set((state) => ({
                stories: state.stories.map(story =>
                    story.id === storyId ? { ...story, reactionStats: updatedStats.reactionStats } : story
                ),
                loading: false
            }));
        } catch (error) {
            set({ error, loading: false });
            toast.error("Lỗi khi react story. Vui lòng thử lại.");
        }
    },

    handleCommentPost: async (postId, commentText) => {
        set({ loading: true })
        try {
            const newComment = await addCommentToPost(postId, commentText)
            set((state) => ({
                posts: state.posts.map((post) =>
                    post?.id === postId
                        ? newComment?.data   //object trả về là nguyên cái bài viết chứ ko phải mỗi cmt :))
                        //thêm 1 comment vào phẩn cuối danh sách comments của 1 bài viết với id là postId
                        : post
                ),
                loading: false
            }))
            toast.success("Thêm bình luận thành công.")
        } catch (error) {
            set({ error, loading: false })
            toast.error("Đã xảy ra lỗi khi thêm bình luận. Vui lòng thử lại.")
        }
    },

    handleReplyComment: async (postId, commentId, replyText) => {
        set({ loading: true })
        try {
            const newReply = await addReplyToPost(postId, commentId, replyText)
            set((state) => ({
                posts: state.posts.map((post) =>
                    post?.id === postId
                        ? newReply?.data
                        : post
                ),
                loading: false
            }))
            toast.success("Thêm phản hồi thành công.")
        } catch (error) {
            set({ error, loading: false })
            toast.error("Đã xảy ra lỗi khi thêm phản hồi. Vui lòng thử lại.")
        }
    },

    handleSharePost: async (postId) => {
        set({ loading: true })
        try {
            await sharePost(postId)
            toast.success("Chia sẻ bài viết thành công.")
        } catch (error) {
            set({ error, loading: false })
            toast.error("Đã xảy ra lỗi khi chia sẻ bài viết. Vui lòng thử lại.")
        }
    },

    handleDeletePost: async (postId) => {
        set({ loading: true })
        try {
            await deletePost(postId)
            toast.success("Xóa bài viết thành công.")
        } catch (error) {
            set({ error, loading: false })
            toast.error("Đã xảy ra lỗi khi xóa bài viết. Vui lòng thử lại.")
        }
    },

    handleDeleteComment: async (postId, commentId) => {
        set({ loading: true })
        try {
            await deleteComment(postId, commentId)
            toast.success("Xóa bình luận thành công.")
        } catch (error) {
            set({ error, loading: false })
            toast.error("Đã xảy ra lỗi khi xóa bình luận. Vui lòng thử lại.")
        }
    },

    handleDeleteReply: async (postId, commentId, replyId) => {
        set({ loading: true })
        try {
            await deleteReply(postId, commentId, replyId)
            toast.success("Xóa phản hồi thành công.")
        } catch (error) {
            set({ error, loading: false })
            toast.error("Đã xảy ra lỗi khi xóa phản hồi. Vui lòng thử lại.")
        }
    },

    handleLikeComment: async (postId, commentId) => {
        set({ loading: true })
        try {
            const newReply = await likeComment(postId, commentId)
            set((state) => ({
                posts: state.posts.map((post) =>
                    post?.id === postId
                        ? newReply?.data
                        : post
                ),
                loading: false
            }))
        } catch (error) {
            set({ error, loading: false })
            toast.error("Đã xảy ra lỗi khi thích bình luận. Vui lòng thử lại.")
        }
    },
}))