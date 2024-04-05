import {prisma} from "@/pages/prismaClient";

export default async function handler(req, res){
    const body =req.body;
    const user = body.username;
    const staff = body.staffName;

    try{
        const data={
            userId:user,
            staffId:staff,
        }
        await prisma.chatPairs.create({data:data});
        res.status(200).json(data);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Couldnt create chat pair"});
    }
}