'use client';
import { getAllQuizzes } from '@/service/quiz.service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LeftSideBar from '../components/LeftSideBar';
import QuizCard from '../components/quiz/QuizCard';

function QuizzesArea() {
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizzes = await getAllQuizzes();
        setAllQuizzes(quizzes || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quiz:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="poppins mx-12 pt-20">
      <div className="md:hidden">
        <LeftSideBar />
      </div>
      {isLoading ? (
        (
          <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
            <div className="w-16 h-16 border-4 border-[#23CAF1] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )
      ) : (
        <div>
          <p className="text-xl font-bold">Vibely Quizzes</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allQuizzes.length > 0 ? (
              allQuizzes.map((singleQuiz, quizIndex) => (
                <div key={quizIndex}>
                  <QuizCard singleQuiz={singleQuiz} />
                </div>
              ))
            ) : (
              <p className="text-gray-500">Không có quiz nào.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizzesArea;
