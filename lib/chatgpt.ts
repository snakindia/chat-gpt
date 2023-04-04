import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: process.env.NEXT_PUBLIC_OPENAI_ORGANISATION_KEYgit ,
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

const openai= new OpenAIApi(configuration)

export default openai;