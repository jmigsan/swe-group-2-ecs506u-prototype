import axios from "axios";
import {API_KEY_CMC} from "@/pages/config/";
export default async function handler(req, res){
    try{
        const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5000&convert=USD&CMC_PRO_API_KEY=${API_KEY_CMC}`);
        res.status(200).json(response.data);
    }
    catch(error){
        console.error(error);
    }
}