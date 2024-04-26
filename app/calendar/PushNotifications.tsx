import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { addDays } from 'date-fns';
import { db } from "../../components/firebase";
import { collection, query, getDocs, where, DocumentData } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

interface ScheduleData {
    scheduleType: string;
    date: string;
    timeStart: string;
    timeEnd: string;
    clinic: string;
    symptom: string;
    note: string;
}


export const sendDailyNotification = functions.pubsub
    .schedule('0 9 2 0 *') 
    .timeZone('Asia/Tokyo')
    .onRun(async (context: any) => {
        
    const tomorrow = addDays(new Date(), 1);

    try {
        const userRef = query(collection(db, `Users`))
        const usersSnapshot = await getDocs(userRef);

        const usersPromises = usersSnapshot.docs.map(async (userDoc) => {
            const uid = userDoc.id;

            const scheduleRef = query(collection(db, `Users/${uid}/Schedule`), where('date', '==', tomorrow));
            const scheduleSnapshot = await getDocs(scheduleRef);
                
            const notifications = scheduleSnapshot.docs.map((scheduleDoc) => {
                const scheduleData = scheduleDoc.data() as ScheduleData;
    
                const message =
                    `${scheduleData.date} ${scheduleData.timeStart}～${scheduleData.timeEnd}
                    ＠${scheduleData.clinic} (${scheduleData.symptom}) (${scheduleData.note})`;
    
                return sendPushNotification(uid, message);
            });

            return Promise.all(notifications);
        });
            
        await Promise.all(usersPromises);

    } catch (error) {
        console.error("エラーが発生しました。:", error);
    }     
});


const sendPushNotification = (uid: string, message: string) => {
    const notification = {
        notification: {
            title: '明日の予定',
            body: message
        }
    };

    const topic = `user_${uid}`;

    return admin.messaging().sendToTopic(topic, notification);
}