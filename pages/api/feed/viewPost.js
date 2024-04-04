import { prisma } from '@/pages/prismaClient';

export default async function handler(req, res) {
    
    try {
        const {friends,userEmail} = req.body;
        
        const friendEmails = friends.map(friend => friend[1])
        

        // Create a new ticket associated with the user
        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    { userEmail: userEmail }, // Check if userEmail matches the main user's email
                    { userEmail: { in: friendEmails } } // Check if userEmail matches any email in friendEmails array
                ]
            },
        });

       

        // Return the newly created ticket
        res.status(201).json({ posts:posts });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
