import { checkAdminAuth } from "@/service/authAdmin.service";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
    try {
        const { isAuthenticated } = await checkAdminAuth();

        if (!isAuthenticated) {
            redirect("/admin-login");
        }
    } catch (error) {
        console.error("Lỗi kiểm tra đăng nhập:", error);
        redirect("/admin-login");
    }
}; 