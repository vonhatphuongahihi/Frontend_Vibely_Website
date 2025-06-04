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

            if (!res || res.length === 0) {
                set({ stories: [], loading: false });
                return;
            }

            // Kiểm tra cấu trúc dữ liệu
            const sampleStory = res[0];

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
                userPosts: state.userPosts.map((post) =>
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
            const newStory = await createStory(storyData)
            if (newStory) {
                set((state) => ({
                    stories: [newStory, ...state.stories],
                    loading: false,
                }))
                return newStory
            } else {
                set({ loading: false })
                throw new Error("Không thể tạo story. Dữ liệu không hợp lệ.")
            }
        } catch (error) {
            console.error("Lỗi trong store khi tạo story:", error)
            set({ error, loading: false })
            throw error
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
            const updatedData = await reactPost(postId, reactType);
            console.log("🔍 React post result:", updatedData);
            console.log("🔍 React post reactionStats:", updatedData?.reactionStats);
            console.log("🔍 React post reactions:", updatedData?.reactions);
            
            set((state) => ({
                posts: state.posts.map(post =>
                    post.id === postId ? { 
                        ...post, 
                        reactionStats: updatedData.reactionStats,
                        reactions: updatedData.reactions 
                    } : post
                ),
                userPosts: state.userPosts.map(post =>
                    post.id === postId ? { 
                        ...post, 
                        reactionStats: updatedData.reactionStats,
                        reactions: updatedData.reactions 
                    } : post
                ),
                loading: false
            }));
        } catch (error) {
            console.error("❌ Error reacting to post:", error);
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

    handleCommentPost: async (postId, commentData) => {
        set({ loading: true })
        try {
            const result = await addCommentToPost(postId, commentData)
            console.log("🔍 Comment result from service:", result);
            console.log("🔍 Comment data to add:", result.data);
            
            // Đảm bảo comment có cấu trúc đúng
            const newComment = {
                id: result.data.id,
                text: result.data.text,
                createdAt: result.data.createdAt,
                user: result.data.user,
                reactions: result.data.reactions || [],
                replies: result.data.replies || []
            };
            
            console.log("🔍 New comment object:", newComment);
            
            // Cập nhật state với comment mới cho cả posts và userPosts
            set((state) => ({
                posts: state.posts.map((post) => {
                    if (post?.id === postId) {
                        const updatedPost = {
                            ...post,
                            comments: [...(post.comments || []), newComment],
                            commentCount: (post.commentCount || 0) + 1
                        };
                        console.log("🔍 Updated post comments:", updatedPost.comments);
                        return updatedPost;
                    }
                    return post;
                }),
                userPosts: state.userPosts.map((post) => {
                    if (post?.id === postId) {
                        return {
                            ...post,
                            comments: [...(post.comments || []), newComment],
                            commentCount: (post.commentCount || 0) + 1
                        };
                    }
                    return post;
                }),
                loading: false
            }))
            toast.success("Thêm bình luận thành công.")
            return result;
        } catch (error) {
            console.error("❌ Error adding comment:", error);
            set({ error, loading: false })
            toast.error("Đã xảy ra lỗi khi thêm bình luận. Vui lòng thử lại.")
            throw error;
        }
    },

    handleReplyComment: async (postId, commentId, replyText) => {
        set({ loading: true })
        try {
            const result = await addReplyToPost(postId, commentId, replyText)
            console.log("🔍 Reply result:", result);
            
            // Cập nhật state với reply mới cho cả posts và userPosts
            set((state) => ({
                posts: state.posts.map((post) =>
                    post?.id === postId
                        ? {
                            ...post,
                            comments: post.comments.map((comment) =>
                                comment?.id === commentId
                                    ? {
                                        ...comment,
                                        replies: [...(comment.replies || []), {
                                            ...result.data,
                                            user: result.data.user,
                                            text: result.data.text,
                                            id: result.data.id
                                        }]
                                    }
                                    : comment
                            ),
                            commentCount: (post.commentCount || 0) + 1 // Tăng số lượng comment khi có reply
                        }
                        : post
                ),
                userPosts: state.userPosts.map((post) =>
                    post?.id === postId
                        ? {
                            ...post,
                            comments: post.comments.map((comment) =>
                                comment?.id === commentId
                                    ? {
                                        ...comment,
                                        replies: [...(comment.replies || []), {
                                            ...result.data,
                                            user: result.data.user,
                                            text: result.data.text,
                                            id: result.data.id
                                        }]
                                    }
                                    : comment
                            ),
                            commentCount: (post.commentCount || 0) + 1 // Tăng số lượng comment khi có reply
                        }
                        : post
                ),
                loading: false
            }))
            toast.success("Thêm phản hồi thành công.")
            return result;
        } catch (error) {
            console.error("❌ Error adding reply:", error);
            set({ error, loading: false })
            toast.error("Đã xảy ra lỗi khi thêm phản hồi. Vui lòng thử lại.")
            throw error;
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
            
            // Cập nhật state sau khi xóa bài viết
            set((state) => ({
                posts: state.posts.filter(post => post.id !== postId),
                userPosts: state.userPosts.filter(post => post.id !== postId),
                loading: false
            }))
            
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
            
            // Cập nhật state sau khi xóa comment cho cả posts và userPosts
            set((state) => ({
                posts: state.posts.map((post) => {
                    if (post?.id === postId) {
                        const deletedComment = post.comments.find(comment => comment.id === commentId);
                        const repliesCount = deletedComment?.replies?.length || 0;
                        return {
                            ...post,
                            comments: post.comments.filter(comment => comment.id !== commentId),
                            commentCount: Math.max(0, (post.commentCount || 0) - 1 - repliesCount) // Giảm cả comment và replies
                        }
                    }
                    return post;
                }),
                userPosts: state.userPosts.map((post) => {
                    if (post?.id === postId) {
                        const deletedComment = post.comments.find(comment => comment.id === commentId);
                        const repliesCount = deletedComment?.replies?.length || 0;
                        return {
                            ...post,
                            comments: post.comments.filter(comment => comment.id !== commentId),
                            commentCount: Math.max(0, (post.commentCount || 0) - 1 - repliesCount) // Giảm cả comment và replies
                        }
                    }
                    return post;
                }),
                loading: false
            }))
            toast.success("Xóa bình luận thành công.")
        } catch (error) {
            console.error("❌ Error deleting comment:", error);
            set({ error, loading: false })
            toast.error("Đã xảy ra lỗi khi xóa bình luận. Vui lòng thử lại.")
        }
    },

    handleDeleteReply: async (postId, commentId, replyId) => {
        set({ loading: true })
        try {
            await deleteReply(postId, commentId, replyId)
            
            // Cập nhật state sau khi xóa reply cho cả posts và userPosts
            set((state) => ({
                posts: state.posts.map((post) =>
                    post?.id === postId
                        ? {
                            ...post,
                            comments: post.comments.map((comment) =>
                                comment?.id === commentId
                                    ? {
                                        ...comment,
                                        replies: comment.replies.filter(reply => reply.id !== replyId)
                                    }
                                    : comment
                            ),
                            commentCount: Math.max(0, (post.commentCount || 0) - 1) // Giảm số lượng comment
                        }
                        : post
                ),
                userPosts: state.userPosts.map((post) =>
                    post?.id === postId
                        ? {
                            ...post,
                            comments: post.comments.map((comment) =>
                                comment?.id === commentId
                                    ? {
                                        ...comment,
                                        replies: comment.replies.filter(reply => reply.id !== replyId)
                                    }
                                    : comment
                            ),
                            commentCount: Math.max(0, (post.commentCount || 0) - 1) // Giảm số lượng comment
                        }
                        : post
                ),
                loading: false
            }))
            toast.success("Xóa phản hồi thành công.")
        } catch (error) {
            console.error("❌ Error deleting reply:", error);
            set({ error, loading: false })
            toast.error("Đã xảy ra lỗi khi xóa phản hồi. Vui lòng thử lại.")
        }
    },

    handleLikeComment: async (postId, commentId) => {
        set({ loading: true })
        try {
            const result = await likeComment(postId, commentId)
            
            // Cập nhật state sau khi like comment cho cả posts và userPosts
            set((state) => ({
                posts: state.posts.map((post) =>
                    post?.id === postId
                        ? {
                            ...post,
                            comments: post.comments.map((comment) =>
                                comment?.id === commentId
                                    ? {
                                        ...comment,
                                        reactions: result.data.reactions
                                    }
                                    : comment
                            )
                        }
                        : post
                ),
                userPosts: state.userPosts.map((post) =>
                    post?.id === postId
                        ? {
                            ...post,
                            comments: post.comments.map((comment) =>
                                comment?.id === commentId
                                    ? {
                                        ...comment,
                                        reactions: result.data.reactions
                                    }
                                    : comment
                            )
                        }
                        : post
                ),
                loading: false
            }))
        } catch (error) {
            console.error("❌ Error liking comment:", error);
            set({ error, loading: false })
            toast.error("Đã xảy ra lỗi khi thích bình luận. Vui lòng thử lại.")
        }
    },
}))