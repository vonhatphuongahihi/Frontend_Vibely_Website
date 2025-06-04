import axiosInstance from "./url.service";
//Các phương thức dùng để tương tác với API

//Phương thức tạo bài viết
export const createPost = async (postData) => {
    try {
        // Kiểm tra kích thước file nếu có
        const file = postData.get('file');
        if (file) {
            // Kiểm tra nếu là video và kích thước quá lớn
            if (file.type.startsWith('video/') && file.size > 90 * 1024 * 1024) {
                throw new Error("Video quá lớn, vui lòng chọn video nhỏ hơn 90MB");
            }
        }

        const result = await axiosInstance.post('/users/posts', postData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000, // Tăng timeout lên 60 giây cho file lớn
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi tạo bài viết:", error);
        if (error.response?.status === 413) {
            throw new Error("File quá lớn. Vui lòng chọn file nhỏ hơn.");
        }
        throw error;
    }
};

//Phương thức tạo story
export const createStory = async (storyData) => {
    try {
        // Kiểm tra xem formData có file không
        if (!storyData.get('file')) {
            console.error("Không có file trong formData");
            throw new Error("Không có file để tạo story");
        }

        const file = storyData.get('file');
        // Kiểm tra kích thước file nếu là video
        if (file.type.startsWith('video/') && file.size > 90 * 1024 * 1024) {
            throw new Error("Video quá lớn, vui lòng chọn video nhỏ hơn 90MB");
        }

        const result = await axiosInstance.post('/users/story', storyData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 120000, // Tăng timeout lên 2 phút cho video
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`Upload Progress: ${percentCompleted}%`);
            }
        })

        // Kiểm tra response
        if (!result?.data?.data) {
            console.error("Response không chứa dữ liệu story:", result);
            throw new Error("Không nhận được dữ liệu story từ server");
        }

        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi chi tiết khi tạo story:", error.response?.data || error.message);
        if (error.code === 'ECONNABORTED') {
            throw new Error("Yêu cầu hết thời gian chờ. Vui lòng thử lại.");
        }
        if (error.response?.status === 413) {
            throw new Error("File quá lớn. Vui lòng chọn file nhỏ hơn.");
        }
        throw error;
    }
}

//Phương thức lấy tất cả bài viết với thông tin user đầy đủ
export const getAllPosts = async () => {
    try {
        const result = await axiosInstance.get('/users/posts')
        const posts = result?.data?.data

        // Lấy thông tin user cho mỗi comment và reply
        const postsWithUserInfo = await Promise.all(posts.map(async (post) => {
            if (post.comments && post.comments.length > 0) {
                const commentsWithUserInfo = await Promise.all(
                    post.comments.map(async (comment) => {
                        try {
                            // Lấy thông tin user cho comment
                            const commentUserId = comment.user?.id || comment.user_id
                            let userInfo = null
                            if (commentUserId) {
                                try {
                                    userInfo = await getUserInfo(commentUserId)
                                } catch (error) {
                                    console.error(`❌ Lỗi khi lấy thông tin user cho comment ${comment._id}:`, error)
                                }
                            } else {
                                console.warn(`⚠️ Comment ${comment._id} không có user ID hợp lệ`);
                            }

                            // Lấy user cho từng reply
                            let repliesWithUserInfo = []
                            if (comment.replies && comment.replies.length > 0) {
                                repliesWithUserInfo = await Promise.all(
                                    comment.replies.map(async (reply) => {
                                        const replyUserId = reply.user?.id || reply.user_id
                                        const replyUserInfo = replyUserId ? await getUserInfo(replyUserId) : null
                                        return {
                                            ...reply,
                                            user: replyUserInfo,
                                        }
                                    })
                                )
                            }

                            return {
                                ...comment,
                                user: userInfo,
                                replies: repliesWithUserInfo,
                            }
                        } catch (error) {
                            console.error(`Lỗi khi lấy thông tin user cho comment ${comment._id}:`, error)
                            return comment
                        }
                    })
                )
                return {
                    ...post,
                    comments: commentsWithUserInfo
                }
            }
            return post
        }))

        return postsWithUserInfo
    } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error)
        throw error
    }
}

//Phương thức lấy tất cả bài viết của người dùng
export const getAllUserPosts = async (userId) => {
    try {
        const result = await axiosInstance.get(`/users/posts/user/${userId}`)
        const posts = result?.data?.data;

        // Lấy thông tin user cho mỗi comment
        const postsWithUserInfo = await Promise.all(posts.map(async (post) => {
            if (post.comments && post.comments.length > 0) {
                const commentsWithUserInfo = await Promise.all(
                    post.comments.map(async (comment) => {
                        try {
                            const userInfo = await getUserInfo(comment.user_id)
                            return {
                                ...comment,
                                user: userInfo
                            }
                        } catch (error) {
                            console.error(`Lỗi khi lấy thông tin user cho comment ${comment._id}:`, error)
                            return comment
                        }
                    })
                )
                return {
                    ...post,
                    comments: commentsWithUserInfo
                }
            }
            return post
        }))

        return postsWithUserInfo;
    } catch (error) {
        console.error("Lỗi khi lấy bài viết của user:", error)
        throw error;
    }
}

