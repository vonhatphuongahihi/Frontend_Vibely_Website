"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import LeftSideBar from "../components/LeftSideBar";
import Link from "next/link";
import { FaFileContract, FaShieldAlt } from "react-icons/fa";

const SupportPage = () => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isEmpty, setEmpty] = useState();
    const [token, setToken] = useState(null);
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

    // Lấy token từ localStorage trên client
    useEffect(() => {
        const storedToken = localStorage.getItem("auth_token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleSubmit = async () => {
        if (!message.trim()) {
            setEmpty(true);
            return;
        }

        setLoading(true);
        setEmpty(false);

        try {
            const response = await axios.post(`${API_URL}/inquiry`, { message }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === 'success') {
                setMessage("");
                toast.success("Thắc mắc đã được gửi thành công!");
            } else {
                toast.error("Gửi thất bại, vui lòng thử lại.");
            }
        } catch (error) {
            toast.error(error.message || "Đã xảy ra lỗi khi gửi thắc mắc.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-2 lg:p-10 pt-14 ">
            <div className="md:hidden">
                <LeftSideBar />
            </div>
            <div className="max-w-7xl w-full flex md:gap-20">
                {/* Hình ảnh bên trái */}
                <div className="w-1/2 flex justify-center items-center">
                    <Image
                        src="/images/faq-image.png"
                        alt="FAQ Illustration"
                        width={500}
                        height={500}
                    />
                </div>

                {/* Form bên phải */}
                <div className="w-1/2 flex flex-col justify-center px-2 lg:px-10">
                    <p className="text-xl md:text-2xl font-bold mb-6 text-center">GỬI THẮC MẮC</p>
                    <p className="mb-5">
                        Vui lòng cung cấp đầy đủ thông tin về vấn đề bạn gặp phải. Chúng tôi sẽ xử lý yêu cầu của bạn nhanh chóng và chính xác hơn.
                    </p>
                    <Textarea
                        className="w-full p-3 border border-gray-500 placeholder:text-gray-400 rounded-lg md:text-base send-inquiry-textarea"
                        placeholder="Nhập ở đây..."
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    {isEmpty && <p className="mt-2 text-sm text-[#FF0000]">Vui lòng nhập nội dung thắc mắc</p>}
                    <div className="flex justify-end mt-6">
                        <Button
                            variant="default"
                            size="lg"
                            className="bg-[#086280] text-white text-md py-2 px-7 rounded-lg hover:bg-[#07556F] transition duration-300 send-inquiry-button"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Đang gửi..." : "Gửi"}
                        </Button>
                    </div>

                    {/* Links to Terms and Privacy Policy */}
                    <div className="mt-12 border-t border-gray-200 pt-8">
                        <div className="text-center text-gray-600 mb-4 font-medium">Tài liệu quan trọng</div>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <Link href="/terms-of-service" className="flex-1">
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2 py-5 border border-[#38affa] text-[#38affa] hover:bg-[#38affa] hover:text-white transition-all duration-300 bg-white"
                                >
                                    <FaFileContract className="text-lg" />
                                    <span>Điều khoản sử dụng</span>
                                </Button>
                            </Link>
                            <Link href="/privacy-policy" className="flex-1">
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2 py-5 border border-[#38affa] text-[#38affa] hover:bg-[#38affa] hover:text-white transition-all duration-300 bg-white"
                                >
                                    <FaShieldAlt className="text-lg" />
                                    <span>Chính sách bảo mật</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SupportPage;