// Lấy token từ localStorage
export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }
    return null;
};

// Tạo headers với token
export const getAuthHeaders = () => {
    const token = getToken();
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

// Kiểm tra xem người dùng đã đăng nhập chưa
export const isAuthenticated = () => {
    return !!getToken();
};

// Đăng xuất
export const logout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    window.location.href = '/admin-login';
}; 