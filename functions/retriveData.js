// import embeddings from "./embeddings.js"
import {PineconeStore} from "@langchain/pinecone"
import {Pinecone as PineconeClient } from "@pinecone-database/pinecone"
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf"



export default async function retriveData(query){
    
    const embeddings= new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HF_API_KEY,
        model: "BAAI/bge-small-en-v1.5"
    })
    
    const pinecone=new PineconeClient({
        apiKey: process.env.PINECONE_API_KEY
    })

    const pineIdx=pinecone.Index(process.env.PINECONE_INDEX)

    // created the vector store
    const vectorstore= await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: pineIdx,
        
    })

    // perform symmentic search to fetch the data
    const retreiver= vectorstore.asRetriever({
        k: 2,
        include_metadata: true,
        
    })

    const result= await retreiver.invoke(query)
    // const result = await vectorstore.similaritySearch(query, 2)
    return result
}