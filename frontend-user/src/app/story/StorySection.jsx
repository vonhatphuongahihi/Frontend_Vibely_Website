"use client";
import React, {useEffect, useState, useRef} from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import StoryCard from "./StoryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePostStore } from "@/store/usePostStore";
import toast from "react-hot-toast";


const StorySection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const containerRef = useRef();
  const {stories, fetchStories, handleReactStory} = usePostStore()
  useEffect(()=>{
    fetchStories()
  },[fetchStories])
  const[reactStories, setReactStories] = useState(new Set()); // danh sách những story mà người dùng đã react
  useEffect(()=>{
    const saveReacts = localStorage.getItem('reactStories')
    if(saveReacts){
      setReactStories(JSON.parse(saveReacts))
    }
  },[])

  const handleReact = async(storyId, reactType)=>{
    const updatedReactStories = { ...reactStories }; 
    if(updatedReactStories && updatedReactStories[storyId]=== reactType){ 
      delete updatedReactStories[storyId]; // hủy react nếu nhấn lại
    }
    else{ 
      updatedReactStories[storyId] = reactType; // cập nhật cảm xúc mới
    }
    //lưu danh sách mới vào biến
    setReactStories(updatedReactStories)
    //lưu vào cục bộ
    localStorage.setItem('reactStories', JSON.stringify(updatedReactStories));

    try {
      await handleReactStory(storyId, updatedReactStories[storyId] || null) //api
      await fetchStories()// tải lại danh sách
    } catch (error) {
      console.log(error)
      toast.error("Đã xảy ra lỗi khi bày tỏ cảm xúc với bài viết này. Vui lòng thử lại.")
    }
  }

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const updateMaxScroll = () => {
        setMaxScroll(container.scrollWidth - container.offsetWidth);
        setScrollPosition(container.scrollLeft);
      };
      updateMaxScroll();
      window.addEventListener("resize", updateMaxScroll);
      return () => window.removeEventListener("resize", updateMaxScroll);
    }
  }, [stories]);
  const scroll = (direction) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      setScrollPosition(container.scrollLeft);
    }
  };

  return (
    <div className='relative'>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className='flex space-x-2 overflow-x-hidden py-4'
        style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
      >
       <motion.div
          className=" flex space-x-2"
          drag="x"
          dragConstraints={{
            right: 0,
            left:
              -((stories.length + 1) * 200) +
              containerRef.current?.offsetWidth,
          }}
        >
          <StoryCard isAddStory={true}/>
          {stories?.map((story) => (
            <StoryCard story={story} key={story._id} 
            reaction = {reactStories[story?._id]||null} //loại react 
            onReact={(reactType) => handleReact(story?._id, reactType)} />
          ))}
        </motion.div>
        {/* left side scrollbutton  */}
        {scrollPosition > 0 && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 roudned-full shadow-lg transition-opacity duration-300 ease-in-out"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* right side scrollbutton  */}

        {scrollPosition < maxScroll && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 roudned-full shadow-lg transition-opacity duration-300 ease-in-out"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

}
export default StorySection;
