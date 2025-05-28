'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { get_novel_data, get_chapter_list } from '@/server-action'
import { useLocalStorage } from '@mantine/hooks'

export default function page() {

    const { isLoggedIn, login } = useAuth()
    const router = useRouter()
    const [ data, setData ] = useState(undefined)
    const [ chapters, setChapters ] = useState([])
    const [ paginations, setPaginations ] = useState([])
    const [latest, setLatest] = useLocalStorage({
        key: 'latest',
        defaultValue: {},
    })
    useEffect(() => {
        async function getData() {
            const response = await get_novel_data('/martial-god-asura')
            console.log("data ===>", response)
            if(response['status'] === 200) {
                setData(response.data)
                setChapters(response.chapter_list)
                setPaginations(response.pagination_list)
            }
        }
        getData()
    }, [])
    console.log('/asura page isLoggedIn ===>', isLoggedIn)

    async function routeChapterList(url) {
        const response = await get_chapter_list(url)
        console.log("chapter list response ===>", response, url)
        if(response['status'] === 200) {
            setChapters(response.chapter_list)
            setPaginations(response.pagination_list)
        }
    }

    function routeChapter(url) {
        console.log(url)
        router.push(`/read/${url.replaceAll('.html', '')}`)
    }

    return <section className='flex flex-col md:flex-row w-full h-fit container mx-auto px-10 gap-3 py-[75px]'>
        <div className='w-full md:w-[250px] md:min-w-[250px] h-fit flex flex-col gap-2 relative md:sticky md:top-[75px]'>
            <img src={`/nvl/${data?.img_url}`} style={{objectFit: 'cover', width: '100%', height: 'auto'}} alt="" className='rounded'/>
            <div className='flex flex-col gap-2 px-1'>
                {
                    data?.info_list.map((data, idx) => {
                        return <div key={`info-${idx}`} className='text-[0.85rem] flex gap-1 flex-wrap border-b border-b-[#414749] items-center'>
                            <span className='font-semibold'>
                                {data.title}:
                            </span>
                            {
                                Array.isArray(data.data) ?
                                    <>
                                        {
                                            data.data.map((nestData, index) => {
                                                return <span key={`nested-${index}`} className='cursor-pointer hover:underline'>{nestData.name}{index !== data.data.length - 1 && ','} </span>
                                            })
                                        }  
                                    </>
                                : <span className='py-1'>
                                    {`${data.data}`}
                                </span>
                            }
                        </div>
                    })
                }
            </div>
        </div>
        <div className='w-full flex flex-col h-fit gap-2'>
            <h2 className='font-semibold text-2xl border-b border-b-[#313739] py-1'>{data?.title}</h2>
            <div id='desc' dangerouslySetInnerHTML={{__html: data?.desc}} className='flex flex-col gap-2 text-sm'/>
            <div className='w-full h-fit flex flex-col items-center justify-start gap-2 px-5 my-5 text-[0.8rem]'>
                <div className='cursor-pointer hover:underline p-2 px-3 rounded-xl bg-[#313739]/70 w-full' onClick={() => routeChapterList(latest['url'])}>
                    {latest['title']}
                </div>
            </div>
            <div className='hidden md:flex flex-row gap-2 text-[0.8rem]'>
                <div className='flex flex-col bg-white dark:bg-[#313739] rounded-xl p-2 w-1/2'>
                    {
                        chapters.filter((data, idx) => idx < 25).map((chap, idx) => {
                            return <div key={`chapter-${idx}`} className='w-full border-b-2 border-b-gray-200 hover:bg-cyan-50 dark:border-b-[#212729] cursor-pointer dark:hover:bg-[#21272980] py-1 px-2' onClick={() => routeChapter(chap.url)}>
                                {chap.name}
                            </div>
                        })
                    }
                </div>
                <div className='flex flex-col bg-white dark:bg-[#313739] rounded-xl p-2 w-1/2'>
                    {
                        chapters.filter((data, idx) => idx > 24).map((chap, idx) => {
                            return <div key={`chapter-${idx}`} className='w-full border-b-2 border-b-gray-200 hover:bg-cyan-50 dark:border-b-[#212729] cursor-pointer dark:hover:bg-[#21272980] py-1 px-2 overflow-hidden' onClick={() => routeChapter(chap.url)}>
                                <span className='overflow-hidden text-ellipsis whitespace-nowrap'>{chap.name}</span>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className='flex md:hidden flex-col bg-white dark:bg-[#313739] rounded-xl p-2 w-1/2'>
                {
                    chapters.map((chap, idx) => {
                        return <div key={`chapter-${idx}`} className='w-full border-b-2 border-b-gray-200 hover:bg-cyan-50 dark:border-b-[#212729] cursor-pointer dark:hover:bg-[#21272980] py-1 px-2 overflow-hidden' onClick={() => routeChapter(chap.url)}>
                            <span className='overflow-hidden text-ellipsis whitespace-nowrap'>{chap.name}</span>
                        </div>
                    })
                }
            </div>
            <div className='w-full h-fit flex flex-row items-center justify-center gap-2 px-5 text-[0.8rem]'>
                {
                    paginations.map((page, idx) => {
                        return <div key={`pagination-${idx}`} className='cursor-pointer hover:underline p-2 px-3 rounded-xl bg-[#313739]/70' onClick={() => routeChapterList(page['url'])}>
                            {page.name}
                        </div>
                    })
                }
            </div>
        </div>
    </section>
}
