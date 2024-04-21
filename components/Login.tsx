import React from 'react'
import { useAuthState } from "react-firebase-hooks/auth"
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from './firebase'
import Sidebar from './Sidebar'

const Login = () => {
    const [user] = useAuthState(auth);
  return (
    <div>
        {user ? (
            <div className='gap-4'>
                <div className='Sidebar'>
                    <Sidebar />
                </div>
                <p className='
                text-center
                text-9xl
                '>ここにホーム情報を記述</p>
            </div>
        ) : (
            <div className='signInScreen'>
                <SignInButton />
            </div>
        )}
    </div>
  )
}

function SignInButton() {
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider);
    }
  return (
    <button 
        onClick={signInWithGoogle}
        className='
            pt-14
            lounded-lg
            items-center
            flex'>
        <p className='
            text-3xl
            font-bold
            cursor-pointer
            bg-orange-300
            text-white
            p-7
            rounded-full
            shadow-2xl
            '>
            グーグルでサインイン
        </p>
    </button>
  )
}

export default Login