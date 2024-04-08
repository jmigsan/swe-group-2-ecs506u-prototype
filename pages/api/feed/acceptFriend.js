// accepting freind request


import { prisma } from '@/pages/prismaClient';

export default async function handler(req,res){
    
    try{
        const {friendID,userEmail,accept} = req.body;
        
        
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

