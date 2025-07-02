import { isNullOrUndefined } from "@/utility"

async function parse_url(url = '', callback) {
    try {
        const req = new XMLHttpRequest()
        let req_url = `/fwn/${url}`
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

export async function get_fwn_novel(url) {
    return new Promise(async (resolve) => {
        async function parser(doc) {
            if(isNullOrUndefined(doc)) return resolve({ status: 401, message: 'Something wrong' })
                console.log("doc ===>", doc)
            let title = doc.querySelector('h1.tit').textContent
            let desc = doc.querySelector("div.m-desc>div.txt").innerHTML
            let img_url = doc.querySelector("div.m-book1>div.m-imgtxt>div.pic>img").src
            const infoList = doc.querySelectorAll("div.m-book1>div.m-imgtxt>div.txt>div.item")
            let info_list = []
            infoList.forEach((info) => {
                info_list.push({
                    title: '',
                    data: info.textContent
                })
            })
            let chapterList = doc.querySelectorAll("div.m-newest2>ul>li>a")
            let chapters_list = []
            chapterList.forEach((link) => {
                let chap_url = link.getAttribute('href')
                chapters_list.push({
                    url: chap_url,
                    name: link.textContent
                })
            })
            resolve({
                status: 200,
                data: { title, desc, img_url, info_list },
                chapter_list: chapters_list,
                // pagination_list: pagination_list
            })
        }
        await parse_url(url, parser)
    })
}


function remove_ads (container) {
    const scriptedDiv = container.querySelectorAll('div')
    scriptedDiv.forEach((div) => {
        if (container.contains(div)) {
            container.removeChild(div);
        }
    })
    return container
}

export async function get_chapter_fwn(url) {
    return new Promise(async (resolve) => {
        async function parser(doc) {
            if(isNullOrUndefined(doc)) return resolve({ status: 401, message: 'Something wrong' })
            console.log(doc)
            const content = remove_ads(doc.getElementById('article')).innerHTML
            const title = doc.querySelector('span.chapter').textContent
            const next_chapter = doc.querySelector('a[id=next_url]').getAttribute('href')
            const prev_chapter = doc.querySelector('a[id=prev_url]').getAttribute('href')
            const novel_url = undefined
            const chapter_title = doc.querySelector('span.chapter').textContent
            resolve({status: 200, content, next_chapter, prev_chapter, title, novel_url, chapter_title})
        }
        if(Array.isArray(url)) {
            console.log("url ===>", url, `${url.join('/')}.html`)
            await parse_url(`${url.join('/')}`, parser)
        }
    })
}