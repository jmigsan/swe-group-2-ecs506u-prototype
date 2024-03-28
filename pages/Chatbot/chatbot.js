'use client'
import React, { useState } from 'react';
import OpenAI from 'openai';
export default function Chatbot(){
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY)
    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

    const handleUserInput = async () => {
        // Start the loading state
        setIsLoading(true);
    
        // Add the user's message to the chat history
        setChatHistory((prevChat) => [
          ...prevChat,
          { role: 'user', content: userInput },
        ]);
    
        // Make a request to OpenAI for the chat completion
        const chatCompletion = await openai.chat.completions.create({
          messages: [...chatHistory, { role: 'assistant', content: userInput }],
          model: 'gpt-3.5-turbo',
        });
    
        // Add the assistant's response to the chat history
        setChatHistory((prevChat) => [
          ...prevChat,
          { role: 'assistant', content: chatCompletion.choices[0].message.content },
        ]);
    
        // Clear the user input field and end the loading state
        setUserInput('');
        setIsLoading(false);
    };
    //const {messages, input, handleInputChange, handleSubmit, isLoading, error} = useChat();
    return(
        <div className="chatbot-container">
            <div className="chat-history">
                {chatHistory.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        {message.content}
                    </div>
                ))}
            </div>
            <div className="user-input">
                <input
                    type="text"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    placeholder="Type your message here..."
                />
                <button onClick={handleUserInput} disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
    
}