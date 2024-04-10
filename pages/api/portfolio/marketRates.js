import axios from "axios";
import {API_KEY_EX} from "@/pages/config/";
export default async function handler(req, res){

    const body = req.body;
    const currency = body.currency;
    try{
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY_EX}/latest/${currency}`);
        res.status(200).json(response.data);
    }

    catch(error){
        res.status(400).json({message:"could not get crypto data"})
    }
}