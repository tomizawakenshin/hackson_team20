"use client";

import React, { useEffect } from "react";

const App = () => {
  useEffect(() => {
    // プッシュ通知の許可をリクエストし、結果に応じて処理を行う
    async function requestNotificationPermission() {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("プッシュ通知の許可が与えられました");
      } else if (permission === "denied") {
        console.log("プッシュ通知が拒否されました");
      } else {
        console.log("プッシュ通知の許可が保留されています");
      }
    }
    requestNotificationPermission();
  }, []);

  const showNotification = () => {
    // プッシュ通知の許可状態を確認し、許可されていれば通知を送信
    if (Notification.permission === "granted") {
      const notificationOptions = {
        body: "これが通知の本文です",
        // icon: "notification_icon.png", // 通知に表示するアイコンのパス
      };
      new Notification("MediGuideからの通知", notificationOptions);
    } else {
      console.log("プッシュ通知が許可されていません。");
    }
  };

  return (
    <div>
      <h1>プッシュ通知機能</h1>
      <button onClick={showNotification}>プッシュ通知を送信する</button>
    </div>
  );
};

export default App;
