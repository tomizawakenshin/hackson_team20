import React from 'react'
import { auth } from './firebase'

function SidebarIcon() {
  return (
    <div className='SidebarIcon'>
      <a href='/'>
        <h1 className='text-3xl py-3 text-white'>MediGuide</h1>
      </a>
        <div className='flex items-center justify-center'>
          <img src = {auth.currentUser?.photoURL} alt= ""/>
        </div>
        <p>{auth.currentUser?.email}</p>
    </div>
  )
}

export default SidebarIcon