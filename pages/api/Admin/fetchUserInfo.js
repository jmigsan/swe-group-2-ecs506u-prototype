import {prisma} from '@/pages/prismaClient';

export default async function handler(req, res){
    const body = req.body;
    const username = body.username;
    console.log(username);
    try{
    const details = await prisma.user.findUnique(
        {
            where:{
                email: username,
            }
        }
    )

    const trades = await prisma.trade.findMany({
        where:{
            userId: username,
        }
    })

    const portfolio = await prisma.balance.findMany({
        where:{
            userId: username,
        }
    })

    res.status(200).json({portfolio, details, trades})
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Issue fetching details"})
    }
}