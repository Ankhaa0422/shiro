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

export function connectIDB(tableName) {
    try {
        const request = indexedDB.open(dbName, 1)

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

export async function getNextChapter() {
    let req = await connectIDB('content')
    return new Promise(resolve => {
        req.onsuccess = function (e) {
            const db = req.result
            const trans = db.transaction('content', 'readonly')
            const ctx = trans.objectStore('content')
            const get_request = ctx.get('nextChapter')
            get_request.onsuccess = e => {
                resolve(get_request.result)
            }
        }
    }).catch(e => {
        console.log(e)
    })
}

export async function setNextChapter(chap) {
    const isHaveNextChapter = await getNextChapter()
    let req = connectIDB('content')
    return new Promise(resolve => {
        req.onsuccess = () => {
            const db = req.result
            const trans = db.transaction('content', 'readwrite')
            const ctx = trans.objectStore('content')
            if(isHaveNextChapter) {
                const update_request = ctx.put(chap, 'nextChapter')
                update_request.onsuccess = () => {
                    resolve({ message: 'update success', success: true })
                }
            } else {
                const add_request = ctx.add(chap, 'nextChapter')
                add_request.onsuccess = (e) => {
                    resolve({ message: 'add success', success: true })
                }
            }
        }
    }).catch(e => {
        console.log(e)
    })
}

export async function tailangiinZagvarKhadgalya(zagvar, callbacks, tableName = 'tailangiinZagvar', drillEsekh = false, systemiinTokhirgooEsekh = false) {
    const { onSuccess, onError } = callbacks || {}
    const oldDataBaigaaEsekh = await tailangiinZagvarAvya(zagvar, undefined, undefined, drillEsekh)
        let req = await indexedDBKholbogdyo(tableName);
        req.onsuccess = (e) => {
            const db = req.result
            const trans = db.transaction(tableName, 'readwrite')
            const ctx = trans.objectStore(tableName)
            if(oldDataBaigaaEsekh) {
                const updateRequest = ctx.put(zagvar, indexedDbKeyUgsarya(zagvar, drillEsekh))
                updateRequest.onsuccess= (e) => {
                    console.log('Zagvariig amjilttai shinechillee')
                }
            } else {
                const addRequest = ctx.add(zagvar, indexedDbKeyUgsarya(zagvar, drillEsekh))
                addRequest.onsuccess = (e) => {
                    onSuccess?.()
                }
            }
            
        };
    
}