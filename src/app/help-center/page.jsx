"use client";
import Image from "next/image";
import { useState } from "react";

const HelpCenter = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const handleShowContent = (content) => {
    setSelectedContent(content);
    setActiveQuestion(null); // Reset câu hỏi mở rộng khi chuyển nội dung
  };

  const toggleQuestion = (question) => {
    setActiveQuestion(activeQuestion === question ? null : question);
  };

  return (
    <div className="min-h-screen flex items-center p-10">
      <div className="max-w-7xl w-full flex gap-10">
        {/* Sidebar */}
        <div className="w-[30%] bg-white shadow-lg rounded-lg p-6 ml-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 mt-6 ml-6">
            <Image
              src="/images/helpcenter_vibely.png"
              alt="Sách hướng dẫn"
              width={24}
              height={24}
            />
            Sử dụng Vibely
          </h2>
          <ul className="mb-6 space-y-4">
            <li
              className="flex items-center gap-2 ml-14 cursor-pointer"
              onClick={() => handleShowContent("createAccount")}
            >
              <Image
                src="/images/helpcenter_taotk.png"
                alt="Tạo tài khoản"
                width={20}
                height={20}
              />
              Cách tạo tài khoản
            </li>
            <li className="flex items-center gap-2 ml-14 cursor-pointer"
            onClick={() => handleShowContent("addFriend")}
            >
              <Image
                src="/images/helpcenter_ketban.png"
                alt="Kết bạn"
                width={20}
                height={20}
              />
              Kết bạn
            </li>
          </ul>

          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 ml-6">
            <Image
              src="/images/helpcenter_qltk.png"
              alt="Quản lý tài khoản"
              width={24}
              height={24}
            />
            Quản lý tài khoản
          </h2>
          <ul className="space-y-4">
            <li
              className="flex items-center gap-2 ml-14 cursor-pointer"
              onClick={() => handleShowContent("loginPassword")}
            >
              <Image
                src="/images/helpcenter_key.png"
                alt="Đăng nhập & mật khẩu"
                width={20}
                height={20}
              />
              Đăng nhập và mật khẩu
            </li>
          </ul>
        </div>

        {/* Nội dung chính */}
        <div className="w-[70%] flex justify-center items-center ml-10">
          {selectedContent === "createAccount" && (
            <div className="w-4/5 bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold text-black mb-4">Cách tạo tài khoản</h2>
              <h3 className="text-lg font-bold text-black mb-4">Xác nhận tài khoản</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 shadow-sm">
                  <button
                    className="w-full text-left font-semibold"
                    onClick={() => toggleQuestion("question1")}
                  >
                    Tạo tài khoản Vibely?
                  </button>
                  {activeQuestion === "question1" && (
                    <div className="mt-2 p-4 border-t text-gray-600">
                      <ol className="list-decimal pl-4">
                        <li>Truy cập vào Vibely và chọn Đăng ký.</li>
                        <li>Nhập tên người dùng, email, mật khẩu, ngày sinh và giới tính của bạn.</li>
                        <li>Nhấn vào Đăng ký.</li>
                        <li>Để hoàn tất quá trình tạo tài khoản, bạn cần xác nhận email hoặc số điện thoại di động của mình.</li>
                      </ol>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg p-4 shadow-sm">
                  <button
                    className="w-full text-left font-semibold"
                    onClick={() => toggleQuestion("question2")}
                  >
                    Tại sao lại yêu cầu tôi thêm email của mình?
                  </button>
                  {activeQuestion === "question2" && (
                    <div className="mt-2 p-4 border-t text-gray-600">
                      <h5 className="text-lg font-bold">Chúng tôi có thể sử dụng email của bạn cho các mục đích như:</h5>
                      <ol className="list-decimal pl-4">
                        <li>Giúp bạn đăng nhập. Nếu quên mật khẩu, bạn cần địa chỉ email đã cập nhật để đặt lại.</li>
                        <li>Giữ an toàn cho tài khoản của bạn bằng cách chọn các tính năng như cảnh báo qua email.</li>
                      </ol>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-black">Xác nhận tài khoản</h3>
                {/* Câu hỏi 3 */}
                <div className="border rounded-lg p-4 shadow-sm">
                  <button
                    className="w-full text-left font-semibold"
                    onClick={() => toggleQuestion("question3")}
                  >
                    Hoàn tất quá trình tạo tài khoản Vibely và xác nhận email 
                  </button>
                  {activeQuestion === "question3" && (
                    <div className="mt-2 p-4 border-t text-gray-600">
                      <h5 className="text-lg font-bold">
                        Để hoàn tất quá trình tạo tài khoản, bạn cần xác nhận rằng bạn sở hữu email dùng để tạo tài khoản:
                      </h5>
                      <p>
                        - Để xác nhận email, hãy nhấp hoặc nhấn vào liên kết trong email mà bạn nhận được khi tạo tài khoản. 
                        Khi bạn xác nhận email, chúng tôi biết mình gửi thông tin tài khoản đến đúng chỗ.
                      </p>
                      <p>
                        Lưu ý: Hãy xác nhận email của bạn sớm nhất có thể. Bạn có thể không sử dụng được tài khoản của mình khi chưa xác nhận email. 
                        Nếu bạn không xác nhận, tài khoản có thể bị xóa sau một năm không hoạt động.
                      </p>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg p-4 shadow-sm">
                  <button
                    className="w-full text-left font-semibold"
                    onClick={() => toggleQuestion("question4")}
                  >
                    Tìm email xác nhận đăng ký Vibely
                  </button>
                  {activeQuestion === "question4" && (
                    <div className="mt-2 p-4 border-t text-gray-600">
                      <h5 className="text-lg font-bold">Nếu bạn tạo tài khoản Vibely bằng email, chúng tôi sẽ gửi liên kết xác nhận đến email đó. Nếu bạn không tìm thấy email xác nhận:</h5>
                      <ol className="list-decimal pl-4">
                        <li>Hãy kiểm tra thư mục thư rác. Nếu bạn dùng Gmail, hãy kiểm tra email thuộc hạng mục Xã hội.</li>
                        <li>Đảm bảo rằng bạn đã nhập đúng email. Nếu nhập sai email, bạn có thể thay đổi và gửi lại email.</li>
                      </ol>
                    </div>                  
                  )}
                </div>

              </div>
            </div>
          )}
          
          {selectedContent === "addFriend" && (
            <div className="w-4/5 bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold text-black mb-4">Kết bạn</h2>
              <h3 className="text-lg font-bold text-black mb-4">Thêm bạn bè</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 shadow-sm">
                  <button
                    className="w-full text-left font-semibold"
                    onClick={() => toggleQuestion("addFriend_question1")}
                  >
                    Tìm và thêm bạn bè trên Vibely
                  </button>
                  {activeQuestion === "addFriend_question1" && (
                    <div className="mt-2 p-4 border-t text-gray-600">
                      <ol className="list-decimal pl-4">
                        <li>Nhấp vào thanh tìm kiếm ở trên cùng bên trái trang bất kỳ trên Vibely.</li>
                        <li>Nhập tên bạn bè vào thanh tìm kiếm và nhấp vào icon tìm kiếm.</li>
                        <li>Để gửi lời mời kết bạn đến ai đó, hãy nhấp vào ... bên cạnh ảnh đại diện của họ. Một số người có thể không có nút ... bên cạnh ảnh đại diện, tùy vào cài đặt quyền riêng tư của họ.</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedContent === "loginPassword" && (
            <div className="w-4/5 bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold text-black mb-4">Đăng nhập và mật khẩu</h2>
              <h3 className="text-lg font-bold text-black mb-4">Đăng nhập tài khoản</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 shadow-sm">
                  <button
                    className="w-full text-left font-semibold"
                    onClick={() => toggleQuestion("loginQuestion")}
                  >
                    Đăng nhập tài khoản Vibely?
                  </button>
                  {activeQuestion === "loginQuestion" && (
                    <div className="mt-2 p-4 border-t text-gray-600">
                      <ol className="list-decimal pl-4">
                        <li>Truy cập vào Vibely.</li>
                        <li>Nhập các nội dung: email, mật khẩu.</li>
                        <li>Nhấn vào Đăng nhập.</li>
                      </ol>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg p-4 shadow-sm">
                  <button
                    className="w-full text-left font-semibold"
                    onClick={() => toggleQuestion("question2")}
                  >
                    Đăng xuất khỏi Vibely?
                  </button>
                  {activeQuestion === "question2" && (
                    <div className="mt-2 p-4 border-t text-gray-600">
                      <ol className="list-decimal pl-4">
                        <li>Nhấp vào ảnh đại diện của bạn ở trên cùng bên phải Facebook.</li>
                        <li>Nhấp vào Đăng xuất ở cuối menu đang hiển thị.</li>
                      </ol>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-black">Đổi mật khẩu tài khoản</h3>
                <div className="border rounded-lg p-4 shadow-sm">
                <button
                className="w-full text-left font-semibold"
                onClick={() => toggleQuestion("question3")}
                >
                Đổi mật khẩu Vibely 
                </button>
                {activeQuestion === "question3" && (
                    <div className="mt-2 p-4 border-t text-gray-600">
                <h5 className="text-lg font-bold">Nếu bạn quên mật khẩu và không thể đăng nhập
                </h5>
                <ol className="list-decimal pl-4">
                    <li>Nhấp vào Quên mật khẩu? ở cuối màn hình đăng nhập.</li>
                    <li>Nhập email của bạn, rồi nhấp vào Tiếp tục.</li>
                    <li>Làm theo gợi ý.</li>
                    <li>Để hoàn tất quá trình tạo tài khoản, bạn cần xác nhận email hoặc số điện thoại di động của mình.</li>
                </ol>
                <h5 className="text-lg font-bold">Nếu bạn đã đăng nhập và muốn đổi mật khẩu (bổ sung sau)</h5>
                    </div>
                )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
