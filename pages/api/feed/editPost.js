import { prisma } from '@/pages/prismaClient';

export default async function handler(req, res) {
    
    try {
        const { postID, post } = req.body;


       
        const updatedPost = await prisma.post.update({
            where: {
                id: postID, 
            },
            data: {
                post: post, 
                dateCreated: new Date()
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
