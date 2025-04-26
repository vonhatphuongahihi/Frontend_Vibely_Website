"use client";
import React, { useEffect, useState } from "react";
import Notification from "./Notification";
import PopperWrapper from "../Popper/Popper";
import { Bell } from "lucide-react";

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);

  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: "Dương Lê đã thích bài viết của bạn",
        message: "Bài viết: 'Học bài thôi, top 1 trường Chaewah💯'",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS0GoIVOyPuFDshrUt6KmgMQMn6RavA6IuuWob47x4GjoIHcgXmaUJbZw1NdY8-7pH4PM&usqp=CAU",
        username: "Dương Lê",
        isNew: true,
      },
      {
        id: 2,
        title: "Yoo Jae Yi đã bình luận về ảnh của bạn",
        message: "xỉu 7749 ngày",
        image: "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-1.jpg",
        username: "Yoo Jae Yi",
        isNew: true,
      },
      {
        id: 3,
        title: "Bạn có một lời mời kết bạn từ Le Nguyen",
        message: "Xem trang cá nhân của họ ngay",
        image: "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482760XsW/anh-mo-ta.png",
        username: "Le Nguyen",
        isNew: false,
      },
    ];
    setNotifications(mockNotifications);
    setNewNotificationsCount(mockNotifications.filter((n) => n.isNew).length);
  }, []);

  const toggleNotifications = () => {
    setIsOpen((prev) => !prev);
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      isNew: false,
    }));
    setNotifications(updatedNotifications);
    setNewNotificationsCount(0);
  };

  return (
    <div className="relative">
      {/* Nút chuông thông báo */}
      <div
        className="relative flex items-center cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={toggleNotifications}
        onKeyDown={(e) => e.key === "Enter" && toggleNotifications()}
      >
        <Bell className="min-w-[16px] min-h-[16px] md:min-w-[24px] md:min-h-[24px]" />
        {newNotificationsCount > 0 && (
          <div className="absolute -top-[10px] -right-1 bg-red-500 text-white text-xs flex items-center justify-center rounded-full h-3 w-3 md:w-5 md:h-5">
            {newNotificationsCount}
          </div>
        )}
      </div>

      {/* Popper hiển thị thông báo */}
      {isOpen && (
        <div className="absolute top-8 right-1 translate-x-[12%] lg:translate-x-0 bg-white shadow-lg rounded-lg p-4 w-90 z-50">
          <PopperWrapper>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-800 font-bold">
                {`Thông báo (${notifications.length})`}
              </span>
              <div
                className="text-blue-500 text-xs hover:underline cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={handleMarkAllAsRead}
                onKeyDown={(e) => e.key === "Enter" && handleMarkAllAsRead()}
              >
                Đánh dấu tất cả là đã đọc
              </div>
            </div>

            {notifications.length > 0 ? (
              <div className="mt-2 space-y-3">
                {notifications.map((item) => (
                  <Notification key={item.id} {...item} isBold={item.isNew} />
                ))}
              </div>
            ) : (
              <div className="w-full flex flex-col items-center py-4">
                <span className="text-gray-400">Không có thông báo mới</span>
              </div>
            )}
          </PopperWrapper>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
