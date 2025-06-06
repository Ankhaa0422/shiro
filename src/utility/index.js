'use client'
import { useLayoutEffect } from "react"

export const imageConst = { WIDTH: 300, HEIGHT: 450 }

export function isNullOrUndefined(data) {
    return data === undefined || data === null
}

export function showLoader(isShow = false) {
    if(isShow) {
        const loaderDiv = document.createElement('div')
        loaderDiv.className = 'bg-[#efefef] dark:bg-[#212729] w-full h-full fixed top-0 left-0 z-[9999]'
        loaderDiv.id = 'shiro-loader'
        document.body.classList.add('overflow-hidden')
        document.body.appendChild(loaderDiv)
    } else {
        const loaderDiv = document.getElementById('shiro-loader')
        if(!isNullOrUndefined(loaderDiv)) {
            document.body.classList.remove('overflow-hidden')
            document.body.removeChild(loaderDiv)
        }
    }
}

export const calculateHeight = (width) => {
    const ratio = imageConst['WIDTH'] / imageConst['HEIGHT']
    return width / ratio
}

export function useAutoCardSize (id, cardRef, val) {
    useLayoutEffect(() => {
        if(!isNullOrUndefined(cardRef.current)) {
            const width = cardRef.current['clientWidth']
            const height = calculateHeight(width)
            cardRef.current.style.height = `${height}px`
            cardRef.current.style.minHeight = `${height}px`
            cardRef.current.style.maxHeight = `${height}px`
        }
    }, [id, cardRef, val])
}

export async function callFetch(api, param, type = 'POST') {
    try {
        const res = await fetch(api, {
            method: type,
            body: typeof param === 'string' ? param : JSON.stringify(param)
        })
        console.log("res ===>", res)
        const jsonRes = await res.json()
        console.log("jsonRes ===>", jsonRes)
        return jsonRes
    } catch (error) {

    }
}

export function connectIDB(tableNames = ['content']) {
    try {
        const request = indexedDB.open('content', 1)

        request.onerror = (error) => {
            console.error("error =====>", error)
        }

        request.onupgradeneeded = (event) => {
            let db = request.result
            tableNames.forEach(table => {
                if(!db.objectStoreNames.contains(table)) {
                    const objectStore = db.createObjectStore(table)
                }
            })
        }

        return request
    } catch (error) {
        console.log(error)
    }
}

export async function getChapter(key = 'nextChapter') {
    let req = await connectIDB()
    return new Promise(resolve => {
        req.onsuccess = function (e) {
            const db = req.result
            const trans = db.transaction('content', 'readonly')
            const ctx = trans.objectStore('content')
            const get_request = ctx.get(key)
            get_request.onsuccess = e => {
                resolve(get_request.result)
            }
        }
    }).catch(e => {
        console.log(e)
    })
}

export async function setChapter(chap, key = 'nextChapter') {
    const isHaveNextChapter = await getChapter(key)
    let req = connectIDB()
    return new Promise(resolve => {
        req.onsuccess = () => {
            const db = req.result
            const trans = db.transaction('content', 'readwrite')
            const ctx = trans.objectStore('content')
            if(isHaveNextChapter) {
                const update_request = ctx.put(chap, key)
                update_request.onsuccess = () => {
                    resolve({ message: 'update success', success: true })
                }
            } else {
                const add_request = ctx.add(chap, key)
                add_request.onsuccess = (e) => {
                    resolve({ message: 'add success', success: true })
                }
            }
        }
    }).catch(e => {
        console.log(e)
    })
}