import { prisma } from '@/pages/prismaClient';

export default async function handler(req, res) {
    
    try {
        const { userEmail, name } = req.body;


       
        const user = await prisma.user.findUnique({
            where: {
                email: userEmail, 
            },
            
        });
        console.log(user)
        // Return the newly created ticket
        res.status(201).json({name:user.firstName});
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
