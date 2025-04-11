import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const embeddings= new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HF_API_KEY,
    model: "BAAI/bge-small-en-v1.5"
})

export default embeddings