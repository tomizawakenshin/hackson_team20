"use client";
import MedicineReminder from '@/components/MedicineReminder'
import Sidebar from '@/components/Sidebar'
import React from 'react'

const page = () => {
  return (
    <div className='App'>
        <div className='gap-52 flex'>
            <div className='Sidebar'>
                <Sidebar />
            </div>
            <div className='text-3xl px-36'>
              <MedicineReminder />
            </div>
        </div>
    </div>
  )
}

export default page
