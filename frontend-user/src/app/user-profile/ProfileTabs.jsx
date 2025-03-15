"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { ProfileDetails } from "./ProfileDetails";


const ProfileTabs = ({
}) => {
  const [activeTab, setActiveTab] = useState("posts");
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 border-t border-gray-200 dark:border-gray-700 pt-1">
      <Tabs
        defaultValue="posts"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full md:w-1/2 grid-cols-5">
          <TabsTrigger value="posts" className="data-[state=active]:text-[#086280]">Bài viết</TabsTrigger>
          <TabsTrigger value="photos" className="data-[state=active]:text-[#086280]">Ảnh</TabsTrigger>
          <TabsTrigger value="videos" className="data-[state=active]:text-[#086280]">Video</TabsTrigger>
          <TabsTrigger value="friends" className="data-[state=active]:text-[#086280]">Bạn bè</TabsTrigger>
          <TabsTrigger value="files" className="data-[state=active]:text-[#086280]">Tài liệu</TabsTrigger>
        </TabsList>

        <div className='mt-6'>
           <ProfileDetails
            activeTab={activeTab}
           />
        </div>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