//phương thức lấy tất cả story
export const getAllStories = async () => {
    try {
        const result = await axiosInstance.get('/users/story')
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

// phương thức để react cho một bài viết
export const reactPost = async (postId, reactType) => {
    try {
        const result = await axiosInstance.post(`users/posts/react/${postId}`, { type: reactType });
        console.log("🔍 React API response:", result?.data);
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi react bài viết:", error);
        throw error;
    }
};

// phương thức để comment cho một bài viết
export const addCommentToPost = async (postId, commentData) => {
    try {
        const result = await axiosInstance.post(`/users/posts/comments/${postId}`, commentData)
        console.log("🔍 API comment response:", result?.data);
        
        // Backend bây giờ trả về comment data trực tiếp với user_id
        if (result?.data?.data?.user_id) {
            try {
                const userInfo = await getUserInfo(result.data.data.user_id)
                return {
                    ...result.data,
                    data: {
                        ...result.data.data,
                        user: userInfo,
                        // Đảm bảo có các trường cần thiết
                        id: result.data.data.id,
                        text: result.data.data.text,
                        createdAt: result.data.data.createdAt,
                        reactions: result.data.data.reactions || [],
                        replies: result.data.data.replies || []
                    }
                }
            } catch (userError) {
                console.error("Lỗi khi lấy thông tin user:", userError)
                // Nếu không lấy được thông tin user, vẫn trả về comment
                return {
                    ...result.data,
                    data: {
                        ...result.data.data,
                        id: result.data.data.id,
                        text: result.data.data.text,
                        createdAt: result.data.data.createdAt,
                        reactions: result.data.data.reactions || [],
                        replies: result.data.data.replies || []
                    }
                }
            }
        }
        return result?.data
    } catch (error) {
        console.error("Lỗi khi thêm comment:", error)
        throw error
    }
}

export const addReplyToPost = async (postId, commentId, replyText) => {
    try {
        const result = await axiosInstance.post(`/users/posts/reply/${postId}`, {
            commentId,
            text: replyText
        })
        // Lấy thông tin user cho reply mới
        if (result?.data?.data?.user_id) {
            try {
                const userInfo = await getUserInfo(result.data.data.user_id)
                return {
                    ...result.data,
                    data: {
                        ...result.data.data,
                        user: userInfo,
                        text: result.data.data.text,
                        id: result.data.data.id || result.data.data._id // Đảm bảo có id
                    }
                }
            } catch (userError) {
                console.error("Lỗi khi lấy thông tin user:", userError)
                return {
                    ...result.data,
                    data: {
                        ...result.data.data,
                        text: result.data.data.text,
                        id: result.data.data.id || result.data.data._id
                    }
                }
            }
        }
        return result?.data
    } catch (error) {
        console.error("Lỗi khi thêm reply:", error)
        throw error
    }
}

// phương thức để share cho một bài viết
export const sharePost = async (postId) => {
    try {
        const result = await axiosInstance.post(`/users/posts/share/${postId}`)
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

//Phương thức lấy 1 bài viết theo ID với thông tin user đầy đủ
export const getSinglePost = async (postId) => {
    try {
        const result = await axiosInstance.get(`/users/posts/${postId}`)
        const post = result?.data?.data

        // Lấy thông tin user cho mỗi comment và reply
        if (post.comments && post.comments.length > 0) {
            const commentsWithUserInfo = await Promise.all(
                post.comments.map(async (comment) => {
                    try {
                        const userId = comment.user?.id || comment.user_id
                        if (userId) {
                            const userInfo = await getUserInfo(userId)
                            // Xử lý replies nếu có
                            let repliesWithUserInfo = []
                            if (comment.replies && comment.replies.length > 0) {
                                repliesWithUserInfo = await Promise.all(
                                    comment.replies.map(async (reply) => {
                                        try {
                                            const replyUserId = reply.user?.id || reply.user_id
                                            if (replyUserId && replyUserId !== 'undefined') {
                                                try {
                                                    const replyUserInfo = await getUserInfo(replyUserId)
                                                    return {
                                                        ...reply,
                                                        user: replyUserInfo,
                                                        text: reply.text || reply.content // Đảm bảo có trường text
                                                    }
                                                } catch (error) {
                                                    console.error(`❌ Lỗi khi lấy thông tin user cho reply ${reply._id}:`, error)
                                                    return {
                                                        ...reply,
                                                        text: reply.text || reply.content
                                                    }
                                                }
                                            } else {
                                                console.warn(`⚠️ Reply ${reply._id} không có user ID hợp lệ:`, replyUserId);
                                                return {
                                                    ...reply,
                                                    text: reply.text || reply.content
                                                }
                                            }
                                        } catch (error) {
                                            console.error(`❌ Lỗi khi xử lý reply ${reply._id}:`, error)
                                            return reply
                                        }
                                    })
                                )
                            }
                            return {
                                ...comment,
                                user: userInfo,
                                replies: repliesWithUserInfo
                            }
                        }
                        return comment
                    } catch (error) {
                        console.error(`Lỗi khi lấy thông tin user cho comment ${comment._id}:`, error)
                        return comment
                    }
                })
            )
            return {
                ...post,
                comments: commentsWithUserInfo
            }
        }

        return post
    } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error)
        throw error
    }
}
//tim story
export const reactStory = async (postId) => {
    try {
        const result = await axiosInstance.post(`users/story/react/${postId}`);
        return result?.data;
    } catch (error) {
        //console.error("Lỗi khi react bài viết:", error);
        throw error;
    }
};

//xóa bài viết
export const deletePost = async (postId) => {
    try {
        const result = await axiosInstance.delete(`/users/posts/delete/${postId}`)
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

export const deleteComment = async (postId, commentId) => {
    try {
        const result = await axiosInstance.delete(`/users/posts/deleteComment/${postId}/${commentId}`)
        return result?.data?.data
    } catch (error) {
        console.error("Lỗi khi xóa comment:", error)
        throw error
    }
}

export const deleteReply = async (postId, commentId, replyId) => {
    try {
        const result = await axiosInstance.delete(`/users/posts/deleteReply/${postId}/${commentId}/${replyId}`)
        return result?.data?.data
    } catch (error) {
        console.error("Lỗi khi xóa reply:", error)
        throw error
    }
}

export const likeComment = async (postId, commentId) => {
    try {
        const result = await axiosInstance.post(`/users/posts/reactComment/${postId}/${commentId}`)
        return result?.data
    } catch (error) {
        console.error("Lỗi khi like comment:", error)
        throw error
    }
}
//Phương thức sửa bài viết
export const editPost = async (postId, postData) => {
    try {
        // Log để debug
        console.log("Editing post:", postId);
        console.log("Post data:", postData);

        // Kiểm tra nếu postData đã là FormData thì dùng luôn
        // Nếu không thì tạo FormData mới
        let formData;
        if (postData instanceof FormData) {
            formData = postData;
        } else {
            formData = new FormData();
            if (postData.content !== undefined) {
                formData.append('content', postData.content);
            }
            if (postData.file) {
                formData.append('file', postData.file);
            }
            if (postData.removeMedia !== undefined) {
                formData.append('removeMedia', postData.removeMedia);
            }
        }

        // Log FormData contents để debug
        console.log("FormData contents:");
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const result = await axiosInstance.put(`/users/posts/edit/${postId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000, // Giảm timeout xuống 30 giây
        });

        console.log("Edit post result:", result?.data);
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi sửa bài viết:", error);

        // Xử lý các loại lỗi cụ thể
        if (error.code === 'ECONNABORTED') {
            throw new Error("Yêu cầu hết thời gian chờ. Vui lòng thử lại.");
        }

        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);

            if (error.response.status === 413) {
                throw new Error("File quá lớn. Vui lòng chọn file nhỏ hơn.");
            }

            if (error.response.status === 403) {
                throw new Error("Bạn không có quyền chỉnh sửa bài viết này.");
            }

            if (error.response.status === 404) {
                throw new Error("Không tìm thấy bài viết.");
            }

            // Sử dụng message từ backend nếu có
            if (error.response.data?.message) {
                throw new Error(error.response.data.message);
            }
        }

        if (error.request) {
            throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
        }

        throw new Error("Đã xảy ra lỗi khi chỉnh sửa bài viết. Vui lòng thử lại.");
    }
}

export const deleteStory = async (storyId) => {
    try {
        const result = await axiosInstance.delete(`/users/story/${storyId}`)
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

// Phương thức lấy thông tin user cho comment
export const getUserInfo = async (userId) => {
    try {
        // Kiểm tra userId hợp lệ
        if (!userId || userId === 'undefined' || userId === undefined) {
            throw new Error("User ID không hợp lệ");
        }
        
        const result = await axiosInstance.get(`/users/info/${userId}`)
        const userData = result?.data?.data
        // Chỉ lấy thông tin cần thiết
        return {
            id: userData.id,
            username: userData.username,
            profilePicture: userData.profilePicture
        }
    } catch (error) {
        // Return fallback data thay vì throw error để không crash
        return {
            id: userId || 'unknown',
            username: 'User không xác định',
            profilePicture: null
        }
    }
}