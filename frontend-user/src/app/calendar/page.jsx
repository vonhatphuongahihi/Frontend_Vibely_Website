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
import { getSchedule, createSchedule, updateSchedule, deleteSchedule } from "@/service/schedule.service";
import "./schedule.css";

registerLicense(
    "Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCe0x3WmFZfVtgdl9DZVZURWYuP1ZhSXxWdkFjWH9cdXFQQ2ZZU0x9XUs="
);

const Schedule = () => {
    const [events, setEvents] = useState([]);

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
            }
        };

        fetchSchedules();
    }, []);

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

    return (
        <main className="pt-14">
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
