import { Server } from 'socket.io'

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connect', (socket) =>{
        setTimeout(()=>{
            socket.emit('message', 'A member of our support team will be with you shortly')
        }, [2000])
        
        
        socket.on('message', (message) =>{
           socket.broadcast.emit(message.id, message)
        })

        socket.on('NewRequest', (message)=>{

          socket.broadcast.emit('GetRequests', message);
        })
        

        socket.on('Connected',  (message)=>{
         
          socket.broadcast.emit('Connected', message);
        })
       

    })

 
  }



  res.end()
}

export default SocketHandler