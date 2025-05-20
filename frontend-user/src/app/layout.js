import { Roboto_Condensed } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthWrapper from "./auth-wrapper";
import { ContextProvider } from "./context/QuizContext";
import { SocketProvider } from "./components/SocketProvider";
import "./globals.css";
import { Suspense } from 'react';

const robotoCondensed = Roboto_Condensed({ subsets: ['latin'], variable: '--font-roboto-condensed' });

export const metadata = {
  title: "Vibely",
  description: "Mạng xã hội học tập kết nối các bạn học sinh, sinh viên",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={robotoCondensed.variable}>
      <body className="antialiased">
        <Toaster />
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-16 h-16 border-4 border-[#23CAF1] border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <AuthWrapper>
            <ContextProvider>
              {children}
            </ContextProvider>
          </AuthWrapper>
        </Suspense>
      </body>
    </html>
  );
}