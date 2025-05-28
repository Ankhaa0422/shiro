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