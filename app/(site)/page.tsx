"use client";

import Login from "@/components/Login";
import ScheduleNotification from "../calendar/ScheduleNotification";

export default function Home() {
 
  return (
    <div className="">
      <div>
            <Login />
            <ScheduleNotification />
      </div>
    </div>
    
    );
}
