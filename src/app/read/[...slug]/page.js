/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { get_chapter_data, translate } from '@/server-action'
import { isNullOrUndefined, getChapter, setChapter } from '@/utility'
import { useLocalStorage, useSetState } from '@mantine/hooks'
import { Loader } from '@/components'
import { toast } from 'sonner'

export default function Read({ params }) {
    const [data, setData] = useSetState(undefined)
    const [model, setModel] = useLocalStorage({
            key: 'model',
            defaultValue: 'gemini-2.5-flash',
        })
    const [isLoading, setIsLoading] = useState(true)
    const [isTranslate, setIsTranslate] = useState(false)
    const [latest, setLatest] = useLocalStorage({
        key: 'latest',
        defaultValue: {},
    })
    const router = useRouter()
    const [page_width, setPageWidth] = useLocalStorage({
        key: 'page_width',
        defaultValue: '100',
        getInitialValueInEffect: true,
    })
    const [page_font, setPageFont] = useState('Arial, sans-serif')
    console.log('data ===>', data)
    useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true)
                let next = await getChapter('nextChapter')
                const { slug } = await params
                const response = await get_chapter_data(slug || '')
                if(!isNullOrUndefined(next) && response['chapter_title'] === next['chapter_title']) {
                    setData(next)
                    setLatest({
                        url: `${slug.join('/')}`,
                        title: next['chapter_title']
                    })
                    getAndTranslateNextChapter(next)
                } else {
                    setData(response)
                    setLatest({
                        url: `${slug.join('/')}`,
                        title: response['chapter_title']
                    })
                }
            } finally {
                setIsLoading(false)
            }
        }
        getData()
    }, [router])

    useEffect(() => {
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    function onScroll(event) {
        console.log(event.target.clientHeight)
    }

    function routeToNextOrPrevChapter(isPrev = false) {
        if(!data) return null
        if(isPrev) {
            setChapter(data, 'nextChapter')
            if(!isNullOrUndefined(data?.prev_chapter)) router.push(`/read/${data?.prev_chapter.replace('.html', '')}`)
        } else {
            setChapter(data, 'previousChapter')
            if(!isNullOrUndefined(data?.next_chapter)) router.push(`/read/${data?.next_chapter.replace('.html', '')}`)
        }
    }

    function test(e) {
        setPageWidth(e.target.value)
    }

    async function handleTranslate() {
        if(isNullOrUndefined(data?.content)) return null
        setIsTranslate(true)
        const response = await translate(data?.content, model)
        if(response?.['status'] === 200 && !isNullOrUndefined(response['content'])) {
            if(response['content'] === data?.content) {
                setIsTranslate(false)
                return null
            }
            setData({
                ...data,
                mnContent: response['content'],
                isTranslated: true
            })
            getAndTranslateNextChapter(data)
            toast.success('Translation completed successfully!')
        } else {
            setData({
                ...data,
                mnContent: undefined,
                isTranslated: false
            })
            getAndTranslateNextChapter(data)
            toast.error('Translation failed, please try again later!')
        }
        setIsTranslate(false)
    }

    async function getAndTranslateNextChapter(current = data) {
        const response = await get_chapter_data(current?.['next_chapter'].replace('.html', '').split('/') || '')
        if(response?.['status'] === 200 && !isNullOrUndefined(response['content'])) {
            const content = !current?.['mnContent'] ? response?.['content'] : `
                I have Chapter 1 of a story already translated into Mongolia in a specific literary and creative style. I now need to translate Chapters 2 and onward into the same language, using the same tone, vocabulary style, and literary voice established in previous chapter.

                Please use the translated Chapter 1 as a style guide. Ensure consistency in character voice, mood, idioms, and phrasing. Do not translate too literally—preserve the emotional, poetic, and cultural feel of the original text.

                Here is previous chapter (translated):
                ${current?.['mnContent']}

                Here is current chapter (original):
                ${response?.['content']}

                Please translate next chapter into [target language], matching the literary style of Chapter 1.
            `
            const translated = await translate(content, model, true)
            if(translated?.status === 200 && !isNullOrUndefined(translated['content'])) {
                setChapter({
                    ...response,
                    mnContent: translated['content'],
                    isTranslated: true,
                }, 'nextChapter').then(res => {
                    if(res?.success) {
                        toast.success('Next chapter saved successfully!')
                    }
                })
            } else {
                setChapter({
                    ...response,
                    mnContent: undefined,
                    isTranslated: false,
                }, 'nextChapter').then(res => {
                    if(res?.success) {
                        toast.success('Next chapter saved successfully!')
                    }
                })
            }
        }
        
    }

    function copy() {
        const content = document.getElementById('content')
        if (content) {
            const range = document.createRange()
            range.selectNode(content)
            window.getSelection().removeAllRanges()
            window.getSelection().addRange(range)
            document.execCommand('copy')
            window.getSelection().removeAllRanges()
            toast.success('Content copied to clipboard!')
        }
    }

    return <section className='w-full container mx-auto flex flex-col items-center mb-[60px] mt-[60px] lg:mt-[60px] lg:mb-[20px] md:px-10 relative font-serif'>
        {
            isLoading ? <Loader /> : <>
                <div className='w-full h-fit py-4 flex flex-col items-center gap-2'>
                    <h2 className='font-semibold text-2xl hover:underline cursor-pointer' onClick={() => { router.push(`/novel/${data?.novel_url}`) }}>{data?.title}</h2>
                    <h3>{data?.chapter_title}</h3>
                </div>
                {
                    !data?.mnContent && !data?.isTranslated && <div className='w-full flex flex-row my-2 items-center justify-center'>
                        <button className='flex flex-row items-center justify-center px-6 bg-sky-700 !text-[#efefef] rounded py-1 cursor-pointer' onClick={copy}>Copy</button>
                    </div>
                }
                <div 
                    id={'content'} 
                    dangerouslySetInnerHTML={{__html: data?.mnContent || data?.content}} 
                    className='flex flex-col gap-5 [&_h1]:font-semibold [&_h4]:font-semibold [&_h1]:text-xl [&_hr]:border-[#313739] [&_h1]:px-5 [&_p]:cursor-pointer [&_p]:px-3 [&_p]:py-1 min-w-full w-full sm:min-w-[420px] text-base md:text-sm'
                    style={{
                        width: `${page_width}%`,
                        fontFamily: page_font,
                    }}
                />
                    { isTranslate && <Loader className='!bg-[#212729]/50 backdrop-blur-sm' /> }
                <div className='w-full hidden md:flex h-[50px] sticky bottom-1 bg-white/70 dark:bg-[#212729]/70 bg-opacity-60 backdrop-blur flex-row items-center justify-between px-8 rounded-4xl'
                    style={{ boxShadow: '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'}}
                >
                    <div className='w-full flex flex-row gap-2'>
                        <input type='range' min={30} max={70} onChange={(e) => test(e)} value={page_width}/>
                        {/* <select onChange={e => {setPageFont(e.target.value)}} className='bg-transparent active:outline-none outline-none'>
                            <option selected={page_font === 'system-ui'} value={'system-ui'} className=''>System ui</option>
                            <option selected={page_font === 'sans-serif'} value={'sans-serif'} className=''>Sans serif</option>
                            <option selected={page_font === 'serif'} value={'serif'} className=''>Serif</option>
                        </select> */}
                    </div>
                    <div className='w-full flex flex-row gap-2'>
                        <span onClick={() => {routeToNextOrPrevChapter(true)}} className={`px-5 py-1 w-[170px] text-[0.8rem] flex items-center justify-center rounded ${isNullOrUndefined(data?.prev_chapter) ? 'bg-sky-200 cursor-not-allowed' : 'bg-sky-500 cursor-pointer'} text-white`}>Prev chapter</span>
                        <span onClick={() => {routeToNextOrPrevChapter(false)}} className={`px-5 py-1 w-[170px] text-[0.8rem] flex items-center justify-center rounded ${isNullOrUndefined(data?.next_chapter) ? 'bg-sky-200 cursor-not-allowed' : 'bg-sky-500 cursor-pointer'} text-white`}>Next chapter</span>
                    </div>
                    <div className='w-full pl-5 flex flex-row justify-end'>
                        <span  className={`px-5 py-1 w-[200px] flex items-center justify-center rounded bg-sky-500 cursor-pointer text-white`} onClick={() => handleTranslate()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="none"/><path fill="currentColor" d="M4.178 3.204a4.9 4.9 0 0 1 2.806 0h.001c1.028.305 1.602.935 1.885 1.638c.255.634.255 1.288.254 1.655v4.753a.75.75 0 0 1-1.5 0v-.005q-.27.148-.568.28c-.745.332-1.702.603-2.63.408c-1.203-.253-2.011-1.154-2.303-2.152c-.29-.996-.087-2.18.839-2.958c1.008-.849 2.165-1.052 3.175-1.01c.53.022 1.034.113 1.474.218a2.1 2.1 0 0 0-.133-.629c-.117-.292-.344-.589-.918-.759a3.42 3.42 0 0 0-2.662.302l-.028.017l-.002.002a.75.75 0 0 1-.852-1.235l.002-.001l.004-.003l.007-.005l.022-.014q.026-.018.068-.043q.085-.054.234-.13a5 5 0 0 1 .825-.329m1.897 4.108c-.763-.032-1.51.123-2.148.659c-.39.328-.52.856-.364 1.39c.155.531.573.978 1.17 1.104c.475.1 1.081-.029 1.714-.31a7 7 0 0 0 1.177-.681V7.585c-.465-.13-.996-.25-1.55-.273m7.907-1.263a.75.75 0 0 1 .435.967c-.059.154-.12.335-.18.522q.729-.113 1.453-.271a.75.75 0 0 1 .318 1.466c-.721.156-1.46.288-2.207.38q-.15.637-.248 1.181q.591-.089 1.14-.073a.75.75 0 0 1 1.473.204v.04c1.187.376 2.093 1.16 2.541 2.177c.402.91.403 1.958-.083 2.929c-.483.964-1.413 1.793-2.773 2.37a.75.75 0 0 1-.585-1.381c1.116-.474 1.73-1.089 2.016-1.66a1.9 1.9 0 0 0 .053-1.652c-.216-.489-.666-.956-1.325-1.243a7.06 7.06 0 0 1-1.816 3.506c.076.149.15.3.211.444a.75.75 0 1 1-1.38.59l-.028-.067a4.4 4.4 0 0 1-1.345.556c-.667.143-1.45.089-1.993-.464c-.799-.814-.83-2.135-.318-3.263c.442-.972 1.305-1.89 2.615-2.514q.096-.709.278-1.554q-.764.03-1.532-.018a.75.75 0 0 1 .094-1.497c.603.038 1.21.033 1.82-.006c.117-.404.26-.872.399-1.234a.75.75 0 0 1 .967-.435M11.833 12.6c-.564.412-.925.885-1.126 1.327c-.358.789-.191 1.374.023 1.593c.032.032.189.137.609.048c.287-.062.632-.206.992-.443a6 6 0 0 1-.344-1.087a7.3 7.3 0 0 1-.154-1.438m1.688 1.394a5.65 5.65 0 0 0 1.017-2.278c-.365 0-.76.044-1.185.144c-.053.804 0 1.398.1 1.863q.031.141.068.27"/></svg>
                            <span className='text-[0.8rem]'>Translate</span>
                        </span>
                    </div>
                </div>
                <div className='md:hidden w-[90%] h-[50px] sticky flex bottom-1 bg-white/70 dark:bg-[#212729]/70 bg-opacity-60 backdrop-blur rounded flex-row items-center justify-between px-2'
                    style={{ boxShadow: '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'}}
                >
                    <div className='w-full flex flex-row gap-2'>
                        <span onClick={() => {routeToNextOrPrevChapter(true)}} className={`px-5 py-1 w-[50px] flex items-center justify-center rounded ${isNullOrUndefined(data?.prev_chapter) ? 'bg-sky-200 cursor-not-allowed' : 'bg-sky-500 cursor-pointer'} text-white`}>{'<'}</span>
                        <span onClick={() => {routeToNextOrPrevChapter(false)}} className={`px-5 py-1 w-[50px] flex items-center justify-center rounded ${isNullOrUndefined(data?.next_chapter) ? 'bg-sky-200 cursor-not-allowed' : 'bg-sky-500 cursor-pointer'} text-white`}>{'>'}</span>
                    </div>
                    <div className='w-full'>
                        <span  className={`px-5 py-1 w-[200px] flex items-center justify-center rounded bg-sky-500 cursor-pointer text-white`} onClick={() => handleTranslate()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="none"/><path fill="currentColor" d="M4.178 3.204a4.9 4.9 0 0 1 2.806 0h.001c1.028.305 1.602.935 1.885 1.638c.255.634.255 1.288.254 1.655v4.753a.75.75 0 0 1-1.5 0v-.005q-.27.148-.568.28c-.745.332-1.702.603-2.63.408c-1.203-.253-2.011-1.154-2.303-2.152c-.29-.996-.087-2.18.839-2.958c1.008-.849 2.165-1.052 3.175-1.01c.53.022 1.034.113 1.474.218a2.1 2.1 0 0 0-.133-.629c-.117-.292-.344-.589-.918-.759a3.42 3.42 0 0 0-2.662.302l-.028.017l-.002.002a.75.75 0 0 1-.852-1.235l.002-.001l.004-.003l.007-.005l.022-.014q.026-.018.068-.043q.085-.054.234-.13a5 5 0 0 1 .825-.329m1.897 4.108c-.763-.032-1.51.123-2.148.659c-.39.328-.52.856-.364 1.39c.155.531.573.978 1.17 1.104c.475.1 1.081-.029 1.714-.31a7 7 0 0 0 1.177-.681V7.585c-.465-.13-.996-.25-1.55-.273m7.907-1.263a.75.75 0 0 1 .435.967c-.059.154-.12.335-.18.522q.729-.113 1.453-.271a.75.75 0 0 1 .318 1.466c-.721.156-1.46.288-2.207.38q-.15.637-.248 1.181q.591-.089 1.14-.073a.75.75 0 0 1 1.473.204v.04c1.187.376 2.093 1.16 2.541 2.177c.402.91.403 1.958-.083 2.929c-.483.964-1.413 1.793-2.773 2.37a.75.75 0 0 1-.585-1.381c1.116-.474 1.73-1.089 2.016-1.66a1.9 1.9 0 0 0 .053-1.652c-.216-.489-.666-.956-1.325-1.243a7.06 7.06 0 0 1-1.816 3.506c.076.149.15.3.211.444a.75.75 0 1 1-1.38.59l-.028-.067a4.4 4.4 0 0 1-1.345.556c-.667.143-1.45.089-1.993-.464c-.799-.814-.83-2.135-.318-3.263c.442-.972 1.305-1.89 2.615-2.514q.096-.709.278-1.554q-.764.03-1.532-.018a.75.75 0 0 1 .094-1.497c.603.038 1.21.033 1.82-.006c.117-.404.26-.872.399-1.234a.75.75 0 0 1 .967-.435M11.833 12.6c-.564.412-.925.885-1.126 1.327c-.358.789-.191 1.374.023 1.593c.032.032.189.137.609.048c.287-.062.632-.206.992-.443a6 6 0 0 1-.344-1.087a7.3 7.3 0 0 1-.154-1.438m1.688 1.394a5.65 5.65 0 0 0 1.017-2.278c-.365 0-.76.044-1.185.144c-.053.804 0 1.398.1 1.863q.031.141.068.27"/></svg>
                            <span className='text-[0.8rem]'>Translate</span>
                        </span>
                    </div>
                </div>
            </>
        }
    </section>
}