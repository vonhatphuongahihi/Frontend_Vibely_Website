//import React from "react";
"use client";
import LeftSideBar from "@/app/components/LeftSideBar";
import { fetchUserProfile } from "@/service/user.service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileHeader from "../ProfileHeader";
import ProfileTabs from "../ProfileTabs";

const Page = () => {
  const params = useParams();
  const id = params.id;
  console.log("🔍 User Profile Page - params:", params);
  console.log("🔍 User Profile Page - id:", id);
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

const fetchProfile = async () => {
  setLoading(true);
  try {
    console.log("🔍 Fetching profile for ID:", id);
    const result = await fetchUserProfile(id);
    console.log("✅ Profile result:", result);

    setProfileData(result.profile);
    setIsOwner(result.isOwner);
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (!profileData) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <div className="md:hidden">
        <LeftSideBar />
      </div>
      <ProfileHeader
        profileData={profileData}
        setProfileData={setProfileData}
        isOwner={isOwner}
        id={id}
        fetchProfile={fetchProfile}
      />
      <ProfileTabs
        profileData={profileData}
        setProfileData={setProfileData}
        isOwner={isOwner}
        id={id}
        fetchProfile={fetchProfile}
      />
    </div>
  );
};

export default Page;
