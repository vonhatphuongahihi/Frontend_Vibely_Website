"use client";
//import React from "react";
import { FriendCardSkeleton, NoFriendsMessage } from "@/lib/Skeleton";
import { useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import FriendRequest from "./FriendRequest";
import FriendsSuggestion from "./FriendsSuggestion";

const Page = () => {
    const [loading, setLoading] = useState(false);
    const friendRequest = [{

    }]
    const friendSuggestion = [{

    }]
    
    return (
        <div className="min-h-screen">
            <LeftSideBar />
            <main className="ml-0 md:ml-64 mt-16 p-6">
                <h1 className="text-xl font-bold mb-6">Lời mời kết bạn</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading ? (
                        <FriendCardSkeleton/>
                    ) : friendRequest.length === 0 ? (
                        <NoFriendsMessage
                            text="Không có lời mời kết bạn nào"
                            description="Có vẻ như bạn đã bắt kịp mọi thứ! Sao không thử khám phá và kết nối với những người mới?"
                        />
                    ) : (
                        friendRequest.map((friend) => (
                            <FriendRequest 
                                key={friend._id}
                                friend={friend}
                                //loading={loading}
                                //onAction={handleAction}
                            />
                        ))
                    )}
                </div>

                <h1 className="text-xl font-bold mt-8 mb-6">Những người bạn có thể biết</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  ">
                    {loading ? (
                        <FriendCardSkeleton />
                    ) : friendSuggestion.length === 0 ? (
                        <NoFriendsMessage
                            text="Không có đề xuất kết bạn nào"
                            description="Có vẻ như bạn đã bắt kịp mọi thứ! Sao không thử khám phá và kết nối với những người mới?"
                        />
                    ) : (
                        friendSuggestion.map((friend) => (
                            <FriendsSuggestion 
                                key={friend._id}
                                friend={friend}
                                //loading={loading}
                                //onAction={handleAction}
                            />
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}

export default Page