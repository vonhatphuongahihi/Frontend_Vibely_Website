"use client";
import React, { useState, useEffect } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdOutlineChecklistRtl } from "react-icons/md";
import { RiPlayListLine } from "react-icons/ri";
import 'react-h5-audio-player/lib/styles.css';
import AudioPlayer from 'react-h5-audio-player';
import './pomodoro.css';
import songs from './songs';

const Pomodoro = () => {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("Pomodoro");
  const modes = { Pomodoro: 25 * 60, "Nghỉ ngắn": 5 * 60, "Nghỉ dài": 15 * 60 };

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prev) => {
          if (prev === 1) {
            playAlarm(); 
          }
          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const playAlarm = () => {
    const alarm = new Audio("/pomodoro.mp3"); 
    alarm.play();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };


  // Bài hát hiện tại
  const [currentIndex, setCurrentIndex] = useState(0);

  // Chuyển bài hát tiếp theo
  const handleNextSong = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % songs.length);
  }

  return (
    <div className="flex h-screen p-5 bg-background pt-20">
      {/* Bên trái */}
      <div className="w-1/4 p-5 bg-white rounded-xl shadow-md">
        <div className="flex items-center space-x-2">
            <IoMdInformationCircleOutline size={24} />
            <h2 className="text-lg font-semibold">Pomodoro là gì?</h2>
        </div>
        <p className="pt-2 text-justify text-[14px]">Pomodoro có tên tiếng Anh đầy đủ là Pomodoro Technique. Phương pháp Pomodoro đã rất hữu dụng trong việc giúp tập trung, sáng tạo và giảm bớt cảm giác mệt mỏi, thậm chí là xua tan hoàn toàn đi sự uể oải. </p>
        <div className="flex items-center space-x-2 pt-4">
            <MdOutlineChecklistRtl size={24} />
            <h2 className="text-lg font-semibold">Quy trình của Pomodoro</h2>
        </div>
        <div className="pt-3 text-justify">
            <ul className="list-disc pl-5 text-[14px]">
                <li>Chọn một việc làm/công việc cụ thể</li>
                <li>Đặt thời gian làm việc (thường là 25 phút)</li>
                <li>Tập trung làm việc đến khi hết thời gian</li>
                <li>Nghỉ giải lao 5 phút</li>
                <li>Lặp lại quy trình và sau 4 chu kỳ, nghỉ dài hơn</li>
            </ul>
        </div>
        <img src="./images/pomodoro_method.jpeg" alt="Pomodoro Technique" className="w-full mt-5" />
    </div>

      {/* Giữa */}
      <div className="w-1/2 flex flex-col items-center mt-8">
        <div className="bg-[#E0F8FE] p-10 rounded-lg shadow-lg text-center">
            <div className="flex justify-center space-x-4 mb-5">
            {Object.keys(modes).map((m) => (
                <button
                key={m}
                className={`px-4 py-2 rounded-lg font-bold ${
                    mode === m ? "bg-[#086280] text-white" : "bg-transparent text-[#086280]"
                }`}
                onClick={() => {
                    setMode(m);
                    setTime(modes[m]);
                    setIsRunning(false);
                }}
                >
                {m}
                </button>
            ))}
            </div>
            <div className="text-7xl mt-8 font-bold text-[#086280] mb-5">{formatTime(time)}</div>
            <button
            className="px-6 mt-4 py-3 bg-[#086280] text-white font-bold text-lg rounded-lg shadow-md hover:bg-[#07556F]"
            onClick={() => setIsRunning(!isRunning)}
            >
            {isRunning ? "DỪNG LẠI" : "BẮT ĐẦU"}
            </button>
            </div>
            {/* Trình phát nhạc */}
            <div className="w-[400px] bg-[#086280] text-white p-4 rounded-xl shadow-lg mt-10">
            <h2 className="text-center text-lg font-bold">{songs[currentIndex].name}</h2>
            <p className="text-center text-sm opacity-80">{songs[currentIndex].singer}</p>
            <AudioPlayer
              key={songs[currentIndex].url}
              src={songs[currentIndex].url}
              autoPlay
              showJumpControls={false}
              onEnded={handleNextSong}
              className="!bg-[#086280] !rounded-lg !shadow-md"
          />
          </div>
        </div>

      {/* Bên phải */}
      <div className="w-1/4 p-5 bg-white rounded-xl shadow-md">
        <div className="flex items-center space-x-2">
            <RiPlayListLine size={24} />
            <h2 className="text-lg font-semibold">Danh sách nhạc thư giãn</h2>
        </div>

        {/* Danh sách bài hát */}
        <ul className="mt-4 space-y-4">
            {songs.map((song, index) => (
            <li
                key={index}
                onClick={() => setCurrentIndex(index)} 
                className={`cursor-pointer ${currentIndex === index ? "font-bold text-blue-500" : ""}`}>
                {song.name}
                {song.singer && <span className="text-sm opacity-80"> - {song.singer}</span>}
            </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Pomodoro;
