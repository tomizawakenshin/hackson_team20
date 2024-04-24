"use client";
import Sidebar from '@/components/Sidebar'
import React from 'react'

const page = () => {
  return (
    <div className='App'>
        <div className='gap-4 flex pt-10'>
            <div className='Sidebar'>
                <Sidebar />
            </div>
        </div>
    </div>
  )
}

export default page