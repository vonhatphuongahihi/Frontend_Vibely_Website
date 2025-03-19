import { IoClose } from 'react-icons/io5';

const AddLevelPopup = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-[#086280]/50 flex justify-center items-center">
            <div className="relative bg-white p-6 rounded-xl shadow-lg w-96">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-[22px] font-semibold">Thêm cấp học</h2>
                    <button 
                        onClick={onClose}
                        className="absolute right-4 top-4 hover:text-gray-700 cursor-pointer"
                    >
                        <IoClose size={28}/>
                    </button>
                </div>
                <label className="block mb-2 font-semibold">Tên cấp học</label>
                <input 
                    type="text"
                    className="w-full border border-gray-400 p-2 rounded-lg mb-8 focus:outline-none"
                    placeholder="Nhập tên cấp học" 
                />
                <div className="flex justify-center">
                    <button
                        className="px-5 py-[10px] bg-[#086280] text-white rounded-lg hover:bg-[#07556F] cursor-pointer text-[16px] transition-all duration-200"
                    >
                        Thêm cấp học
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddLevelPopup;
