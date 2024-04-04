import {prisma} from '@/pages/prismaClient'
export default async function handler(req, res){
    const body = req.body;
    const new_email= body.email;
    const getUser = await prisma.User.findUnique({
        where:{
            email: new_email,
        },
    })

    

    if(getUser===null){
        res.status(200).json({messsage: "Success"});
    }
    else{
        res.status(500).json({messsage: "User exists"});
    }
    
}