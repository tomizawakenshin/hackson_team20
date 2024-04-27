'use client'
import MedicineReminder from '@/components/MedicineReminder';
import Sidebar from '@/components/Sidebar';
import React, { useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '@/components/firebase';
import Image from "next/image";

const Page = () => {
  const db = getDatabase(app);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchMedicines = () => {
      if (user) {
        const medicinesRef = ref(db, `users/${user.uid}/medicines`);
        onValue(medicinesRef, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).forEach((medicine: any) => {
              const timing = new Date(`${new Date().toDateString()} ${medicine.timing}`).getTime();
              const currentTime = new Date().getTime();
              const timeDifference = timing - currentTime;
              if (timeDifference > 0) {
                setTimeout(() => {
                  showNotification(medicine.medicineName, medicine.dose);
                }, timeDifference);
              }
            });
          }
        });
      }
    };

    fetchMedicines();
  }, [user, db]);

  const showNotification = (medicineName: string, dose: number) => {
    // プッシュ通知の許可状態を確認し、許可されていれば通知を送信
    if (Notification.permission === "granted") {
      const notificationOptions = {
        body: `${medicineName}を${dose}錠服用してください`,
        icon: '/Image/medicineIcon.png',
      };
      new Notification("MediGuideからの通知", notificationOptions);
    } else {
      console.log("プッシュ通知が許可されていません。");
    }
  };

  useEffect(() => {
    // 通知の許可を求める
    const requestNotificationPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("プッシュ通知の許可が与えられました");
      } else if (permission === "denied") {
        console.log("プッシュ通知が拒否されました");
      } else {
        console.log("プッシュ通知の許可が保留されています");
      }
    };

    requestNotificationPermission();
  }, []);

  return (
    <div className='App'>
        <div className='flex'>
            <div className='Sidebar'>
                <Sidebar />
            </div>
            <div className='text-3xl w-full'>
              <div className='py-10 bg-pink-100 text-center'>
                  <h1 className="text-3xl font-bold mb-4 text-stone-600">
                      お薬リスト
                  </h1>
              </div>
              <MedicineReminder />
            </div>
        </div>
    </div>
  );
};

export default Page;
