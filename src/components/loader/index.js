import React from 'react'

export default function Loader({ className = '' }) {
    return <div className={`w-full h-full fixed top-0 left-0 z-[9999] bg-[#efefef] dark:bg-[#212729] flex flex-row items-center justify-center ${className}`}>
        <div className='w-[100px] h-[100px] text-[#A8B4E3]'>
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" style={{ enableBackground: 'new 0 0 1000 1000' }} xmlSpace="preserve">
                <circle className="st3067" cx="500" cy="500" r="160"/>
                <circle className="st3067 st3067--small rounded" cx="500" cy="500" r="160" transform="rotate(0 500 500)">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500" dur="5s" repeatCount="indefinite"/>
                </circle>
                <circle className="st3067 st3067--transparent" cx="500" cy="500" r="240"/>
                <circle className="st3067 st3067--medium rounded" cx="500" cy="500" r="240" transform="rotate(0 500 500)">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500" dur="4s" repeatCount="indefinite"/>
                </circle>
                <circle className="st3067" cx="500" cy="500" r="320"/>
                <circle className="st3067 st3067--three rounded" cx="500" cy="500" r="320" transform="rotate(0 500 500)">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle className="st3067" cx="500" cy="500" r="400"/>
                <circle className="st3067 st3067--large rounded" cx="500" cy="500" r="400" transform="rotate(0 500 500)">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500" dur="5s" repeatCount="indefinite"/>
                </circle>
                <circle className="st3067" cx="500" cy="500" r="480"/>
                <circle className="st3067 st3067--xlarge rounded" cx="500" cy="500" r="480" transform="rotate(0 500 500)">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500" dur="5s" repeatCount="indefinite"/>
                </circle>
            </svg>
        </div>
    </div>
}
