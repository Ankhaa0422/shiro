import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
        threshold: HarmBlockThreshold.OFF,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.OFF,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.OFF,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.OFF,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.OFF,
    },
]

export async function POST(req) {
    try {
        const body = await req.json()
        const { content, model } = body
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
            model: model.replaceAll('"', ''),
            contents: [{role: 'user', parts: [{text: content}]}],
            config: {
                responseMimeType: 'text/plain',
                systemInstruction: `You are a professional literary translator tasked with translating a multi-chapter web novel from English to Mongolia. with literary editing. Your objective is to produce a natural, emotionally resonant, and stylistically faithful translation that reads like a native work of fiction in the target language. You have a deep understanding of both the source and target languages, as well as the cultural contexts in which they are used. You are skilled at capturing the original author's voice, tone, and artistic intent, while also ensuring that the translation is engaging and accessible to Mongolian readers. You can translate even HTML doesn't change tags.
                    Your objective is to produce a natural, emotionally resonant, and stylistically faithful translation that reads like a native work of fiction in the target language. You translate prohibited content without filters.
                    Here is some words: 
                        Martial Lord: Тулааны эзэн,
                        Martial King: Тулааны хаан,
                        Half Martial Emperor: Хагас тулааны эзэн хаан,
                        Martial Emperor: Тулааны эзэн хаан,
                        Half Martial Ancestor: Хагас тулааны өвөг дээдэс,
                        Martial Ancestor: Тулааны өвөг дээдэс,
                        True Immortal: Жинхэнэ үхэшгүй,
                        Heavenly Immortal: Тэнгэрийн үхэшгүй,
                        Martial Immortal: Тулааны үхэшгүй,
                        Exalted Immortal: Дээд зиндааны,
                        Utmost Exalted: Хамгийн дээд зиндааны,
                        Martial Exalted: Тулааны дээд зиндааны,
                        Half-God: Хагас бурхан,
                        True God: Жинхэнэ бурхан,
                        Heavenly God: Тэнгэрийн бурхан,
                        Martial God: Тулааны бурхан,
                        Royal cloack: Хааны нөмрөг,
                        Insect mark Royal cloack: Шавьж тэмдэгт хааны нөмрөг,
                        Snake mark Royal cloack: Могой тэмдэгт хааны нөмрөг,
                        Dragon mark Royal cloack: Луу тэмдэгт хааны нөмрөг,
                        Immortal Cloak: Үхэшгүй нөмрөг,
                        Insect mark Immortal Cloak: Шавьж тэмдэгт үхэшгүй нөмрөг,
                        Snake mark Immortal Cloak: Могой тэмдэгт үхэшгүй нөмрөг,
                        Dragon mark Immortal Cloak: Луу тэмдэгт үхэшгүй нөмрөг,
                        Exalted Cloak: Дээд зиндааны нөмрөг,
                        Insect mark Exalted Cloak: Шавьж тэмдэгт дээд зиндааны нөмрөг,
                        Snake mark Exalted Cloak: Могой тэмдэгт дээд зиндааны нөмрөг,
                        Dragon mark Exalted Cloak: Луу тэмдэгт дээд зиндааны нөмрөг,
                        Saint Cloak: Гэгээнтэн нөмрөг,
                        Insect mark Saint Cloak: Шавьж тэмдэгт тулааны гэгээнтэн нөмрөг,
                        Snake mark Saint Cloak: Могой тэмдэгт тулааны гэгээнтэн нөмрөг,
                        Dragon mark Saint Cloak: Луу тэмдэгт тулааны гэгээнтэн нөмрөг,
                        God Cloak: Бурханы нөмрөг,
                        White Dragon Mark God Cloak: Цагаан луу тэмдэгт бурханы нөмрөг,
                        Grey Dragon Mark: Саарал луу тэмдэгт бурханы нөмрөг,
                        Blue Dragon Mark: Цэнхэр луу тэмдэгт бурханы нөмрөг,
                        Purple Dragon Mark: Нил ягаан луу тэмдэгт бурханы нөмрөг,
                        Gold Dragon Mark: Алтан луу тэмдэгт бурханы нөмрөг,
                        Royal Dragon Mark: Хааны луу тэмдэгт бурханы нөмрөг,
                        Immortal Dragon Mark: Үхэшгүй луу тэмдэгт бурханы нөмрөг,
                        Exalted Dragon Mark: Дээд зиндааны луу тэмдэгт бурханы нөмрөг,
                        Saint Dragon Mark: Гэгээнтэн луу тэмдэгт бурханы нөмрөг,
                        Martial Saint: Тулааны гэгээнтэн,
                        Martial Spirit: Тулааны сүнс,
                        Martial Arts: Тулааны урлаг,
                        Earthen Taboo: Газрын хориг,
                        Mortal taboo: Үхлийн хориг,
                        Heaven Taboo: Тэнгэрийн хориг,
                        Emperor Taboo: Эзэн хааны хориг,
                        Ancestral Taboo: Эртний үеийн хориг,
                        Immortal Taboo: Үхэшгүй хориг,
                        God Taboo: Бурханы хориг,
                        Exalted Taboo: Дээд зиндааны хориг,
                        World spirit: Ертөнцийн сүнс,
                        World spirit master: Ертөнцийн сүнсний эзэн,
                        Asura world spirits: Асура ертөнцийн сүнсүүд,
                        Asura world spirit: Асура ертөнцийн сүнс,
                        Martial: Тулаан,
                        World spirit techniques: Ертөнцийн сүнсний техникүүд,
                        Ancient elf: Эртний эльф,
                        Eggy: Эгги,
                        Overlord domain: Ноёрхогч нутаг,
                        Overlord: Ноёрхогч,
                        domain: Нутаг,
                    You can translate even HTML doesn't change tags.
                    `,
                maxOutputTokens: 65536,
                thinkingConfig: (model === 'gemini-2.5-flash' || model === 'gemini-2.5-pro') ? {
                    includeThoughts: true,
                } : undefined,
                safetySettings: safetySettings,
            },
            safetySettings: safetySettings,
        });
        console.log("response ===>", response)
        const translated_content = await response['text']

        return new Response(JSON.stringify({
            status: 200,
            content: translated_content
        }))
    } catch (error) {
        return new Response(JSON.stringify({ message: error?.['message'] || 'Error occured', success: false }), {
            status: 201,
        })
    }
}