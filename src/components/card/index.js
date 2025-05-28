/* eslint-disable @next/next/no-img-element */
'use client'
import { calculateHeight, isNullOrUndefined, useAutoCardSize } from "@/utility"
import Image from "next/image"
import { useCallback, useRef } from "react"

export default function Card({ data, width = 164 }) {

    const cardRef = useRef(null)
    useAutoCardSize(data.url, cardRef, data.img_url)
    return <figure ref={cardRef} className='group relative rounded cursor-pointer overflow-hidden hover:shadow-xl transition-all' style={{ minWidth: width, maxWidth: width }}>
        {/* <div style={{ zIndex: -1, backgroundImage: `url(/nvl${data.img_url})` }} className='absolute w-full h-full left-0 top-0 group-hover:blur-[7.5px] group-hover:saturate-[2] transition-all rounded'/> */}
        <Image src={`/nvl${data.img_url}`} alt={`${data.title}`} className='object-cover w-full h-auto rounded hover:shadow transition-all' fill />
        <figcaption className="w-full absolute h-full flex items-end justify-center text-[0.8rem] p-1 group-hover:bg-opacity-40 transition-all top-0 left-0" style={{zIndex: 10}}>
            <div className='bg-[#414749aa] p-1 rounded h-[45px] min-h-[45px] w-full bg-opacity-60 backdrop-blur transition-all flex items-center justify-center'>
                <span className="line-clamp-2 overflow-hidden group-hover:underline text-[#e3e3e3] transition-all">
                    {data.title}
                </span>
            </div>
        </figcaption>
    </figure>
}