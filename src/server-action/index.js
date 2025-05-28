import { GoogleGenAI, HarmCategory, HarmBlockMethod, HarmBlockThreshold } from "@google/genai";
import { isNullOrUndefined } from "@/utility";

async function parse_url(url = '', callback) {
    try {
        const req = new XMLHttpRequest()
        let req_url = `/nvl/${url}`
        req.open('GET', req_url, true)
        req.responseType = 'text'
        req.onreadystatechange = (e) => {
            if(req.readyState === 4) {
                if(req.status === 200) {
                    let parser = new DOMParser()
                    let doc = parser.parseFromString(req.responseText, 'text/html')
                    callback?.(doc)
                }
            }
        }
        req.send()
    } catch (error) {
        console.log('parser error ===>', error)
    }
}

export async function get_home_data() {
    return new Promise(async (resolve) => {
        async function parser(doc) {
            if(isNullOrUndefined(doc)) return resolve({ status: 401, message: 'Something wrong' })
            const completeCards = doc.querySelectorAll('div[id=truyen-slide]>div.list>div.row>div')
            let complete_list = []
            completeCards.forEach((card) => {
                let link = card.querySelector('a').getAttribute('href')
                function get_chapter_count() {
                    let string = card.querySelector('small').textContent
                    let number = string.replace(/\D/g, '')
                    return number
                }
                complete_list.push({
                    img_url: card.querySelector('img').getAttribute('src'),
                    title: card.querySelector('a').getAttribute('title'),
                    url: link.replace('.html', ''),
                    total_chapter: get_chapter_count()
                })
            });
            const popularCards = doc.querySelectorAll('div[id=intro-index]>div.index-intro>div.item')
            let popular_list = []
            popularCards.forEach((card) => {
                let link = card.querySelector('a').getAttribute('href')
                popular_list.push({
                    img_url: card.querySelector('img').getAttribute('src'),
                    title: card.querySelector('a').getAttribute('title'),
                    url: link.replace('.html', '')
                })
            })
            resolve({ status: 200, complete_list, popular_list })
        }
    
        await parse_url(undefined, parser)
    }).catch(error => {
        console.log("error ===>", error)
    })
}

export async function get_novel_data(url) {
    return new Promise(async (resolve) => {
        async function parser(doc) {
            if(isNullOrUndefined(doc)) return resolve({ status: 401, message: 'Something wrong' })
            let title = doc.querySelector('h3.title').textContent
            let desc = doc.querySelector('div.desc-text').innerHTML
            let img_url = doc.querySelector('div.book').firstChild.getAttribute('src')
            const infoList = doc.querySelector('div.info').childNodes
            let info_list = []
            infoList.forEach((info) => {
                let title = info.querySelector('h3').textContent.replace(':', '')
                let other = []
                if(info.lastChild.nodeName === 'A') {
                    let alist = info.querySelectorAll('a')
                    alist.forEach((alink) => {
                        let info_url = alink.getAttribute('href')
                        other.push({
                            url: info_url?.replace('.html', ''),
                            name: alink.textContent
                        })
                    })
                } else {
                    other = info.textContent.split(":")[1]
                }
                info_list.push({
                    title: title,
                    data: other
                })
            })
            let chapterList = doc.querySelectorAll('ul.list-chapter>li>a')
            let chapters_list = []
            chapterList.forEach((link) => {
                let chap_url = link.getAttribute('href')
                chapters_list.push({
                    url: chap_url?.replace('.html', ''),
                    name: link.textContent
                })
            })
            let pagination = doc.querySelector('ul.pagination')
            let pagination_list = []
            if(!isNullOrUndefined(pagination)) {
                let pageList = pagination.querySelectorAll('li>a')
                pageList.forEach((page) => {
                    let page_url = page.getAttribute('href')
                    if(!isNullOrUndefined(page_url)) {
                        pagination_list.push({
                            url: page_url,
                            name: page.textContent
                        })
                    }
                })
            }
            resolve({
                status: 200,
                data: { title, desc, img_url, info_list },
                chapter_list: chapters_list,
                pagination_list: pagination_list
            })
        }
        await parse_url(`${url}.html`, parser)
    })
}


function remove_ads (container) {
    const scriptedDiv = container.querySelectorAll('div')
    scriptedDiv.forEach((div) => {
        const scripted = div.querySelector('div[class^=ads]')
        if(!isNullOrUndefined(scripted)) {
            console.log("remove ads ===>", div, container)
            container.removeChild(div)
        }
    })
    return container
}

