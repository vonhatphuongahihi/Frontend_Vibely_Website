"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const SettingsMenu = ({ onBack }) => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <>
      <DropdownMenuItem
        className="cursor-pointer flex items-center mb-2"
        onSelect={(event) => {
          event.preventDefault();
          onBack();
        }}
      >
        <ChevronLeft className="mr-2 mt-2 text-[#54C8FD]" />
      </DropdownMenuItem>
      <DropdownMenuItem
        className="cursor-pointer mb-2"
        onClick={() => handleNavigation('/forgot-password')}
      >
        <img src="images/change_password_dropdown.png" alt="help" className="mr-0" />
        <span className="font-semibold ml-2">Đổi mật khẩu</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        className="cursor-pointer mb-2"
        onSelect={(event) => event.preventDefault()}
      >
        <img src="images/delete_dropdown.png" alt="help" className="mr-0" />
        <span className="font-semibold ml-2">Xóa tài khoản</span>
      </DropdownMenuItem>
    </>
  );
};
