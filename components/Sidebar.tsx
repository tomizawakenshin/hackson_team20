"use client";

import React from 'react'
import { SidebarData } from './FrontEndData'
import SidebarIcon from './SidebarIcon';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { auth } from './firebase';

const Sidebar = () => {
  return (
    <div className='Sidebar'>
        <SidebarIcon />
        <ul className='SidebarList'>
            {SidebarData.map((value, key) => {
                return(
                    <li key = {key}
                        onClick={() => {
                            window.location.pathname = value.link;
                        }}
                        className='row'>
                        <div id = "icon">{value.icon}</div>
                        <div id = "title">{value.title}</div>
                    </li>
                );
            })}
            <button 
            className='row'
            onClick={() => auth.signOut()}>
                <div id = "icon">{<ExitToAppIcon />}</div>
                <div id = "title" className='text-left'>サインアウト</div>
            </button>
        </ul>
    </div>
  )
}

export default Sidebar