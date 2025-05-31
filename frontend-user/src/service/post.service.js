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

        const result = await axiosInstance.post('/users/story', storyData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        // Kiểm tra response
        if (!result?.data?.data) {
            console.error("Response không chứa dữ liệu story:", result);
            throw new Error("Không nhận được dữ liệu story từ server");
        }

        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi chi tiết khi tạo story:", error.response?.data || error.message);
        throw error;
    }
}

//Phương thức lấy tất cả bài viết
export const getAllPosts = async () => {
    try {
        const result = await axiosInstance.get('/users/posts')
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

//Phương thức lấy tất cả bài viết của người dùng
export const getAllUserPosts = async (userId) => {
    try {
        const result = await axiosInstance.get(`/users/posts/user/${userId}`)
        return result?.data?.data;
    } catch (error) {
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
        return result?.data;
    } catch (error) {
        //console.error("Lỗi khi react bài viết:", error);
        throw error;
    }
};

// phương thức để comment cho một bài viết
export const addCommentToPost = async (postId, commentText) => {
    try {
        const result = await axiosInstance.post(`/users/posts/comments/${postId}`, commentText)
        return result?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

export const addReplyToPost = async (postId, commentId, replyText) => {
    try {
        const result = await axiosInstance.post(`/users/posts/reply/${postId}`, { commentId, replyText })
        return result?.data
    } catch (error) {
        //console.error(error)
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

//Phương thức lấy 1 bài viết theo ID
export const getSinglePost = async (postId) => {
    try {
        const result = await axiosInstance.get(`/users/posts/${postId}`)
        return result?.data?.data
    } catch (error) {
        //console.error(error)
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
        //console.error(error)
        throw error
    }
}

export const deleteReply = async (postId, commentId, replyId) => {
    try {
        const result = await axiosInstance.delete(`/users/posts/deleteReply/${postId}/${commentId}/${replyId}`)
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

export const likeComment = async (postId, commentId) => {
    try {
        const result = await axiosInstance.post(`/users/posts/reactComment/${postId}/${commentId}`)
        return result?.data
    } catch (error) {
        //console.error(error)
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