import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchBar = () => {

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
                    <label className="font-semibold mb-2">Lọc theo</label>
                    <select className="border py-2 px-4 w-full bg-white rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400">
                        <option>Tất cả</option>
                        <option value="">Chưa phản hồi</option>
                        <option value="">Đã phản hồi</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;