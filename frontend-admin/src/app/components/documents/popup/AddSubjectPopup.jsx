import { IoClose } from 'react-icons/io5';

const AddSubjectPopup = ({ onClose }) => {
    const levels = [
        "Tiểu học",
        "Trung học cơ sở",
        "Trung học phổ thông",
        "Đại học",
    ];

    return (
        <div className="fixed inset-0 bg-[#086280]/50 flex justify-center items-center">
            <div className="relative bg-white p-6 rounded-xl shadow-lg w-96">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-[22px] font-semibold">Thêm môn học</h2>
                    <button 
                        onClick={onClose}
                        className="absolute right-4 top-4 hover:text-gray-700 cursor-pointer"
                    >
                        <IoClose size={28}/>
                    </button>
                </div>

                <label className="block mb-2 font-semibold">Tên môn học</label>
                <input 
                    type="text"
                    className="w-full border border-gray-400 p-2 rounded-lg mb-8 focus:outline-none"
                    placeholder="Nhập tên môn học"
                />
                <label className="block mb-2 font-semibold">Cấp học</label>
                <select className="border px-2 py-[10px] w-full bg-white rounded-lg border-gray-400 focus:outline-none mb-8">
                    <option>- Chọn cấp học -</option>
                    {levels.map((level) => (
                        <option key={level}>{level}</option>
                    ))}
                </select>

                <div className="flex justify-center">
                    <button
                        className="px-5 py-[10px] bg-[#086280] text-white rounded-lg hover:bg-[#07556F] cursor-pointer text-[16px] transition-all duration-200"
                    >
                        Thêm môn học
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddSubjectPopup;
