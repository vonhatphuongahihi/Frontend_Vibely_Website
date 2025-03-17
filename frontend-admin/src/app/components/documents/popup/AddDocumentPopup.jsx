import { IoClose } from "react-icons/io5";

const AddDocumentPopup = ({ onClose }) => {
  const levels = ["Tiểu học", "Trung học cơ sở", "Trung học phổ thông", "Đại học"];
  const subjects = ["Toán", "Vật lý", "Hóa học", "Ngữ văn", "Lịch sử"];

  return (
    <div className="fixed inset-0 bg-[#086280]/50 flex justify-center items-center">
      <div className="relative bg-white p-6 rounded-xl shadow-lg w-[600px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[22px] font-semibold">Thêm tài liệu</h2>
          <button onClick={onClose} className="absolute right-4 top-4 hover:text-gray-700 cursor-pointer">
            <IoClose size={28} />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-2">
            <label className="block mb-2 font-semibold">Tiêu đề</label>
            <input type="text" className="w-full border border-gray-400 p-2 rounded-lg focus:outline-none" placeholder="Nhập tiêu đề tài liệu" />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Cấp học</label>
            <select className="w-full border border-gray-400 p-2 rounded-lg focus:outline-none bg-white">
              <option>Chọn cấp học</option>
              {levels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Môn học</label>
            <select className="w-full border border-gray-400 p-2 rounded-lg focus:outline-none bg-white">
              <option>Chọn môn học</option>
              {subjects.map((subject) => (
                <option key={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Số trang</label>
            <input type="number" className="w-full border border-gray-400 p-2 rounded-lg focus:outline-none" placeholder="Nhập số trang" />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Định dạng</label>
            <input type="text" className="w-full border border-gray-400 p-2 rounded-lg focus:outline-none" placeholder="Nhập định dạng tài liệu" />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 font-semibold">URL của tài liệu</label>
            <textarea type="text" className="w-full border border-gray-400 p-2 rounded-lg focus:outline-none" placeholder="Nhập URL của tài liệu" rows={2}/>
          </div>
        </div>

        {/* Nút thêm tài liệu */}
        <div className="flex justify-center mt-6">
          <button className="px-5 py-[10px] bg-[#086280] text-white rounded-lg hover:bg-[#07556F] cursor-pointer text-[16px] transition-all duration-200">
            Thêm tài liệu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentPopup;
