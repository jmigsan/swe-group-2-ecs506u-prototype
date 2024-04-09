import { prisma } from '@/pages/prismaClient';

export default async function handler(req, res) {
    
    try {
        const { userEmail, name } = req.body;


       
        const updatedPost = await prisma.user.update({
            where: {
                email: userEmail, 
            },
            data: {
                firstName:name
            },
        });

        // Return the newly created ticket
        res.status(201).json({ message: 'Post created successfully'});
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
