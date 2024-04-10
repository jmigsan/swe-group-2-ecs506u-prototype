import Investor from "@/pages/classes/Investor";
import axios from "axios";
import {API_KEY_CMC} from "@/pages/config/";
import {prisma} from "@/pages/prismaClient";
export default async function handler(req, res){
    let {API_KEY, coin, amount, currency, type} = req.query;
    amount=Number(amount);
    const investor = Investor.getInstance();
    const user = await investor.checkKey(API_KEY);

    if(!user){
        res.status(500).json({message: "Invalid API key: " + API_KEY});
        return;
    }
    if(type!="Buy" && type!="Sell"){
        res.status(500).json({message: "Invalid value for type:  " + type});
        return;
    }

    const allowedCoins = await prisma.cryptos.findMany();
    
    let exists = false;
    for(let i=0; i<allowedCoins.length; i++){
        if(allowedCoins[i].symbol==coin){
            exists = true;
        }
    }

    if(!exists){
        res.status(500).json({message: "Invalid value for coin:  " + coin});
        return;
    }

    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
        params: {
            symbol: coin,
            convert: currency,
            CMC_PRO_API_KEY: API_KEY_CMC
        }
        });

    const price = response.data.data[coin].quote[currency].price;


    const amount2= price *amount;
    const username = user[0].userId;
    const balance = await investor.getBalance(username);

    for(let i=0; i<balance.length; i++){
        if(type=="Sell"){
            if(balance[i].currency==coin){
                if(balance[i].amount<amount){
                    res.status(500).json({message: "Insufficient balance of " + coin})
                    return;
                }
            }
        }
        else if(type=="Buy"){
            if(balance[i].currency==currency){
                
                if(balance[i].amount<amount2){
                    res.status(500).json({message: "Insufficient balance of " + currency})
                    return;
                }
            }
        }
    }
   

    try{
    if(type=="Buy")
    {
        investor.Trade(type, username, coin, currency, amount, amount2, price);
    }
    else if(type=="Sell"){
        investor.Trade(type, username, currency, coin, amount2, amount, price);
    }
    res.status(200).json({message:"Trade executed successfully!"});
    }
catch(error){
    res.status(500).json({message: "Error executing trade"})
}

}