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
    const prompt = `Erzeuge eine Überschrift und eine Beschreibung basierend auf den folgenden Veränderungen: ${filesChanged}`
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
      return response.data.choices[0].text;

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
