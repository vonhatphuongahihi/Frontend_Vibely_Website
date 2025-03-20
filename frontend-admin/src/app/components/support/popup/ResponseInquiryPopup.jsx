import { useState } from "react";
import { IoClose } from "react-icons/io5";

const ResponseInquiryPopup = ({ inquiry, onClose, onUpdate }) => {

    // State lưu dữ liệu nhập
    const [formData, setFormData] = useState({
        inquiryId: inquiry?._id || "",
        response: "",
        status: "Đã phản hồi",
    });

    // Xử lý khi thay đổi dữ liệu nhập
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Gửi dữ liệu cập nhật
    const handleSubmit = () => {
        onUpdate(formData);
    };

    return (
      <div className="fixed inset-0 bg-[#086280]/50 flex justify-center items-center">
          <div className="relative bg-white p-6 rounded-xl shadow-lg w-[600px]">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[22px] font-semibold">Phản hồi thắc mắc</h2>
                  <button onClick={onClose} className="absolute right-4 top-4 hover:text-gray-700 cursor-pointer">
                      <IoClose size={28} />
                  </button>
              </div>

              {/* Form */}
              <div className="flex flex-col gap-7">
                  <div>
                      <label className="block mb-2 font-semibold">Email</label>
                      <input
                          type="text"
                          name="email"
                          value={inquiry.email}
                          className="w-full border border-gray-400 p-2 rounded-lg focus:outline-none"
                          readOnly
                      />
                  </div>

                  <div>
                      <label className="block mb-2 font-semibold">Nội dung thắc mắc</label>
                      <textarea
                          type="text"
                          name="message"
                          value={inquiry.message}
                          className="w-full border border-gray-400 p-2 rounded-lg focus:outline-none"
                          readOnly
                          rows={3}
                      />
                  </div>

                  <div>
                      <label className="block mb-2 font-semibold">Nội dung phản hồi</label>
                      <textarea
                          type="text"
                          name="response"
                          value={formData.response}
                          onChange={handleChange}
                          className="w-full border border-gray-400 p-2 rounded-lg focus:outline-none"
                          placeholder="Nhập nội dung phản hồi"
                          rows={3}
                      />
                  </div>
              </div>

              {/* Nút Gửi */}
              <div className="flex justify-center mt-6">
                  <button
                      onClick={handleSubmit}
                      className="px-10 py-[10px] bg-[#086280] text-white rounded-lg hover:bg-[#07556F] cursor-pointer text-[16px] transition-all duration-200"
                  >
                      Gửi
                  </button>
              </div>
          </div>
      </div>
    );
};

export default ResponseInquiryPopup;
