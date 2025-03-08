"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { logout } from "@/service/auth.service";
import useSidebarStore from "@/store/sidebarStore";
import userStore from "@/store/userStore";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Bell, LogOut, Menu, MessageCircle, Search, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const navItems = [
    { icon: "/images/home_navbar.svg", path: "/" },
    { icon: "/images/video_navbar.svg", path: "/video-feed" },
    { icon: "/images/document_navbar.svg", path: "/document" },
    { icon: "/images/calendar_navbar.svg", path: "/calendar" },
    { icon: "/images/game_navbar.svg", path: "/game" }
  ];

  const { toggleSidebar } = useSidebarStore();
  const router = useRouter();
  const {user, clearUser} = userStore();

  const userPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const handleNavigation = (path, item) => {
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result?.status == "success") {
        router.push("/user-login");
        clearUser();
      }
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.log(error);
      toast.error("Đăng xuất thất bại");
    }
  };

  return (
    <header className="bg-background_header text-foreground shadow-md h-14 fixed top-0 left-0 z-50 w-full">
      <div className="mx-auto flex justify-between items-center h-full px-4">
        {/* Logo và Tìm kiếm */}
        <div className="flex items-center gap-2">
          <Image src="/images/vibely_logo.png" alt="logo" width={60} height={60} className="-ml-2 cursor-pointer" onClick={() => handleNavigation('/')}/>
          <div className="relative -ml-2">
            <form>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-800" size={20} />
                <Input
                  type="text"
                  placeholder="Tìm kiếm"
                  className="pl-10 w-40 md:w-64 h-10 bg-search_bar rounded-full border-none"
                />
              </div>
              {isSearchOpen && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
                  <div className="p-2">
                    <div className="flex items-center space-x-8 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                      <Search className="absolute text-sm text-gray-400" />
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {user?.profilePicture ? (
                            <AvatarImage src={user?.profilePicture} alt={user?.username}/>
                          ):(
                            <AvatarFallback>{userPlaceholder}</AvatarFallback>
                          )}
                        </Avatar>
                        <span>Võ Nhất Phương</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Thanh điều hướng */}
        <nav className="hidden md:flex justify-around w-[40%] max-w-md">
          {navItems.map(({ icon, path }) => (
            <Link key={path} href={path} className="flex items-center">
              <img
                src={icon}
                alt="nav-icon"
                className="w-6 h-6 filter brightness-50 contrast-200 transition-all duration-200 hover:invert-[40%] hover:sepia-[50%] hover:saturate-[300%] hover:hue-rotate-[160deg]"
                />
            </Link>
          ))}
        </nav>
        {/* Profile cá nhân */}
        <div className="flex space-x-2 md:space-x-4 items-center">
          <Button variant="ghost" size="icon" className="md:hidden text-gray-600 cursor-pointer" onClick={toggleSidebar}>
            <Menu />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:block text-gray-600 cursor-pointer pl-1"
          onClick={() => handleNavigation('/messenger')}>
            <MessageCircle size={22} className="min-w-[22px] min-h-[22px]" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:block text-gray-600 cursor-pointer pl-1">
            <Bell size={24} className="min-w-[24px] min-h-[24px]" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full shadow-lg"
              >
                <Avatar>
                  {user?.profilePicture ? (
                    <AvatarImage 
                      src={user?.profilePicture}
                      alt={user?.username}
                    />
                  ):(
                    <AvatarFallback>
                      {userPlaceholder}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-64 z-50 bg-white shadow-lg rounded-lg border border-gray-200" 
              align="end"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      {user?.profilePicture ? (
                        <AvatarImage 
                          src={user?.profilePicture}
                          alt={user?.username}
                        />
                      ):(
                        <AvatarFallback>
                          {userPlaceholder}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="ml-2">
                      <p className="text-sm font-medium leading-none">
                        {user?.username}
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <div className="bg-gray-200 h-px my-2"></div>
              <DropdownMenuItem className="cursor-pointer" onClick={() => handleNavigation(`/user-profile/${user?._id}`)}>
                <Users/> <span className="ml-2">Trang cá nhân</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <MessageCircle/> <span className="ml-2">Tin nhắn</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                <LogOut/> <span className="ml-2">Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>


          </DropdownMenu>


        </div>

      </div>
    </header>
  );
};

export default Header;
