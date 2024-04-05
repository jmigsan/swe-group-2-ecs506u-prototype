// adding friend

import {prisma } from '@/pages/prismaClient';
import {Prisma } from '@prisma/client'

export default async function handler(req,res){
    try{
        const {recipientEmail,userEmail} = req.body;
        

        const recipient = await prisma.user.findUnique({
            where: {
                email: recipientEmail,
                role : "Investor"
            }
        })
        
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
        
       
        
        res.status(201).json({
            user:{ 
                firstName: recipient.firstName,
                // add more details if you wish
            }
        })
        
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
        console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
    }

