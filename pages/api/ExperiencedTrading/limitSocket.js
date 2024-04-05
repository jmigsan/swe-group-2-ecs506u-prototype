import { Server } from 'socket.io'
import Investor from "@/pages/classes/Investor";
import axios from 'axios';
import {API_KEY_CMC} from "@/pages/config/";
const SocketHandler = (req, res) => {

  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connect', (socket) =>{
        
        socket.on('message', (message) =>{
        const investor = Investor.getInstance();
            setInterval(async ()=>{
                const balance = await investor.getBalance(message);
                const orders = await investor.getLimits(message);
               
                if(orders!=null){
                    for(let i=0; i<orders.length; i++){
                    let curr;
                    let coin;
                    if(orders[i].Type=="Buy"){
                        curr=orders[i].Sold;
                        coin=orders[i].Bought;
                    }
                    else{
                        curr=orders[i].Bought;
                        coin=orders[i].Sold
                    }
                    const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${coin}&convert=${curr}&CMC_PRO_API_KEY=${API_KEY_CMC}`);
                    const coin_price = (response.data).data;
              
                    const price = coin_price[coin].quote[curr].price

                    if(orders[i].Price>=price){
                        console.log("here");
                        for(let j=0; j<balance.length; j++){
                            if(balance[j].currency==orders[i].Sold){
                                if(balance[j].amount>=orders[i].AmountSold){
                                    console.log("here2");
                                    await investor.Trade(orders[i].Type, orders[i].userId, orders[i].Bought, orders[i].Sold, orders[i].AmountBought, orders[i].AmountSold, price);
                                    socket.emit('limitExecuted', orders[i].id);
                                }
                            }
                        }
                      
                        await investor.deleteLimit(orders[i].id);
                        
                    }
                }
                }
            }, [10000])
        })
    })
  }



  res.end()
}

export default SocketHandler