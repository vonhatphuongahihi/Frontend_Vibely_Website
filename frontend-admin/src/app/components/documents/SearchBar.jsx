import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchBar = () => {
    const levels = [
        "Tiểu học",
        "Trung học cơ sở",
        "Trung học phổ thông",
        "Đại học",
    ];

    const subjects = [
        "Toán",
        "Vật lý",
        "Hóa học",
        "Sinh học",
        "Ngữ văn",
        "Lịch sử",
        "Địa lý",
        "Ngoại ngữ",
        "Công nghệ",
        "Thể dục",
        "Âm nhạc",
        "Mỹ thuật",
        "GDCD",
    ];

    return (
        <div className="flex flex-col space-y-4">
            {/* Ô tìm kiếm */}
            <div className="flex items-center gap-x-5 mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="border px-4 py-2 bg-white rounded-md w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
                />
                <Button className="bg-[#086280] text-white hover:bg-[#044053] h-10 w-21 rounded-full cursor-pointer">
                    <Search size={20} />
                    <span className="text-[16px]">Tìm</span>
                </Button>
            </div>

            {/* Bộ lọc */}
            <div className="flex space-x-6">
                <div className="flex flex-col">
                    <label className="font-semibold mb-2">Cấp học</label>
                    <select className="border py-2 px-4 w-full bg-white rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400">
                        <option>- Chọn cấp học -</option>
                        {levels.map((level) => (
                            <option key={level}>{level}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2">Môn học</label>
                    <select className="border py-2 px-4 w-full bg-white rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400">
                        <option>- Chọn môn học -</option>
                        {subjects.map((subject) => (
                            <option key={subject}>{subject}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;