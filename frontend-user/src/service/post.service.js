import axiosInstance from "./url.service"
//Các phương thức dùng để tương tác với API

//Phương thức tạo bài viết
export const createPost = async(postData) => {
    try {
        const result = await axiosInstance.post('/users/posts',postData)
        return result?.data?.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

//Phương thức tạo story
export const createStory = async(storyData) => {
    try {
        const result = await axiosInstance.post('/users/story',storyData)
        return result?.data?.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

//Phương thức lấy tất cả bài viết
export const getAllPosts = async() => {
    try {
        const result = await axiosInstance.get('/users/posts')
        return result?.data?.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

//phương thức lấy tất cả story
export const getAllStories = async() => {
    try {
        const result = await axiosInstance.get('/users/story')
        return result?.data?.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

// phương thức để react cho một bài viết
export const reactPost = async (postId, reactType) => {
    try {
        const result = await axiosInstance.post(`users/posts/reacts/${postId}`, { type: reactType });
        return result?.data;
    } catch (error) {
        console.error("Lỗi khi react bài viết:", error);
        throw error;
    }
};

// phương thức để comment cho một bài viết
export const addCommentToPost = async(postId,commentText) => {
    try {
        const result = await axiosInstance.post(`/users/posts/comments/${postId}`,commentText)
        return result?.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

// phương thức để share cho một bài viết
export const sharePost = async(postId) => {
    try {
        const result = await axiosInstance.post(`/users/posts/share/${postId}`)
        return result?.data?.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

//Phương thức lấy tất cả bài viết của người dùng
export const getPostByUserId = async(userId) => {
    try {
        const result = await axiosInstance.get(`/users/posts/user/${userId}`)
        return result?.data?.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const reactStory = async (postId) => {
    try {
        const result = await axiosInstance.post(`users/story/reacts/${postId}`);
        return result?.data;
    } catch (error) {
        console.error("Lỗi khi react bài viết:", error);
        throw error;
    }
};