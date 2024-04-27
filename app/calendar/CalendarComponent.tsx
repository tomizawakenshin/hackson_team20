import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ja';
import { collection, query, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../components/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from './Modal';
import styles from './calendar.module.css'
import { event } from 'firebase-functions/v1/analytics';

const localizer = momentLocalizer(moment);

interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
}

interface Schedule {
    id: string;
    scheduleType: string;
    date: string;
    startTime: string;
    endTime: string;
    clinic: string;
    symptom: string;
    note: string;
}

const CalendarComponent: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [user, loading, error] = useAuthState(auth);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [addSchedule, setAddSchedule] = useState<Schedule>({
        id: '',
        scheduleType: '',
        date: '',
        startTime: '',
        endTime: '',
        clinic: '',
        symptom: '',
        note:''
    });
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [currentView, setCurrentView] = useState<string>('month');

    // カレンダーに予定を表示するためにスケジュール取得
    useEffect(() => {
        if (!loading && user) {
            fetchEvents(user.uid);
        }
    }, [user, loading]);

    const fetchEvents = async (userId: string) => {
        try {
            const q = query(collection(db, `Users/${userId}/Schedule`));
            const querySnapshot = await getDocs(q);
            const fetchedEvents = querySnapshot.docs.map(doc => {
                const data = doc.data() as Schedule;
                return {
                    id: doc.id,
                    title: `${data.clinic} - ${data.symptom}`,
                    start: new Date(`${data.date}T${data.startTime}`),
                    end: new Date(`${data.date}T${data.endTime}`),
                };
            });
            setEvents(fetchedEvents);
        } catch (error: any) {
            setFetchError("予定の取得中にエラーが発生しました");
        }
    };

    // スケジュールの詳細表示のためのスケジュールデータ取得
    const handleSelectEvent = async (event: Event) => {
        try {
            const docRef = doc(db, `Users/${user?.uid}/Schedule`, event.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as Schedule;
                setSelectedSchedule({
                    scheduleType: data.scheduleType,
                    date: data.date,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    clinic: data.clinic,
                    symptom: data.symptom,
                    note: data.note,
                    id: event.id
                });
                setShowDetailsModal(true);
            } else {
                setFetchError("スケジュールが取得できませんでした。")
            }
        } catch (error: any) {
            setFetchError("スケジュールの取得中にエラーが発生しました。")
        }
    };

    // 予定の追加フォームモーダルの表示
    const handleAddSchedule = () => {
        setShowAddModal(true);
        setShowDetailsModal(false);
        setShowEditModal(false);
    };

    // 追加フォーム内の値
    const handleAddScheduleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAddSchedule({ ...addSchedule, [e.target.name]: e.target.value });
    };

    // 予定追加フォームが送信された時の処理
    const handleAddScheduleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!loading && user) {
            fetchEvents(user.uid);
            try {
                const docRef = await addDoc(collection(db, `Users/${user.uid}/Schedule`), {
                    ...addSchedule
                });
                setShowAddModal(false);
                fetchEvents(user.uid)
            } catch (e) {
                setFetchError('予定の追加処理中にエラーが発生しました。');
            }
        }
    };

    

    // 編集モーダルの表示
    const handleEditSchedule = () => {
        if (selectedSchedule) {
            setEditingSchedule(selectedSchedule);
            setShowDetailsModal(false);
            setShowEditModal(true);
        }
    };

    // 編集フォーム内の値
    const handleEditScheduleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (editingSchedule) {
            setEditingSchedule({ ...editingSchedule, [e.target.name]: e.target.value });
        }
    };    

    // 編集内容を保存
    const saveChanges = async () => {
        if (editingSchedule && user) {
            const docRef = doc(db, `Users/${user.uid}/Schedule`, editingSchedule.id);
            await updateDoc(docRef, {
                ...editingSchedule
            });
            fetchEvents(user.uid);
            setShowEditModal(false);
        }
    }

    // 予定の削除
    const handleDelete = async () => {
        if (user && selectedSchedule) {
            try {
                const docRef = doc(db, `Users/${user.uid}/Schedule`, selectedSchedule.id);
                await deleteDoc(docRef);
                setShowDetailsModal(false);
                fetchEvents(user.uid);
            } catch (error: any) {
                setFetchError("スケジュールの削除中にエラーが発生しました。")
            }
        }

    }

    // モーダルを閉じる処理
    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setShowEditModal(false);
        setShowAddModal(false);
    };

    const handleViewChange = (view: string) => {
        setCurrentView(view);
    };

    const handleNavigate = (date: Date, view: string) => {
        setCurrentDate(date);
        setCurrentView(view);
    };

    return (
        <div>
            {/* 診察予定追加ボタン */}
            <button onClick={handleAddSchedule} className={styles.button}>診察予定の追加</button>
            {handleAddSchedule !== null && (
                <Modal show={showAddModal} onClose={handleCloseModal}>
                    <p>診察予定の追加</p>
                    <form onSubmit={handleAddScheduleSubmit}>
                        <table className={styles.table}>
                            <tbody>
                                <tr>
                                    <td colSpan={2} className={styles.center}>
                                        <input type="radio" name="scheduleType" value="記録" onChange={handleAddScheduleChange} />記録
                                        <input type="radio" name="scheduleType" value="予定" onChange={handleAddScheduleChange} />予定
                                        <input type="radio" name="scheduleType" value="目安" onChange={handleAddScheduleChange} />目安
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles.right}><label htmlFor="date">日付</label></td>
                                    <td className={styles.left}><input type="date" name="date" id="date" required value={addSchedule.date} onChange={handleAddScheduleChange} /></td>
                                </tr>
                                <tr>
                                    <td className={styles.right}><label htmlFor="startTime">開始時間</label></td>
                                    <td className={styles.left}><input type="time" name="startTime" id="startTime" value={addSchedule.startTime} onChange={handleAddScheduleChange} /></td>
                                </tr>
                                <tr>
                                    <td className={styles.right}><label htmlFor="endTime">終了時間</label></td>
                                    <td className={styles.left}><input type="time" name="endTime" id="endTime" value={addSchedule.endTime} onChange={handleAddScheduleChange} /></td>
                                </tr>
                                <tr> {/* 病院検索機能を埋め込みたい */}
                                    <td className={styles.right}><label htmlFor="clinic">病院</label></td>
                                    <td className={styles.left}><input type="text" name="clinic" id="clinic" value={addSchedule.clinic} onChange={handleAddScheduleChange} /></td>
                                </tr>
                                <tr>
                                    <td className={styles.right}><label htmlFor="symptom">症状・診察内容</label></td>
                                    <td className={styles.left}><textarea name="symptom" id="symptom" rows={2} value={addSchedule.symptom} onChange={handleAddScheduleChange}></textarea></td>
                                </tr>
                                <tr>
                                    <td className={styles.right}><label htmlFor="note">メモ</label></td>
                                    <td className={styles.left}><textarea name="note" id="note" rows={3} value={addSchedule.note} onChange={handleAddScheduleChange}></textarea></td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className={styles.right}><button type="submit">追加</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </Modal>
            )}
            

            {/* カレンダー画面 */}
            {fetchError && <p>{fetchError}</p>}
            <div className={styles.calendar}>
                <button onClick={() => handleViewChange('month')} style={{position:'relative',right:'-411px',top:'33px',width:'80px',height:'30px'}}></button>
                <button onClick={() => handleViewChange('week')} style={{position:'relative',right:'-411px',top:'33px',width:'73px',height:'30px'}}></button>
                <button onClick={() => handleViewChange('day')} style={{position:'relative',right:'-411px',top:'33px',width:'60px',height:'30px'}}></button>
                <button onClick={() => handleViewChange('agenda')} style={{position:'relative',right:'-411px',top:'33px',width:'90px',height:'30px'}}></button>
                <Calendar
                    localizer={localizer}
                    events={loading || error ? [] : events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    onSelectEvent={handleSelectEvent}
                    views={['month', 'week', 'day', 'agenda']}
                    date={currentDate}
                    view={currentView}
                    onNavigate={handleNavigate}
                />
            </div>
            {/* 予定が選択された時にイベントの詳細を表示するモーダル */}
            {selectedSchedule && (
                <Modal show={showDetailsModal} onClose={handleCloseModal}>
                <table className={styles.table}>
                    <tbody>
                        <tr>
                            <td colSpan={2} className={styles.center}>
                            </td>
                        </tr>
                        <tr>
                            <td className={styles.right}>日付: </td>
                            <td className={styles.left}>{selectedSchedule?.date}</td>
                        </tr>
                        <tr>
                            <td className={styles.right}>時間: </td>
                            <td className={styles.left}>{selectedSchedule?.startTime}～{selectedSchedule?.endTime}</td>
                        </tr>
                        <tr>
                            <td className={styles.right}>病院: </td>
                            <td className={styles.left}>{selectedSchedule?.clinic}</td>
                        </tr>
                        <tr>
                            <td className={styles.right}>症状・診察内容: </td>
                            <td className={styles.left}>{selectedSchedule?.symptom}</td>
                        </tr>
                        <tr>
                            <td className={styles.right}>メモ: </td>
                            <td className={styles.left}>{selectedSchedule?.note}</td>
                        </tr>
                        <tr>
                            <td className={styles.center}><button onClick={handleEditSchedule}>編集</button></td>
                            <td className={styles.center}><button onClick={handleDelete}>削除</button></td>
                        </tr>
                    </tbody>
                </table>
                </Modal>
            )}

            {/* 編集ボタンが押された時の編集画面モーダル */}
            {editingSchedule && showEditModal && (
                <Modal show={showEditModal} onClose={handleCloseModal}>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <table className={styles.table}>
                            <tbody>
                                <tr>
                                    <td colSpan={2} className={styles.center}>
                                        <input 
                                            type="radio" name="scheduleType" value="記録" 
                                            checked={editingSchedule.scheduleType === '記録'}
                                            onChange={handleEditScheduleChange}
                                        />記録
                                        <input 
                                            type="radio" name="scheduleType" value="予定"
                                            checked={editingSchedule.scheduleType === '予定'}
                                            onChange={handleEditScheduleChange} 
                                        />予定
                                        <input 
                                            type="radio" name="scheduleType" value="目安" 
                                            checked={editingSchedule.scheduleType === '目安'}
                                            onChange={handleEditScheduleChange} 
                                        />目安
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles.right}>
                                        <label htmlFor="date">日付</label>
                                    </td>
                                    <td className={styles.left}>
                                        <input 
                                            type="date" name="date" id="date" 
                                            required value={editingSchedule.date} 
                                            onChange={handleEditScheduleChange} 
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles.right}>
                                        <label htmlFor="startTime">開始時間</label>
                                    </td>
                                    <td className={styles.left}>
                                        <input 
                                            type="time" name="startTime" id="startTime" 
                                            value={editingSchedule.startTime} 
                                            onChange={handleEditScheduleChange}  
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles.right}>
                                        <label htmlFor="endTime">終了時間</label>
                                    </td>
                                    <td className={styles.left}>
                                        <input 
                                            type="time" name="endTime" id="endTime" 
                                            value={editingSchedule.endTime} 
                                            onChange={handleEditScheduleChange}  
                                        />
                                    </td>
                                </tr>
                                <tr> {/* 病院検索機能を埋め込みたい */}
                                    <td className={styles.right}>
                                        <label htmlFor="clinic">病院</label>
                                    </td>
                                    <td className={styles.left}>
                                        <input 
                                            type="text" name="clinic" id="clinic" 
                                            value={editingSchedule.clinic} 
                                            onChange={handleEditScheduleChange}  
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles.right}>
                                        <label htmlFor="symptom">症状・診察内容</label>
                                    </td>
                                    <td className={styles.left}>
                                        <textarea 
                                            name="symptom" id="symptom" rows={2} 
                                            value={editingSchedule.symptom} 
                                            onChange={handleEditScheduleChange} 
                                        ></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles.right}>
                                        <label htmlFor="note">メモ</label>
                                    </td>
                                    <td className={styles.left}>
                                        <textarea 
                                            name="note" id="note" rows={3} 
                                            value={editingSchedule.note} 
                                            onChange={handleEditScheduleChange}>
                                        </textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles.center}>
                                        <button type="button" onClick={saveChanges}>保存</button>
                                    </td>
                                    <td className={styles.center}>
                                        <button type="button" onClick={handleCloseModal}>キャンセル</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default CalendarComponent;