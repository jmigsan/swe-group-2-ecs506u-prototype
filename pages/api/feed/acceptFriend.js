// accepting freind request


import { prisma } from '@/pages/prismaClient';

export default async function handler(req,res){
    
    try{
        const {friendID,userEmail,accept} = req.body;
        console.log(req.body,"here1")
        
        if (accept){
            const users = await prisma.friends.update({
                where: {
                    friendID:friendID,
                    accepted: false
                },
                    data:{
                        accepted: true
                    }
                })
                console.log(users,"here at acceptfriend request");

                res.status(200).json({
                    message: "User accepted"
                })
        }
        else{
            const users = await prisma.friends.delete({
                where: {
                    friendID:friendID,
                    accepted: false
                }
                   
                })
                res.status(200).json({
                    message: "User declined"
                })
        }



        // console.log(users,"here at acceptfriend request");
        // const friends = users.map(user => {
        //     if (user.userID === userEmail){
        //         return user.recipientID
        //     }
        //     else if (user.recipientID === userEmail){
        //         return user.userID;

        //     }else{
        //         return null;
        //     }
        // }).filter(email => email !== null);

        
        
        res.status(200).json({
            message: ""
        })
        }
        catch(error){
            // Handle any errors that occur during the process
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    }

