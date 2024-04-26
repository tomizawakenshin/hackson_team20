"use client"
import Sidebar from '@/components/Sidebar'
import React, { useState} from 'react'
import Modal from './Modal'
import ScheduleForm from './ScheduleForm'
import CalendarComponent from './CalendarComponent';
import styles from './calendar.module.css'


const page: React.FC = () => {

  return (
    <div className='App'>

      <div className='gap-4'>
        <div className='Sidebar'>
          <Sidebar />
        </div>
        <div className='text-center text-xs'>
          <CalendarComponent />

        </div>
      </div>
    </div>
  )
}

export default page;