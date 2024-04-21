import React from 'react'
import { auth } from './firebase'

function SidebarIcon() {
  return (
    <div className='SidebarIcon'>
        <p className='text-5xl'>MediNav</p>
        <img src = {auth.currentUser?.photoURL} alt= ""/>
        <p>{auth.currentUser?.email}</p>
    </div>
  )
}

export default SidebarIcon