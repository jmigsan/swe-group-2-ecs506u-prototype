import { prisma } from '@/pages/prismaClient';

export default async function handler(req, res) {
    
    try {
        
        
        
        

        // Create a new ticket associated with the user
        const posts = await prisma.post.findMany({
            orderBy: {
                dateCreated: 'desc' // Order posts by createdAt field in descending order
            }
        });

       

        // Return the newly created ticket
        res.status(201).json({ posts:posts });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
