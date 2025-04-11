import { TextLoader } from "langchain/document_loaders/fs/text";


export default async function getText(path) {
  const loader = new TextLoader(path);
  const text = await loader.load();
  
  return text;
}
