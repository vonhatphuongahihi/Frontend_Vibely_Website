"use client";

import { useEffect } from 'react';

const GoogleCalendarCallback = () => {
    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Lấy code từ URL
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');

                if (!code) {
                    throw new Error('Không tìm thấy mã xác thực');
                }

                console.log("Callback received code:", code); // Debug log

                // Gửi code về cho main window
                if (window.opener) {
                    console.log("Sending code to main window"); // Debug log
                    window.opener.postMessage({
                        type: 'GOOGLE_CALENDAR_AUTH',
                        code: code
                    }, '*'); // Thay đổi origin thành '*' để cho phép gửi từ bất kỳ domain nào
                } else {
                    console.log("No opener window found"); // Debug log
                }

                // Hiển thị thông báo thành công
                document.body.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif;">
                        <h2 style="color: #4CAF50; margin-bottom: 20px;">Xác thực Google Calendar thành công!</h2>
                        <p>Bạn có thể đóng tab này.</p>
                    </div>
                `;
            } catch (error) {
                console.error('Lỗi xử lý callback:', error);
                document.body.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif;">
                        <h2 style="color: #f44336; margin-bottom: 20px;">Lỗi xác thực</h2>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        };

        handleCallback();
    }, []);

    return null;
};

export default GoogleCalendarCallback; 