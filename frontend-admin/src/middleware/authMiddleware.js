import { checkAdminAuth } from "@/service/authAdmin.service";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
    try {
        // Kiểm tra nếu đang ở trang login thì không cần check auth
        if (window.location.pathname === '/admin-login') {
            return;
        }

        const token = localStorage.getItem('adminToken');
        if (!token) {
            redirect("/admin-login");
            return;
        }

        const { isAuthenticated } = await checkAdminAuth();
        if (!isAuthenticated) {
            localStorage.removeItem('adminToken');
            redirect("/admin-login");
        }
    } catch (error) {
        console.error("Lỗi kiểm tra đăng nhập:", error);
        localStorage.removeItem('adminToken');
        redirect("/admin-login");
    }
};