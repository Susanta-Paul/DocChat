import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

export default async function splitText(text) {
    
    const splitter= new RecursiveCharacterTextSplitter({
        chunkOverlap: 20,
        chunkSize: 200,
        separators: ["\n\n", "\n", " ", ""]
    })

    const docs=await splitter.splitText(text)

    return docs
}