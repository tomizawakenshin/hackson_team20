'use client'
import React, { useState, useEffect } from 'react';
import { app, auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDatabase, ref, set, onValue, push, remove } from "firebase/database";
import { twMerge } from 'tailwind-merge';

interface Medicine {
  id?: string;
  medicineName: string;
  dose: number;
  timing: string;
}

const MedicineReminder: React.FC = () => {
  const db = getDatabase(app);
  const [user] = useAuthState(auth);

  const [medicines, setMedicines] = useState<[string, Medicine][]>([]);
  const [newMedicine, setNewMedicine] = useState<Medicine>({ medicineName: '', dose: 1, timing: '00:00' });
  const [errors, setErrors] = useState<Partial<Medicine>>({});

  useEffect(() => {
  const fetchMedicines = () => {
    if (user) {
      const medicinesRef = ref(db, `users/${user.uid}/medicines`);
      const unsubscribe = onValue(medicinesRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          const sortedMedicines: [string, Medicine][] = Object.entries(data).map(([id, value]) => [
            id,
            value as Medicine,
          ]);
          setMedicines(sortedMedicines);
        } else {
          // ユーザーのデータがない場合は空配列を設定
          setMedicines([]);
        }
      });
      return () => unsubscribe();
    } else {
      setMedicines([]);
    }
  };

  fetchMedicines();
}, [user, db]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'dose') {
      const numValue = Number(value);
      if (numValue >= 1 && numValue <= 10) {
        setNewMedicine({ ...newMedicine, [name]: numValue });
        setErrors({ ...errors, [name]: undefined });
      } else {
        setErrors({ ...errors, [String(name)]: '服用量は1から10の間で入力してください' });
      }
    } else if (name === 'timing') {
      const [hours, minutes] = value.split(':');
      const numHours = Number(hours);
      const numMinutes = Number(minutes);
      if (numHours >= 0 && numHours <= 23 && numMinutes >= 0 && numMinutes <= 59) {
        setNewMedicine({ ...newMedicine, [name]: value });
        setErrors({ ...errors, [name]: undefined });
      } else {
        setErrors({ ...errors, [name]: '時間を正しい形式で入力してください' });
      }
    } else {
      setNewMedicine({ ...newMedicine, [name]: value });
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    if (newMedicine.medicineName.trim() === '' || Object.values(errors).some(error => error)) {
      return;
    }
    const medicinesRef = ref(db, `users/${user.uid}/medicines`);
    const newMedicineRef = push(medicinesRef);
    set(newMedicineRef, newMedicine);
    setNewMedicine({ medicineName: '', dose: 1, timing: '00:00' });
    setErrors({});
  };

  const handleRemove = (id: string) => {
    if (!user) return; // ユーザーがログインしていない場合は処理しない
    const medicineRef = ref(db, `users/${user.uid}/medicines/${id}`);
    // データベースからアイテムを削除
    remove(medicineRef)
      .then(() => {
        // 削除が成功したら、状態を更新して再描画
        setMedicines(prevMedicines => prevMedicines.filter(([medicineId, _]) => medicineId !== id));
      })
      .catch(error => {
        console.error("削除エラー:", error.message);
      });
  }

  return (
    <main className="container flex space-x-20">
      <div className='w-full'>
        <div className=''>
          <div className='py-10 bg-pink-100 text-center rounded-lg'>
            <h1 className="text-3xl font-bold mb-4 text-stone-600">お薬リスト</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-20 flex-col flex">
          <div className='pt-10'>
            <label htmlFor="medicineName" className="block font-medium text-stone-600">
              お薬名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="medicineName"
              placeholder="頭痛薬"
              value={newMedicine.medicineName}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md py-2 px-3 w-full"
            />
            {errors.medicineName && <p className="text-red-500">{errors.medicineName}</p>}
          </div>
          <div>
            <label htmlFor="dose" className="block font-medium text-stone-600">
              １回服用量 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="dose"
              min="1"
              max="10"
              value={newMedicine.dose}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md py-2 px-3 w-full"
            />
            {errors.dose && <p className="text-red-500">{errors.dose}</p>}
          </div>
          <div>
            <label htmlFor="timing" className="block font-medium text-stone-600">
              服用するタイミング <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="timing"
              value={newMedicine.timing}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md py-2 px-3 w-full"
            />
            {errors.timing && <p className="text-red-500">{errors.timing}</p>}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            disabled={Object.values(errors).some(error => error)}
          >
            追加
          </button>
        </form>
      </div>
      <div className="w-full">
        {medicines.map(([id, medicine], index) => (
          <div key={id} className="bg-gray-100 rounded-md p-4 mb-4">
            <p className="font-medium mb-2">{index + 1}. {medicine.medicineName}</p>
            <p className="text-gray-600">服用量: {medicine.dose} 錠</p>
            <p className="text-gray-600">服用時間: {medicine.timing} </p>
            <button
              onClick={() => handleRemove(id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-2"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MedicineReminder;
