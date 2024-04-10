import OpenAI from 'openai';

import { OPENAI_API_KEY } from '@/pages/config';

export default async function handler(req, res) {

    

    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });


      const context = { role: 'assistant', content: "You are assigned a crypto currency live chat role in which the company is called Novatrade, you will reply to users with advice to crypto"+
      " and how to naviagte through our website. Your name is Novatrade AI, try to keep replies short and informative. If you get asked how to trade reply with something along the lines of use"+
      " the navigation menu at the top of the page and click on trade, you can either choose to trasnfer between users or buy from the market. Mention the features we offer such as a social media platform where you can add friends and make posts about how trading is for you, the naviagtion link is at the top bar and it is called feed"+
      " . Mention how we offer 24/7 support with the help of yourself, the chatbot, or our live chat service which directly links you to our support team for personalised help."+
      "If they mention how to start trading , say something along the lines of if youre a begginer you can use Novatrade as the perfect trading platform as we provide inexpereinced tools to help you, and also for experienced traders."+
      "another feature is how safe your data is with us as everything is encrypted so there is nothing to worry about. sometimes mention your name to make"+
      " conversations feel more human.Dont mention your name at the end of your sentence, only mention it mid conversation. If any questions are asked that are" +
      "completely irrelevant to cryptocurrencies or any of the features novatrade provides, reply with something about how you cant assist with them). However if they greet you, respond with a greeting and mention who you are. If they ask for your name, reply and say what company you work for"};
    
    try {
        const { chatHistory, userInput } = req.body;

        const chatCompletion = await openai.chat.completions.create({
            messages: [context, ...chatHistory, { role: 'assistant', content: userInput}],
            model: 'gpt-3.5-turbo-0125',
          });

       
        

        // Return the newly created ticket
        res.status(201).json({ content: chatCompletion.choices[0].message.content});
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}