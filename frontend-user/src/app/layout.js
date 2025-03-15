import { ThemeProvider } from "next-themes";
import { Roboto_Condensed } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthWrapper from "./auth-wrapper";
import "./globals.css";
import Header from "./components/Header";

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Vibely",
  description: "Mạng xã hội học tập kết nối các bạn học sinh, sinh viên",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${robotoCondensed.variable} antialiased`}>
        <Toaster />
        <ThemeProvider attribute="class">
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}