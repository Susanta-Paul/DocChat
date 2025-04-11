import { ChatGroq } from "@langchain/groq"
import {ChatPromptTemplate} from "@langchain/core/prompts"
import { configDotenv } from "dotenv"
import getText from './functions/getText.js';
import splitText from "./functions/splitText.js";
import embeddingAndStore from "./functions/embeddingAndStore.js";
import retriveData from "./functions/retriveData.js";
import promptSync from "prompt-sync"


configDotenv()


async function storeTextinVectorbase(path){
    // get the text data from the file
    const data=await getText("./assets/SteveJobsSpeech.txt")

    // convert the text data into chunks with some overlaps 
    const docs= await splitText(data[0].pageContent)

    // make embeddings of the data and store in the vector store
    await embeddingAndStore(docs)
}

// await storeTextinVectorbase("")

const model=new ChatGroq({
    model:"llama-3.3-70b-versatile",
    temperature: 0.7,
    apiKey: process.env.GROQ_API_KEY
})

const chatPrompt= ChatPromptTemplate.fromMessages([
    ["system", "Act like steve jobs. and you are giving a speech in standford university."],
    ["system", "here is the past conversation {chat_history} "],
    ["human", "{topic}"],
    ["system", "here is the {context} answer students question according to this in 50 words."]
])

let history="human: hello, i am Sushant, AI: hi Susanta, how can i help you today?"

async function replyQuery(query) {
    const cont= await retriveData(query)
    const context=cont[0].pageContent+cont[1].pageContent

    const chain= chatPrompt.pipe(model)

    const res= await chain.invoke({topic: query, context: context, chat_history: history})
    history= history+ `human: ${query}, `
    history= history+ `AI: ${res.content}\n`
    return res.content
}

const prompt=promptSync()
while(true){
    const userQuery= prompt("user: ")
    if(userQuery==="e"){
        break
    }else{
        const chatReply= await replyQuery(userQuery)
        console.log(`Answer: ${chatReply}\n\n\n`)
    }
}

