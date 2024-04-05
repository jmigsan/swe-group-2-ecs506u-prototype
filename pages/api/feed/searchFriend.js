import { prisma } from '@/pages/prismaClient';

export default async function handler(req,res){
    try{
        const {name} = req.body;


        const users = await prisma.user.findMany({
            where: {
                OR:[
                    {firstName:{ startsWith: name}},
                    {firstName:{ contains: name}}   
                ],
                
                role : "Investor"
            }
        })

        if (!users) {
            // If the user doesn't exist, return an error response
            return res.status(404).json({ error: 'User not found' });
        }

        
        res.status(200).json({
            users:users
                
                // add more details if you wish
            
        })
        }
        catch(error){
            // Handle any errors that occur during the process
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    }

