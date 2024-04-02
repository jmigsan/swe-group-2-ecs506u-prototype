import { useEffect, useState } from "react";
import Pusher from "pusher-js";

export default function Livechat(){

    const [username, setUsername] = useState('username');
    const [messages,setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const submit = async (e) =>{
        e.preventDefault();

        console.log("the message was sent :  ____________", message)
        try {
            const response = await fetch('/api/LiveChat/livechat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    message
                })
            });

            if (response.ok) {
                console.log('Message sent successfully');
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }



        setMessage('');
    }

    useEffect(() => {
        Pusher.logToConsole = true;

        const pusher = new Pusher('4eb774d0a818c0f71273', {
            cluster: 'eu'
        });
        console.log("hellllllllllllooooo")
        const channel = pusher.subscribe('chat');
        channel.bind('message', function(data) {
        //alert(JSON.stringify(data));
        console.log("Received message:", data);
        setMessages((messages) => [...messages,data])
        });
    },[])

    return(
        <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-body-tertiary">
    
      
      <input value={username} onChange={e => setUsername(e.target.value)} />
    
    <div className="list-group list-group-flush border-bottom scrollarea">
        {console.log(messages)}
        {messages.map(message =>{
            return(
                <div>
                    <div className="d-flex w-100 align-items-center justify-content-between">
                        <strong className="mb-1">{message.username}</strong>
            
                    </div>
                    <div>{message.message}</div>
                </div>
            )
            
        })}
      
    </div>
    <form onSubmit={submit}>
        <input placeholder="Write  a message" value ={message} onChange={e => setMessage(e.target.value)}></input>
    </form>
  </div>
    )
}