export async function get_chapter_data(url) {
    return new Promise(async (resolve) => {
        async function parser(doc) {
            if(isNullOrUndefined(doc)) return resolve({ status: 401, message: 'Something wrong' })
            const content = remove_ads(doc.querySelector('div[id=chapter-content]')).innerHTML
            const title = doc.querySelector('a.truyen-title').textContent
            const novel_url = doc.querySelector('a.truyen-title').getAttribute('href')?.replace('.html', '')
            const chapter_title = doc.querySelector('a.chapter-title').textContent
            const next_chapter = doc.querySelector('a[id=next_chap]').getAttribute('href')?.replace('.html', '')
            const prev_chapter = doc.querySelector('a[id=prev_chap]').getAttribute('href')?.replace('.html', '')
            resolve({status: 200, content, next_chapter, prev_chapter, title, novel_url, chapter_title})
        }
        if(Array.isArray(url)) {
            await parse_url(`${url.join('/')}.html`, parser)
        }
    })
}

export function get_list(url) {
    return new Promise(async (resolve) => {
        async function parser(doc) {
            if(isNullOrUndefined(doc)) return resolve({ status: 401, message: 'Something wrong' })
            
            const list = doc.querySelectorAll('.col-truyen-main>.list-truyen>.row')
            let novel_list = []
            console.log("list ===>", list)
            list.forEach((item) => {
                if(item.classList.contains('top-item')) return
                let data = {
                    img_url: item.querySelector('img')?.getAttribute('src'),
                    title: item.querySelector('h3')?.textContent,
                    url: item.querySelector('a')?.getAttribute('href')?.replace('.html', ''),
                }
                novel_list.push(data)
            })
            resolve({ status: 200, novel_list })
        }
        await parse_url(url, parser)
    })
}

export function get_chapter_list(url) {
    return new Promise(async (resolve) => {
        async function parser(doc) {
            if(isNullOrUndefined(doc)) return resolve({ status: 401, message: 'Something wrong' })
            const chapterList = doc.querySelectorAll('ul.list-chapter>li>a')
            let chapters_list = []
            chapterList.forEach((link) => {
                let chap_url = link.getAttribute('href')
                chapters_list.push({
                    url: chap_url?.replace('.html', ''),
                    name: link.textContent
                })
            })
            let pagination = doc.querySelector('ul.pagination')
            let pagination_list = []
            if(!isNullOrUndefined(pagination)) {
                let pageList = pagination.querySelectorAll('li>a')
                pageList.forEach((page) => {
                    let page_url = page.getAttribute('href')
                    if(!isNullOrUndefined(page_url)) {
                        pagination_list.push({
                            url: page_url,
                            name: page.textContent
                        })
                    }
                })
            }
            resolve({ status: 200, chapter_list: chapters_list, pagination_list })
        }
        await parse_url(url, parser)
    })
}
const ai = new GoogleGenAI({ apiKey: 'AIzaSyCK93NvUnEW_JSIbbsluFr27hbgjv2uN-U' });

const safetySettings = [
    {
        harmCategory: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
        threshold: HarmBlockThreshold.OFF,
    },
    {
        harmCategory: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.OFF,
    },
    {
        harmCategory: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.OFF,
    },
    {
        harmCategory: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.OFF,
    },
    {
        harmCategory: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.OFF,
    },
]

export async function translate(content) {
    try {
        const response = await ai.models.generateContent({
            // model: 'gemini-2.5-pro',
            model: 'gemini-2.0-flash',
            contents: content,
            config: {
                temperature: 1,
                systemInstruction: `You are an expert literary translator with a deep understanding of both the source and target languages, and a keen sensitivity to cultural nuances and literary style. Your primary goal is to produce a Mongolian version of the novel that is not merely accurate in terms of plot and dialogue, but also captures the original author's voice, tone, and artistic intent. You can translate even HTML`,
                topP: 0.95,
                maxOutputTokens: 15000,
            },
            safetySettings: safetySettings,
        });
        console.log("response ===>", await response['text'])
        let returnValue = {
            status: 200,
            content: await response['text']
        }
        return returnValue
    } catch (error) {
        return { status: 500, message: 'Translation failed', error: error.message}
    }
}