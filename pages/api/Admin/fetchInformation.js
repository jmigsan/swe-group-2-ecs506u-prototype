import {prisma} from '@/pages/prismaClient';
export default async function handler(req, res){

    try{

        const users = await prisma.user.findMany();
        const trades = await prisma.trade.findMany();
 
        res.status(200).json({users, trades});
    }
    catch(error){
        res.status(500).json({message: "Error retrieving information"});
    }
}