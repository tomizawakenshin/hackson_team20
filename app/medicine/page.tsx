"use client";
import MedicineReminder from '@/components/MedicineReminder'
import Sidebar from '@/components/Sidebar'
import React from 'react'

const page = () => {
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
  )
}

export default page
