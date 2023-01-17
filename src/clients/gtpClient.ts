import { Configuration, OpenAIApi } from "openai";

export class GptClient{
  openai : any;
  constructor(apiKey: string) {
     const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }
  async getMessages(filesChanged: string) {
    const prompt = `erzeuge 3 git commit messages basierend auf den folgenden Veränderungen inklusive einer Überschrift und einer kurzen Beschreibung: ${filesChanged}`
    try {
      const response = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0.2,
        presence_penalty: 0,
      });
      return response.data.choices[0].text.split(/\r?\n/).filter((t: string) => t?.length);
      // console.log();

    } catch (error: any) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
        return [];
    }
  }
}
