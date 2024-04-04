import { prisma } from '@/pages/prismaClient';

export default async function handler(req,res){
    try{
        const {recipientEmail} = req.body;


        const user = await prisma.user.findUnique({
            where: {
                email: recipientEmail,
                role : "Investor"
            }
        })

        if (!user) {
            // If the user doesn't exist, return an error response
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({
            user:{ 
                firstName: user.firstName,
                // add more details if you wish
            }
        })
        }
        catch(error){
            // Handle any errors that occur during the process
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    }

