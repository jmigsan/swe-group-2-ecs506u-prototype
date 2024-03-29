import axios from "axios";
export default async function handler(req, res){
    try{
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5000&convert=USD&CMC_PRO_API_KEY=2d64807f-912d-4cbb-9d8d-30571dd64d75');
        res.status(200).json(response.data);
    }
    catch(error){
        console.error(error);
    }
}