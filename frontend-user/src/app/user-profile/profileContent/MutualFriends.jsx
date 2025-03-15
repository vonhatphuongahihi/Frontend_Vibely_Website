import React from "react";
import { motion } from "framer-motion";
import { Avatar } from "@radix-ui/react-avatar";
import { Card } from "@/components/ui/card";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Search, UserX } from "lucide-react";

export const MutualFriends = () => {
  const mutualFriends = [
    { id: 1, name: "Yoo Je Yi", avatar: "/images/yoo.jpg", fallback: "Y" },
    { id: 2, name: "Woo Seul Gi", avatar: "/images/woo.jpg", fallback: "W" },
    { id: 3, name: "Joo Ye Ri", avatar: "/images/joo.jpg", fallback: "J" },
    { id: 4, name: "Choi Kyung", avatar: "/images/choi.jpg", fallback: "C" },
    { id: 5, name: "Lê Nguyễn Thùy Dương", avatar: "/images/Duong.jpg", fallback: "D" },
    { id: 6, name: "Nguyễn Đăng Hương Uyên", avatar: "/images/Uyen.jpg", fallback: "U" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      <Card className="bg-white shadow-md rounded-lg border border-gray-200 p-4">
        {/* Header + Search */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-gray-300">Bạn bè</h2>

          {/* Search + Tabs */}
          <div className="flex items-center space-x-6">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="px-6 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#086280]"
              />
              <button className="ml-2 p-2 bg-[#086280] text-white rounded-lg hover:bg-[#064d5f]">
                <Search className="h-5 w-5" />
              </button>
            </div>
            <p className="text-[#086280] font-semibold cursor-pointer">Lời mời kết bạn</p>
            <p className="text-[#086280] font-semibold cursor-pointer">Tìm bạn bè</p>
          </div>
        </div>

        {/* Danh sách bạn bè */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mutualFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between bg-white shadow-md rounded-lg border border-gray-200 p-3"
            >
              {/* Avatar + Tên */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-14 h-14 border-4 border-white dark:border-gray-700">
                  <AvatarImage src={friend.avatar} />
                  <AvatarFallback className="dark:bg-gray-400">{friend.fallback}</AvatarFallback>
                </Avatar>
                <p className="font-semibold dark:text-gray-100">{friend.name}</p>
              </div>

              {/* Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-200 rounded-full">
                    <MoreHorizontal className="h-5 w-5 text-gray-700" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center text-red-500 cursor-pointer">
                    <UserX className="h-4 w-4 mr-2" /> Hủy kết bạn
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
