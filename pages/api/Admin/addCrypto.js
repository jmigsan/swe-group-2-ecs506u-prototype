import {prisma} from '@/pages/prismaClient';
export default async function handler(req, res){
    const body = req.body;
    const coin = body.coin_name;
    const id = body.coin_id;
    const symbol = body.coin_symbol;
    console.log(coin);
    try{
        const data ={
            coin: coin,
            id: id,
            symbol: symbol,
        }
        await prisma.cryptos.create({data:data});

        res.status(200).json({message: "coin added succesfully"});
    }

    catch(error){
        res.status(500).json({message: "coin not added succesfully"});
    }
}