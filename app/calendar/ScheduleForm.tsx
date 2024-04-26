import React, { useState, ChangeEvent, FormEvent } from 'react';
import { auth, db } from '../../components/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import styles from './calendar.module.css';

interface Schedule {
    scheduleType: string;
    date: string;
    startTime: string;
    endTime: string;
    clinic: string;
    symptom: string;
    note: string;
}


interface Props {
    onSubmitSuccess: () => void;
}

const ScheduleForm: React.FC<Props> = ({ onSubmitSuccess }) => {
    const [user] = useAuthState(auth);
    const [schedule, setSchedule] = useState<Schedule>({
        scheduleType: '',
        date: '',
        startTime: '',
        endTime: '',
        clinic: '',
        symptom: '',
        note: ''
    });
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSchedule({ ...schedule, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        try {
            const docRef = await addDoc(collection(db, `Users/${user.uid}/Schedule`), {
                ...schedule
            });
            setErrorMessage('');
            onSubmitSuccess();
        } catch (e) {
            setErrorMessage('予定の追加処理中にエラーが発生しました。');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <table className={styles.table}>
                <tbody>
                    <tr>
                        <td colSpan={2} className={styles.center}>
                            <input type="radio" name="scheduleType" value="記録" onChange={handleChange} />記録
                            <input type="radio" name="scheduleType" value="予定" onChange={handleChange} />予定
                            <input type="radio" name="scheduleType" value="目安" onChange={handleChange} />目安
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.right}><label htmlFor="date">日付</label></td>
                        <td className={styles.left}><input type="date" name="date" id="date" required value={schedule.date} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td className={styles.right}><label htmlFor="startTime">開始時間</label></td>
                        <td className={styles.left}><input type="time" name="startTime" id="startTime" value={schedule.startTime} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td className={styles.right}><label htmlFor="endTime">終了時間</label></td>
                        <td className={styles.left}><input type="time" name="endTime" id="endTime" value={schedule.endTime} onChange={handleChange} /></td>
                    </tr>
                    <tr> {/* 病院検索機能を埋め込みたい */}
                        <td className={styles.right}><label htmlFor="clinic">病院</label></td>
                        <td className={styles.left}><input type="text" name="clinic" id="clinic" value={schedule.clinic} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td className={styles.right}><label htmlFor="symptom">症状・診察内容</label></td>
                        <td className={styles.left}><textarea name="symptom" id="symptom" rows={2} value={schedule.symptom} onChange={handleChange}></textarea></td>
                    </tr>
                    <tr>
                        <td className={styles.right}><label htmlFor="note">メモ</label></td>
                        <td className={styles.left}><textarea name="note" id="note" rows={3} value={schedule.note} onChange={handleChange}></textarea></td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={styles.right}><button type="submit">追加</button></td>
                    </tr>
                </tbody>
            </table>
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        </form>
    );
};

export default ScheduleForm;
