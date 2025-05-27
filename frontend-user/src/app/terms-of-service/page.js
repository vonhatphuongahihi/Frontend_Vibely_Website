"use client";
import { FaFileContract, FaUserCheck, FaBan, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaEnvelope, FaBuilding, FaPhone, FaGraduationCap, FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function TermsOfService() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-5xl">
            {/* Policy Header */}
            <div className="flex items-center space-x-4 mt-10">
                <h1 className="text-2xl font-bold">Điều Khoản Sử Dụng</h1>
            </div>
            <p className="text-gray-500 mt-4">Cập nhật lần cuối: 27/05/2025</p>

            {/* Policy Content */}
            <div className="px-8 py-10">
                <section className="mb-12">
                    <p className="text-lg leading-relaxed mb-6">
                        Chào mừng bạn đến với Vibely - mạng xã hội học tập kết nối cộng đồng người học. Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản sử dụng được nêu dưới đây.
                    </p>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-800 flex items-start">
                            <FaInfoCircle className="text-blue-500 mr-2 mt-1" />
                            <span>Lưu ý quan trọng: Vui lòng đọc kỹ các điều khoản này trước khi sử dụng nền tảng của chúng tôi. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng Vibely.</span>
                        </p>
                    </div>
                </section>

                <div className="space-y-12">
                    {/* Section 1 */}
                    <section>
                        <div className="flex items-center mb-6">
                            <div className="bg-[#4F46E5] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-4">1</div>
                            <h2 className="text-2xl font-bold">Chấp nhận điều khoản</h2>
                        </div>
                        <div className="pl-14">
                            <p className="mb-4">
                                Khi tạo tài khoản hoặc sử dụng dịch vụ Vibely, bạn xác nhận rằng:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 mb-6">
                                <li>Bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các điều khoản này</li>
                                <li>Bạn đủ tuổi theo quy định pháp luật để sử dụng dịch vụ của chúng tôi</li>
                                <li>Bạn cung cấp thông tin chính xác và sẽ cập nhật khi có thay đổi</li>
                            </ul>

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="flex items-start">
                                    <FaUserCheck className="text-[#4F46E5] mt-1 mr-3" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Tài khoản cá nhân</h3>
                                        <p className="text-gray-700 text-sm">Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn ra trên tài khoản của bạn.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="border-b-2 border-dashed border-gray-200"></div>

                    {/* Section 2 */}
                    <section>
                        <div className="flex items-center mb-6">
                            <div className="bg-[#4F46E5] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-4">2</div>
                            <h2 className="text-2xl font-bold">Quy định sử dụng</h2>
                        </div>
                        <div className="pl-14">
                            <p className="mb-4">
                                Khi sử dụng Vibely, bạn cam kết:
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                                    <div className="flex items-start">
                                        <FaBan className="text-red-500 mr-3 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-red-700 mb-1">Không được phép</h3>
                                            <ul className="list-disc pl-5 space-y-1 text-sm text-red-600">
                                                <li>Sử dụng cho mục đích trái pháp luật</li>
                                                <li>Khai thác lỗ hổng hoặc phá hoại hệ thống</li>
                                                <li>Đăng tải nội dung xúc phạm, bạo lực</li>
                                                <li>Quấy rối người dùng khác</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                                    <div className="flex items-start">
                                        <FaCheckCircle className="text-green-500 mr-3 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-green-700 mb-1">Nên làm</h3>
                                            <ul className="list-disc pl-5 space-y-1 text-sm text-green-600">
                                                <li>Tôn trọng quyền riêng tư của người khác</li>
                                                <li>Chia sẻ kiến thức hữu ích</li>
                                                <li>Báo cáo nội dung vi phạm</li>
                                                <li>Tuân thủ quy định cộng đồng</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                                <p className="text-amber-700 flex items-start">
                                    <FaExclamationTriangle className="text-amber-500 mr-2 mt-1" />
                                    <span>Cảnh báo: Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản nếu phát hiện hành vi vi phạm mà không cần báo trước.</span>
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="border-b-2 border-dashed border-gray-200"></div>

                    {/* Section 3 */}
                    <section>
                        <div className="flex items-center mb-6">
                            <div className="bg-[#4F46E5] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-4">3</div>
                            <h2 className="text-2xl font-bold">Nội dung người dùng</h2>
                        </div>
                        <div className="pl-14">
                            <div className="flex flex-col md:flex-row gap-8 mb-6">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-3 text-[#4F46E5]">Đăng tải nội dung</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>Bạn giữ bản quyền với nội dung đăng tải</li>
                                        <li>Cho phép Vibely sử dụng để cung cấp dịch vụ</li>
                                        <li>Chịu trách nhiệm với nội dung bạn chia sẻ</li>
                                        <li>Không đăng tải tài liệu có bản quyền trái phép</li>
                                    </ul>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-3 text-[#4F46E5]">Kiểm duyệt</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>Chúng tôi có quyền gỡ bỏ nội dung vi phạm</li>
                                        <li>Có thể xem xét nội dung bị báo cáo</li>
                                        <li>Không chịu trách nhiệm với nội dung người dùng</li>
                                        <li>Bạn có thể báo cáo nội dung không phù hợp</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="border-b-2 border-dashed border-gray-200"></div>

                    {/* Section 4 */}
                    <section>
                        <div className="flex items-center mb-6">
                            <div className="bg-[#4F46E5] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-4">4</div>
                            <h2 className="text-2xl font-bold">Quyền sở hữu trí tuệ</h2>
                        </div>
                        <div className="pl-14">
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="border border-gray-200 rounded-lg p-5">
                                    <h3 className="font-semibold mb-2 flex items-center">
                                        <FaFileContract className="text-[#4F46E5] mr-2" />
                                        Của Vibely
                                    </h3>
                                    <p className="text-gray-700">
                                        Mọi giao diện, logo, thiết kế, mã nguồn và nội dung do Vibely cung cấp đều được bảo hộ quyền sở hữu trí tuệ.
                                    </p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-5">
                                    <h3 className="font-semibold mb-2 flex items-center">
                                        <FaUserCheck className="text-[#4F46E5] mr-2" />
                                        Của người dùng
                                    </h3>
                                    <p className="text-gray-700">
                                        Nội dung bạn tạo ra và đăng tải thuộc quyền sở hữu của bạn, nhưng bạn cấp cho Vibely giấy phép sử dụng để vận hành dịch vụ.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="border-b-2 border-dashed border-gray-200"></div>

                    {/* Section 5 */}
                    <section>
                        <div className="flex items-center mb-6">
                            <div className="bg-[#4F46E5] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-4">5</div>
                            <h2 className="text-2xl font-bold">Bảo mật và dữ liệu</h2>
                        </div>
                        <div className="pl-14">
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-3 text-[#4F46E5]">Thông tin cá nhân</h3>
                                <p className="text-gray-700 mb-4">
                                    Chúng tôi thu thập và xử lý dữ liệu cá nhân theo Chính sách bảo mật. Bằng việc sử dụng Vibely, bạn đồng ý với cách chúng tôi xử lý dữ liệu của bạn.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold mb-2 flex items-center">
                                        <FaFileContract className="text-[#4F46E5] mr-2" />
                                        Bảo mật
                                    </h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                                        <li>Mã hóa dữ liệu nhạy cảm</li>
                                        <li>Bảo vệ chống truy cập trái phép</li>
                                        <li>Kiểm tra bảo mật định kỳ</li>
                                    </ul>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold mb-2 flex items-center">
                                        <FaFileContract className="text-[#4F46E5] mr-2" />
                                        Dữ liệu
                                    </h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                                        <li>Thu thập để cải thiện dịch vụ</li>
                                        <li>Không bán dữ liệu cho bên thứ ba</li>
                                        <li>Tuân thủ quy định pháp luật</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="border-b-2 border-dashed border-gray-200"></div>

                    {/* Section 6 */}
                    <section>
                        <div className="flex items-center mb-6">
                            <div className="bg-[#4F46E5] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-4">6</div>
                            <h2 className="text-2xl font-bold">Thay đổi và chấm dứt</h2>
                        </div>
                        <div className="pl-14">
                            <div className="grid md:grid-cols-2 gap-8 mb-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-[#4F46E5]">Thay đổi điều khoản</h3>
                                    <p className="text-gray-700">
                                        Chúng tôi có thể cập nhật các điều khoản này bất kỳ lúc nào. Khi có thay đổi quan trọng, chúng tôi sẽ thông báo rõ ràng trên nền tảng hoặc qua email.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-[#4F46E5]">Chấm dứt dịch vụ</h3>
                                    <p className="text-gray-700">
                                        Bạn có thể ngừng sử dụng Vibely bất kỳ lúc nào. Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản nếu vi phạm điều khoản.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-blue-800 flex items-start">
                                    <FaInfoCircle className="text-blue-500 mr-2 mt-1" />
                                    Việc tiếp tục sử dụng Vibely sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="border-b-2 border-dashed border-gray-200"></div>

                    {/* Contact Section */}
                    <section>
                        <div className="flex items-center mb-6">
                            <FaEnvelope className="text-[#4F46E5] text-2xl mr-4" />
                            <h2 className="text-2xl font-bold">Liên hệ</h2>
                        </div>
                        <div className="pl-14">
                            <p className="mb-6">
                                Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản sử dụng này, vui lòng liên hệ với chúng tôi:
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