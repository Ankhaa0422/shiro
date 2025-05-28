/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Image from "next/image";
import bg2 from '../../public/bg2.png'
import bg from '../../public/bg.png'
import sienna from '../../public/Sienna_free.webp'
import { useEffect, useState, useRef } from "react";
import { get_home_data, get_list } from "@/server-action";
import { useSetState } from "@mantine/hooks";
import { Loader, Card } from "@/components";
import { isNullOrUndefined } from "@/utility";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
export default function Home() {
    const { isLoggedIn, login } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if(isLoggedIn) {
            router.push('/asura') 
        }
    }, [ isLoggedIn ])

    // const [isLoad, setIsLoad] = useState(true)
    // const [homeData, setHomeData] = useSetState({
    //     complete_list: [],
    //     popular_list: [],
    //     latest_list: []
    // })
    // const popularRef = useRef(null)
    // const completeRef = useRef(null)

    // useEffect(() => {
    //     get_data()
    // }, [])

    // async function get_data() {
    //     try {
    //         setIsLoad(true)
    //         let res = await get_home_data()
    //         let latest = await get_list('/latest-release-novel')
    //         if(!isNullOrUndefined(res) && res['status'] === 200) {
    //             setHomeData({
    //                 complete_list: res['complete_list'],
    //                 popular_list: res['popular_list']
    //             })
    //         }
    //         if(!isNullOrUndefined(latest) && latest['status'] === 200) {
    //             setHomeData({
    //                 latest_list: latest['novel_list']
    //             })
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     } finally {
    //         setIsLoad(false)
    //     }
    // }

    console.log(process.env.password);

    function onKeyDown(e) {
        if (e.keyCode === 13) { 
            const encryptedValue = btoa(e.target.value);
            login(encryptedValue);
        }
    }

    function handleLogin() {
        const password = document.querySelector('input[type="password"]').value;
        if (password) {
            const encryptedValue = btoa(password);
            login(encryptedValue);
        }
    }

    return <div className="flex flex-col gap-2 w-full h-screen items-center justify-center">
        <div className="rounded-2xl w-[300px] h-[350px] bg-white/70 dark:bg-[#313739]/70 relative overflow-hidden p-5 flex flex-col items-center justify-center gap-4 shadow-2xl">
            <div className="min-w-[150px] min-h-[150px] relative rounded-full">
                <Image src={sienna.src} alt="" fill style={{ objectFit: 'cover' }} className="rounded-full" />
            </div>
            <span>Shiro</span>
            <input type="password" onKeyDown={onKeyDown} placeholder="password" className="w-full h-[40px] px-4 rounded-full dark:bg-[#414749] bg-[#e3e3e3] outline-none focus:ring-2 focus:ring-[#e3e3e3]/30 transition-all" />
            <button className="w-full h-[40px] px-4 rounded-full dark:bg-[#414749] bg-[#e3e3e3] outline-none focus:ring-2 focus:ring-[#e3e3e3]/30 transition-all" onClick={handleLogin}>login</button>
        </div>
    </div>
}
// .filter((data, idx) => idx < 7)
// grid grid-cols-7 grid-flow-col 



    // <div className="flex flex-col gap-2 w-full">
    //     <div className="w-full h-[600px] flex flex-col">
    //         <div className="w-full h-[500px] min-h-[500px] max-h-[500px] relative">
    //             {/* <Image src={bg2.src} alt="" fill style={{ objectFit: 'cover' }}/> */}
    //             <div className="bg-gradient-to-t from-[#efefef] dark:from-[#212729] to-transparent dark:to-transparent absolute w-full h-full top-0 left-0 z-30 transition-all"/>
    //         </div>
    //         <div className="absolute bottom-20 w-full flex-col justify-center items-center gap-4 z-40">
    //             <div className="container mx-auto flex flex-col gap-4">
    //                 <h2 className="px-16 font-semibold text-xl">Popular novels</h2>
    //                 <div className="flex flex-row z-40 gap-2 items-center justify-start" ref={popularRef}>
    //                     <motion.div drag='x' dragConstraints={popularRef} className="w-fit h-fit flex flex-row gap-2 overflow-x-visible scrollbar-hide">
    //                         {
    //                             homeData['popular_list'].map((data, idx) => {
    //                                 return <Card key={idx} data={data} />
    //                             })
    //                         }
    //                     </motion.div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    //     <div className="container mx-auto flex flex-col gap-4">
    //         <h2 className="px-16 font-semibold text-xl">Completed novels</h2>
    //         <div className="flex flex-row z-40 gap-2 items-center justify-start" ref={completeRef}>
    //             <motion.div drag='x' dragConstraints={completeRef} className="w-fit h-fit flex flex-row gap-2 overflow-x-visible scrollbar-hide">
    //                 {
    //                     homeData['complete_list'].map((data, idx) => {
    //                         return <Card key={idx} data={data} />
    //                     })
    //                 }
    //             </motion.div>
    //         </div>
    //         <h2 className="px-16 font-semibold text-xl">Latest novels</h2>
    //         <div className="grid grid-cols-7 grid-flow-row z-40 gap-2 items-center justify-start">
    //             {
    //                 homeData['latest_list'].map((data, idx) => {
    //                     return <Card key={idx} data={data} width={'full'}/>
    //                 })
    //             }
    //         </div>
    //     </div>
    // </div>