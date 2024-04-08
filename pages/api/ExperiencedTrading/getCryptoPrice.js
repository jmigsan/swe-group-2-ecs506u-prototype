import axios from "axios";
import {API_KEY_CMC} from "@/pages/config/";
export default async function handler(req, res){

    const body = req.body;
    const coin = body.coin;
    const curr = body.currency;
    try{
        const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${coin}&convert=${curr}&CMC_PRO_API_KEY=${API_KEY_CMC}`);
        res.status(200).json(response.data);
    }

    catch(error){
        res.status(400).json({message:"could not get crypto data"})
    }
}