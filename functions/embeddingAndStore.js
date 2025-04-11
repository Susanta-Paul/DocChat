import {Pinecone as PineconeClient } from "@pinecone-database/pinecone"
import embeddings from "./embeddings.js";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";



export default async function embeddingAndStore(textArray){

    const embeddings= new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HF_API_KEY,
        model: "BAAI/bge-small-en-v1.5"
    })

    // create the embeddings for the whole text
    const embeddedDocs=await embeddings.embedDocuments(textArray)
    

    const pinecone= new PineconeClient({
        apiKey: process.env.PINECONE_API_KEY
    });
    
    // connect to the given index of the pinecone
    const pineIdx= pinecone.Index(process.env.PINECONE_INDEX)

    console.log(typeof textArray[0])

    const vectors = embeddedDocs.map((embedding, index) => ({
        id: `doc-${index}`,
        values: embedding,
        metadata:{ text: textArray[index] }
      }));

    // console.log(vectors)

    
    // upload it to the pinecone vector store
    await pineIdx.upsert(vectors)

    
}