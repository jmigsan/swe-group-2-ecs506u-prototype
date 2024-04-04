// adding friend

import {prisma } from '@/pages/prismaClient';
import {Prisma } from '@prisma/client'

export default async function handler(req,res){
    try{
        const {recipientEmail,userEmail} = req.body;
        console.log(recipientEmail,userEmail)

        const recipient = await prisma.user.findUnique({
            where: {
                email: recipientEmail,
                role : "Investor"
            }
        })
        console.log(recipient);
        if (!recipient) {
            // If the user doesn't exist, return an error response
            return res.status(404).json({ error: 'User not found' });
        }
        
        const friendship = await prisma.friends.create({
            data: {
                
                sender: {connect:{email:userEmail}},
                recipient: {connect:{email:recipient.email}}
            }
        })
        
       
        console.log("here");
        res.status(201).json({
            user:{ 
                firstName: recipient.firstName,
                // add more details if you wish
            }
        })
        console.log("you are now freinds");
    }
    catch (error){

        if (error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code === 'P2002'){
                res.status(201).json({
                    message:"you are already freinds"
            })
                }
            
        }
        // Handle any errors that occur during the process
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
    }

