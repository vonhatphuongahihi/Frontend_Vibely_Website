"use client";

import * as React from "react";
import {
    Day,
    Week,
    Month,
    Agenda,
    ScheduleComponent,
    Inject,
    ViewsDirective,
    ViewDirective
} from "@syncfusion/ej2-react-schedule";
import { useEffect, useState } from "react";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-react-schedule/styles/material.css";
import { registerLicense } from "@syncfusion/ej2-base";
import { getSchedule, createSchedule, updateSchedule, deleteSchedule, getGoogleCalendarAuthUrl, connectGoogleCalendar, disconnectGoogleCalendar, getGoogleCalendarStatus } from "@/service/schedule.service";
import "./schedule.css";
import { FaGoogle } from "react-icons/fa";
import { toast } from 'react-hot-toast';

registerLicense(
    "GTIlMmhhan1ifWBgaGNifGNlfGFjYWZzY2tpYmJpYWBoYWFmYWJiZGETND59JjonfTY3Jn0lPWhhag=="
);

const Schedule = () => {
    const [events, setEvents] = useState([]);
    const [showAuth, setShowAuth] = useState(false);
    const [authUrl, setAuthUrl] = useState("");
    const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const data = await getSchedule();
                const formattedData = data.map(item => ({
                    Id: item.id,
                    Subject: item.subject,
                    StartTime: new Date(item.startTime + 'Z'),
                    EndTime: new Date(item.endTime + 'Z'),
                    CategoryColor: item.categoryColor || "#00FF00",
                    isAllDay: item.isAllDay || false
                }));
                setEvents(formattedData);
            } catch (error) {
                console.error("❌ Lỗi khi lấy lịch trình:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
        checkGoogleCalendarStatus();
    }, []);

    const checkGoogleCalendarStatus = async () => {
        try {
            const response = await getGoogleCalendarStatus();
            setIsGoogleCalendarConnected(response.data);
        } catch (error) {
            console.error("Lỗi kiểm tra trạng thái Google Calendar:", error);
        }
    };

    const formatDate = (date) => {
        return date.toISOString();
    };

    const addEvent = async (event) => {
        try {
            const result = await createSchedule({
                subject: event.Subject,
                startTime: formatDate(event.StartTime),
                endTime: formatDate(event.EndTime),
                categoryColor: event.CategoryColor || "#0000FF"
            });

            setEvents([...events, { ...event, Id: result.data.id }]);
        } catch (error) {
            console.error("❌ Lỗi khi thêm lịch trình:", error);
        }
    };

    const updateEvent = async (event) => {
        try {
            await updateSchedule(event.Id, {
                subject: event.Subject,
                startTime: formatDate(event.StartTime),
                endTime: formatDate(event.EndTime),
                categoryColor: event.CategoryColor
            });

            setEvents(events.map((e) => (e.Id === event.Id ? event : e)));
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật lịch trình:", error);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            await deleteSchedule(eventId);
            setEvents(events.filter((e) => e.Id !== eventId));
        } catch (error) {
            console.error("❌ Lỗi khi xóa lịch trình:", error);
        }
    };

    const handleGoogleCalendarConnect = async () => {
        try {
            const authUrl = await getGoogleCalendarAuthUrl();

            if (!authUrl) {
                toast.error("URL xác thực không hợp lệ");
                return;
            }

            setAuthUrl(authUrl);
            setShowAuth(true);
        } catch (error) {
            console.error("Lỗi kết nối Google Calendar:", error);
            toast.error("Không thể kết nối với Google Calendar");
        }
    };

    const handleAuthButtonClick = () => {
        if (!authUrl) {
            toast.error("URL xác thực không hợp lệ");
            return;
        }

        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
            authUrl,
            'Google Calendar Auth',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) {
            toast.error("Trình duyệt đã chặn popup. Vui lòng cho phép popup và thử lại.");
            return;
        }

        setShowAuth(false);

        const messageHandler = async (event) => {

            if (event.data.type === 'GOOGLE_CALENDAR_AUTH') {
                const { code } = event.data;

                try {
                    const response = await connectGoogleCalendar({ code });

                    const statusResponse = await getGoogleCalendarStatus();

                    if (statusResponse.data) {
                        setIsGoogleCalendarConnected(true);
                        toast.success("Kết nối Google Calendar thành công!");
                    } else {
                        setIsGoogleCalendarConnected(false);
                        toast.error("Không thể kết nối với Google Calendar");
                    }

                    window.removeEventListener('message', messageHandler);
                    popup.close();
                } catch (error) {
                    console.error("Lỗi xử lý token:", error);
                    toast.error("Không thể lưu thông tin xác thực");
                    setIsGoogleCalendarConnected(false);
                    window.removeEventListener('message', messageHandler);
                }
            }
        };

        window.addEventListener('message', messageHandler);
    };

    const handleGoogleCalendarDisconnect = async () => {
        try {
            await disconnectGoogleCalendar();
            setIsGoogleCalendarConnected(false);
            toast.success("Đã ngắt kết nối Google Calendar");
        } catch (error) {
            toast.error("Không thể ngắt kết nối Google Calendar");
        }
    };

    useEffect(() => {
        const checkConnectionStatus = async () => {
            try {
                const response = await getGoogleCalendarStatus();
                setIsGoogleCalendarConnected(response.data);
            } catch (error) {
                console.error("Lỗi kiểm tra trạng thái kết nối:", error);
                setIsGoogleCalendarConnected(false);
            }
        };

        checkConnectionStatus();
    }, []);

    return (
        <main className="pt-14 relative">
            <div className="fixed top-20 right-10 z-50">
                <button
                    onClick={handleGoogleCalendarConnect}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <img src="/gg_calendar.png" alt="Google Calendar" className="w-6 h-6" />
                    <span>Google Calendar</span>
                </button>
                {showAuth && (
                    <div className="absolute top-14 right-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-5 z-50">
                        <div className="flex items-center gap-3 mb-3">
                            <img src="/gg_calendar.png" alt="Google Calendar" className="w-6 h-6" />
                            <h3 className="font-semibold text-gray-900">Kết nối Google Calendar</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                            Vui lòng xác thực để đồng bộ lịch của bạn với Google Calendar
                        </p>
                        <button
                            onClick={handleAuthButtonClick}
                            className="block w-full text-center px-2 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 transition-colors font-semibold text-base"
                        >
                            Xác thực ngay
                        </button>
                    </div>
                )}
                {isGoogleCalendarConnected && (
                    <button
                        onClick={handleGoogleCalendarDisconnect}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2"
                    >
                        <img src="/gg_calendar.png" alt="Google Calendar" className="w-6 h-6" />
                        <span>Ngắt kết nối Google Calendar</span>
                    </button>
                )}
            </div>
            <ScheduleComponent
                width="100%"
                height="650px"
                eventSettings={{
                    dataSource: events,
                    fields: {
                        id: "Id",
                        subject: { name: "Subject" },
                        startTime: { name: "StartTime" },
                        endTime: { name: "EndTime" }
                    }
                }}
                actionBegin={(args) => {
                    if (args.requestType === "eventCreate") {
                        addEvent(args.data[0]);
                        args.cancel = true;
                    } else if (args.requestType === "eventChange") {
                        const updatedEvent = Array.isArray(args.data) ? args.data[0] : args.data;
                        updateEvent(updatedEvent);
                    } else if (args.requestType === "eventRemove") {
                        const eventToDelete = Array.isArray(args.data) ? args.data[0] : args.data;
                        deleteEvent(eventToDelete.Id);
                    }
                }}
            >
                <ViewsDirective>
                    <ViewDirective option="Day" />
                    <ViewDirective option="Week" />
                    <ViewDirective option="Month" />
                    <ViewDirective option="Agenda" />
                </ViewsDirective>
                <Inject services={[Day, Week, Month, Agenda]} />
            </ScheduleComponent>
        </main>
    );
};

export default Schedule;