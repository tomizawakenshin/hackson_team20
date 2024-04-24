import React from 'react'
import { useAuthState } from "react-firebase-hooks/auth"
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from './firebase'
import Sidebar from './Sidebar'
import { TutorialData } from './FrontEndData'
import Image from "next/image"

const Login = () => {
    const [user] = useAuthState(auth);
  return (
    <div>
        {user ? (
            <div className='flex'>
                <div className='Sidebar'>
                    <Sidebar />
                </div>
                <div className = 'w-full h-full'>
                        <main className='grow'>
                            <section className='container mx-auto'>
                                <h2 className='my-16 text-6xl font-bold text-center'>
                                   <span>MediNav</span>へようこそ！
                                </h2>
                                <div className='my-16 text-center text-3xl'>
                                    <div className='py-5'>
                                        このwebアプリは長期的な診察を必要とする人々を
                                    </div>
                                    <div className='py-5'>
                                        サポートするために開発されました。
                                    </div>
                                    <div className='pt-60'>
                                        このwebアプリではこんな機能が使用できます！
                                    </div>
                                </div>
                                <div className='flex'>
                                    {TutorialData.map((value, key) =>{
                                        return(
                                            <div key ={key} className=''>
                                                <div className='font-bold px-14 text-lg'>
                                                    {value.description}
                                                </div>
                                                <Image src = {value.img} width = "100" height="100" alt=""/>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>
                        </main>
                </div>
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