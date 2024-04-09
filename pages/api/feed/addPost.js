import { prisma } from '@/pages/prismaClient';

export default async function handler(req, res) {
    console.log("here");
    try {
        const { userEmail, post } = req.body;


        // Create a new ticket associated with the user
        const posts = await prisma.post.create({
            data: {
                post:post,
                user: {
                    connect: {
                        email: userEmail,
                    },
                }
                
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
