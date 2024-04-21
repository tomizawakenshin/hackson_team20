"use client";
import Sidebar from '@/components/Sidebar'
import React from 'react'

const page = () => {
  return (
    <div className='App'>
        <div className='gap-4'>
            <div className='Sidebar'>
                <Sidebar />
            </div>
            <p className='
            text-center
            text-9xl
            '>ここに服薬お知らせ機能を実装</p>
        </div>
    </div>
  )
}

export default page