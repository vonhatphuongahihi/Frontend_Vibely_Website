import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";

const SupportPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-10">
      <div className="max-w-7xl w-full flex gap-20">
        {/* Hình ảnh bên trái */}
        <div className="w-1/2 flex justify-center items-center">
          <Image
            src="/images/faq-image.png"
            alt="FAQ Illustration"
            width={500}
            height={500}
          />
        </div>
        
        {/* Form bên phải */}
        <div className="w-1/2 flex flex-col justify-center px-10">
          <h2 className="text-2xl font-bold mb-6 text-center">GỬI THẮC MẮC</h2>
          <p className="mb-5">
            Vui lòng cung cấp đầy đủ thông tin về vấn đề bạn gặp phải. Chúng tôi sẽ xử lý yêu cầu của bạn nhanh chóng và chính xác hơn.
          </p>
          <Textarea
            className="w-full p-3 border border-gray-500 placeholder:text-gray-400 rounded-lg md:text-base"
            placeholder="Nhập ở đây..."
            rows={6}
          />
          <div className="flex justify-end mt-6">
            <Button
              variant="default"
              size="lg"
              className="bg-[#086280] text-white text-md py-2 px-7 rounded-lg hover:bg-[#07556F] transition duration-300"
            >
              Gửi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;