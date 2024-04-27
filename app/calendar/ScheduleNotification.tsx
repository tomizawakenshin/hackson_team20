//"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "../../components/firebase";
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, query, getDocs, where } from 'firebase/firestore';
import { addDays, format } from 'date-fns';

interface Schedule {
    title: string;
    scheduleType: string;
    date: string;
    startTime: string;
    endTime: string;
    clinic: string;
    symptom: string;
    note: string;
}


const ScheduleNotification = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        async function requestNotificationPermission() {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                console.log("プッシュ通知の許可が与えられました");
                fetchSchedule();
            } else if (permission === "denied") {
                console.log("プッシュ通知が拒否されました");
            } else {
                console.log("プッシュ通知の許可が保留されています");
            }
        }
        if (user) {
            requestNotificationPermission();
        } else {
            console.log("ユーザーが存在しません");
        }
    }, [user]);

    const fetchSchedule = async () => {
        if (user) {
            try {
                const userId = user.uid;
                const today = format(new Date(), 'yyyy-MM-dd');
                const todayRef = query(collection(db, `Users/${userId}/Schedule`), where('date', '==', today)); 
                const todaySnapshot = await getDocs(todayRef);

                const tomorrowSchedules = todaySnapshot.docs.map(doc => ({
                    ...doc.data() as Schedule,
                    title: "今日の予定",
                }));
                setSchedules(tomorrowSchedules);
                tomorrowSchedules.forEach(schedule => {
                    showNotification(schedule);
                });
            } catch (error: any) {
                console.error("スケジュールの取得中にエラーが発生しました。", error);
            }
        }
    }

    const showNotification = (schedule: Schedule) => {
        // プッシュ通知の許可状態を確認し、許可されていれば通知を送信
        if (Notification.permission === 'granted') {
            const notificationOptions = {
                body: `${schedule.date} ${schedule.startTime}～${schedule.endTime} @${schedule.clinic} (${schedule.symptom})`,
                // icon: "notification_icon.png", // 通知に表示するアイコンのパス
            };
            new Notification(`${schedule.title}`, notificationOptions);
        } else {
            console.log("プッシュ通知が許可されていません。");
        }
    };

    return null;
};

export default ScheduleNotification;