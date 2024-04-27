"use client";
import MedicineReminder from '@/components/MedicineReminder'
import Sidebar from '@/components/Sidebar'
import React from 'react'

const page = () => {
  return (
    <div className='App'>
        <div className='flex space-x-10'>
            <div className='Sidebar'>
                <Sidebar />
            </div>
            <div className='text-3xl'>
              <MedicineReminder />
            </div>
        </div>
    </div>
  )
}

export default page
