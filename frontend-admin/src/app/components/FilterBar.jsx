import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import React, { useState } from "react";

const FilterBar = ({ onSearch, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("newest");

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    const handleFilterChange = (filterType) => {
        setFilter(filterType);
        onFilterChange(filterType);
    };

    return (
        <div className="flex items-center gap-x-5 mb-4">
            {/* Ô tìm kiếm */}
            <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleSearch}
                className="border px-4 py-2 bg-white rounded-md w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
            />
            <Button className="bg-[#086280] text-white hover:bg-[#044053] h-10 w-21 rounded-full cursor-pointer">
                <Search size={20} />
                <span className="text-[16px]">Tìm</span>
            </Button>

            <span className="ml-45 font-semibold">Sắp xếp theo:</span>
            {/* Bộ lọc bài viết */}
            <div className="relative w-fit">
                <select
                    value={filter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="px-4 py-2 border-none bg-[#086280] text-white rounded-full 
                            focus:outline-none focus:ring-2 focus:ring-[#086280]
                            focus:bg-white focus:text-[#086280] text-[15px] pr-10 appearance-none"
                    style={{
                        backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M7 10l5 5 5-5z\" /></svg>')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        backgroundSize: "16px",
                    }}
                >
                    <option value="newest">Mới nhất</option>
                    <option value="likes">Lượt react</option>
                    <option value="comments">Lượt bình luận</option>
                    <option value="shares">Lượt chia sẻ</option>
                </select>
            </div>
        </div>
    );
};

export default FilterBar;
