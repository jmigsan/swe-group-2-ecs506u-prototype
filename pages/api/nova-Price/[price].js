import Investor from "@/pages/classes/Investor";
import axios from "axios";
import {API_KEY_CMC} from "@/pages/config/";
import {prisma} from "@/pages/prismaClient";
export default async function handler(req, res){
    const {API_KEY, symbol, currency}= req.query;

    const investor = Investor.getInstance();
    const user = await investor.checkKey(API_KEY);

    if(!user){
        res.status(500).json({message: "Invalid API key: " + API_KEY});
        return;
    }
    const allowedCoins = await prisma.cryptos.findMany();
    
    let exists = false;
    for(let i=0; i<allowedCoins.length; i++){
        if(allowedCoins[i].symbol==symbol){
            exists = true;
        }
    }

    if(!exists){
        res.status(500).json({message: "Uknown value for symbol " + symbol})
        return;
    }
    let response;
    try{
        response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=${currency}&CMC_PRO_API_KEY=${API_KEY_CMC}`);
   
        res.status(200).json({message:response.data.data});
    }

    catch(error){
        res.status(400).json({message:"Invalid value for currency: " + currency})
    }
}