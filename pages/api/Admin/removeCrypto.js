import {prisma} from '@/pages/prismaClient';

export default async function handler(req, res){

    const body = req.body;
    const coin_name = body.coin_name;

    try{
        const response = await prisma.cryptos.delete({
            where:{
                coin:coin_name,
            }
        })

        res.status(200).json({message:"crypto removed successfully"})
    }

    catch(error){
        res.status(500).json({message:"crypto not removed successfully"});
    }
}