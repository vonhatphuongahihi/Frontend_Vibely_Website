"use client";
import { FaLock, FaUserGraduate, FaUsers, FaChartLine, FaShieldAlt, FaExclamationCircle, FaCheckCircle, FaEye, FaEdit, FaTrashAlt, FaBan, FaInfoCircle, FaUserShield, FaSignOutAlt, FaEnvelope, FaBuilding, FaExclamationTriangle, FaPaperPlane, FaPhone, FaGraduationCap, FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaLockOpen } from "react-icons/fa";

export default function PrivacyPolicy() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-5xl">
            {/* Policy Header */}
            <div className="flex items-center space-x-4 mt-10">
                <h1 className="text-2xl font-bold">Chính Sách Bảo Mật</h1>
            </div>
            <p className="text-gray-500 mt-4">Cập nhật lần cuối: 27/05/2025</p>

            {/* Policy Content */}
            <div className="px-8 py-10">
                <section className="mb-12">
                    <p className="text-lg leading-relaxed mb-6">
                        Vibely cam kết bảo vệ quyền riêng tư của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng, chia sẻ và bảo vệ thông tin cá nhân của bạn khi sử dụng nền tảng học tập xã hội Vibely. Vui lòng đọc kỹ chính sách này.
                    </p>
                </section>

                <div className="space-y-12">
                    {/* Section 1 */}
                    <section>
                        <div className="flex items-center mb-6">
                            <div className="bg-[#4F46E5] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-4">1</div>
                            <p className="text-2xl font-bold">Thông tin chúng tôi thu thập</p>
                        </div>
                        <div className="pl-14">
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-3 text-[#4F46E5]">Thông tin cá nhân</h3>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>Thông tin tài khoản (tên, email, ảnh đại diện)</li>
                                    <li>Thông tin liên hệ để xác minh</li>
                                </ul>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-3 text-[#4F46E5]">Dữ liệu sử dụng</h3>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>Lịch trình học tập</li>
                                    <li>Thông tin thiết bị, địa chỉ IP</li>
                                    <li>Cookie và thói quen sử dụng</li>
                                    <li>Hoạt động cộng đồng, bài đăng diễn đàn</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <div className="border-b-2 border-dashed border-gray-200"></div>

                    {/* Section 2 */}
                    <section>
                        <div className="flex items-center mb-6">
                            <div className="bg-[#4F46E5] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-4">2</div>
                            <p className="text-2xl font-bold">Cách chúng tôi sử dụng thông tin</p>
                        </div>
                        <div className="pl-14">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-lg">
                                    <FaUserGraduate className="text-[#4F46E5] text-2xl mt-1 mb-2" />
                                    <h3 className="text-lg font-semibold mb-2">Cá nhân hóa học tập</h3>
                                    <p className="text-gray-700">Đề xuất nội dung phù hợp với nhu cầu và sở thích của bạn.</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg">
                                    <FaUsers className="text-[#4F46E5] text-2xl mt-1 mb-2" />
                                    <h3 className="text-lg font-semibold mb-2">Tính năng cộng đồng</h3>
                                    <p className="text-gray-700">Kết nối học nhóm, diễn đàn, bạn bè và các hoạt động xã hội.</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg">
                                    <FaChartLine className="text-[#4F46E5] text-2xl mt-1 mb-2" />
                                    <h3 className="text-lg font-semibold mb-2">Cải tiến nền tảng</h3>
                                    <p className="text-gray-700">Phân tích hành vi sử dụng để nâng cao trải nghiệm và chức năng.</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg">
                                    <FaShieldAlt className="text-[#4F46E5] text-2xl mt-1 mb-2" />
                                    <h3 className="text-lg font-semibold mb-2">Bảo mật & Tuân thủ</h3>
                                    <p className="text-gray-700">Bảo vệ khỏi gian lận, tuân thủ pháp luật và điều khoản sử dụng.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="border-b-2 border-dashed border-gray-200"></div>

                    {/* Section 3 */}
                    <section>
                        <div className="flex items-center mb-6">
                            <div className="bg-[#4F46E5] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-4">3</div>
                            <p className="text-2xl font-bold">Quyền riêng tư của bạn</p>
                        </div>
                        <div className="pl-14">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border border-gray-200 rounded-lg p-5 bg-white">
                                    <h3 className="font-semibold mb-2 flex items-center">
                                        <FaEye className="text-[#4F46E5] text-2xl mt-1 mr-2" />
                                        Truy cập & Tải về dữ liệu
                                    </h3>
                                    <p className="text-gray-700">Yêu cầu bản sao dữ liệu cá nhân của bạn.</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-5 bg-white">
                                    <h3 className="font-semibold mb-2 flex items-center">
                                        <FaEdit className="text-[#4F46E5] text-2xl mt-1 mr-2" />
                                        Chỉnh sửa
                                    </h3>
                                    <p className="text-gray-700">Cập nhật hoặc chỉnh sửa thông tin cá nhân không chính xác.</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-5 bg-white">
                                    <h3 className="font-semibold mb-2 flex items-center">
                                        <FaTrashAlt className="text-[#4F46E5] text-2xl mt-1 mr-2" />
                                        Xóa dữ liệu
                                    </h3>
                                    <p className="text-gray-700">Yêu cầu xóa dữ liệu cá nhân trong một số trường hợp.</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-5 bg-white">
                                    <h3 className="font-semibold mb-2 flex items-center">
                                        <FaBan className="text-[#4F46E5] text-2xl mt-1 mr-2" />
                                        Phản đối
                                    </h3>
                                    <p className="text-gray-700">Phản đối việc xử lý dữ liệu trong một số trường hợp.</p>
                                </div>
                            </div>
                            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                                <p className="text-blue-800 flex items-start">
                                    <FaInfoCircle className="text-blue-500 mr-2 mt-1" />
                                    Để thực hiện các quyền này, vui lòng liên hệ <a href="mailto:22521172@gm.uit.edu.vn" className="text-blue-600 underline ml-1">22521172@gm.uit.edu.vn</a>. Chúng tôi sẽ phản hồi trong vòng 3 ngày.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="border-b-2 border-dashed border-gray-200"></div>

                    {/* Section 4 */}
                    <section>
                        <div className="flex items-center mb-6">
                            <div className="bg-[#4F46E5] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-4">4</div>
                            <p className="text-2xl font-bold">Bảo mật dữ liệu</p>
                        </div>
                        <div className="pl-14">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-3 text-[#4F46E5]">Biện pháp bảo mật của chúng tôi</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <FaCheckCircle className="text-emerald-500 mr-2 mt-1" />
                                            <span>Mã hóa dữ liệu khi truyền tải và lưu trữ</span>
                                        </li>
                                        <li className="flex items-start">
                                            <FaCheckCircle className="text-emerald-500 mr-2 mt-1" />
                                            <span>Kiểm tra bảo mật định kỳ, kiểm thử xâm nhập</span>
                                        </li>
                                        <li className="flex items-start">
                                            <FaCheckCircle className="text-emerald-500 mr-2 mt-1" />
                                            <span>Kiểm soát truy cập, phân quyền hợp lý</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-3 text-[#4F46E5]">Trách nhiệm của bạn</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <FaUserShield className="text-blue-500 mr-2 mt-1" />
                                            <span>Sử dụng mật khẩu mạnh, không trùng lặp</span>
                                        </li>
                                        <li className="flex items-start">
                                            <FaExclamationTriangle className="text-amber-500 mr-2 mt-1" />
                                            <span>Cẩn trọng khi chia sẻ thông tin cá nhân trên diễn đàn công khai</span>
                                        </li>
                                        <li className="flex items-start">
                                            <FaSignOutAlt className="text-blue-500 mr-2 mt-1" />
                                            <span>Đăng xuất sau khi sử dụng thiết bị công cộng</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="border-b-2 border-dashed border-gray-200"></div>

                    {/* Section 5 */}
                    <section>
                        <div className="flex items-center mb-6">
                            <div className="bg-[#4F46E5] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-4">5</div>
                            <p className="text-2xl font-bold">Thay đổi chính sách</p>
                        </div>
                        <div className="pl-14">
                            <div className="bg-purple-50 p-4 rounded-lg mb-4">
                                <p className="text-purple-800">
                                    Chúng tôi có thể cập nhật chính sách này để phù hợp với thực tế, công nghệ, quy định pháp luật. Khi cập nhật, chúng tôi sẽ thay đổi ngày "Cập nhật lần cuối" ở đầu trang.
                                </p>
                            </div>
                            <p className="mb-4">
                                Nếu có thay đổi quan trọng ảnh hưởng đến quyền lợi của bạn, chúng tôi sẽ:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mb-6">
                                <li>Thông báo nổi bật trên nền tảng trước khi áp dụng</li>
                                <li>Gửi email trực tiếp khi cần thiết</li>
                                <li>Cho phép bạn xem xét trước khi thay đổi có hiệu lực</li>
                            </ul>
                            <p>
                                Hãy thường xuyên kiểm tra trang này để cập nhật thông tin mới nhất về chính sách bảo mật của chúng tôi.
                            </p>
                        </div>
                    </section>

                    <div className="border-b-2 border-dashed border-gray-200"></div>

                    {/* Contact Section */}
                    <section>
                        <div className="flex items-center mb-6">
                            <FaEnvelope className="text-[#4F46E5] text-2xl mr-4" />
                            <p className="text-2xl font-bold">Liên hệ</p>
                        </div>
                        <div className="pl-14">
                            <p className="mb-6">
                                Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật hoặc cách chúng tôi xử lý dữ liệu, vui lòng liên hệ:
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">

                                <div className="flex flex-col items-start space-y-2">
                                    <div className="flex items-start">
                                        <FaEnvelope className="text-gray-500 mt-1 mr-3" />
                                        <p className="text-gray-700">
                                            Email: <a href="mailto:22521172@gm.uit.edu.vn" className="text-blue-600 underline">22521172@gm.uit.edu.vn</a>
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <FaPhone className="text-gray-500 mt-1 mr-3" />
                                        <p className="text-gray-700">Điện thoại: +84 365 486 141</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}