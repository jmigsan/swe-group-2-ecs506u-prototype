import { prisma } from '@/pages/prismaClient';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    console.log("VIEW TICKET API ENDPOINT")
    try {

        const { userEmail  } = req.body;

        console.log("email in viewTicket.js " ,userEmail )

        // user from the database based on the provided email
        const user = await prisma.users.findUnique({
            where: {
                email: userEmail,
            },
        });


        // Check if the user exists
        if (!user) {
            // If the user doesn't exist, return an error response
            return res.status(404).json({ error: 'User not found' });
        }

        // Assuming there's a foreign key relationship between users and tickets table,
        // Query tickets related to the user
        const tickets = await prisma.Ticket.findMany({
            where: {
                userEmail: userEmail , // Assuming email is used as the foreign key in the tickets table
            },
            select: {
                issueType: true,
                otherIssueType: true,
                issueDescription: true,
                dateCreated: true,
            },
        });

        console.log("tickets: ",tickets)
        // Return the tickets information for the user
        res.status(200).json({
            user: {
                firstName: user.firstName,
                email: user.email,

                // Add other user information you want to return
            },
            tickets: tickets,
        });

    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
