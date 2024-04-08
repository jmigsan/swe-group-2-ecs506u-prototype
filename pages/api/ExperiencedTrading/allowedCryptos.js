import {prisma} from "@/pages/prismaClient";
export default async function handler(req, res){


    try{
        const cryptos = await prisma.cryptos.findMany();

        res.status(200).json(cryptos);
    }
    catch(error){
        res.status(500).json({message: "Error getting cryptos"})
    }
}