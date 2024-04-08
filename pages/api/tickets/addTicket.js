import { prisma } from '@/pages/prismaClient';

export default async function handler(req, res) {
    console.log("ADD TICKET API ENDPOINT")
    try {
        const { userEmail, issueType, otherIssueType, issueDescription } = req.body;


        // Create a new ticket associated with the user
        const newTicket = await prisma.ticket.create({
            data: {
                issueType: issueType,
                issueDescription: issueDescription,
                otherIssueType: otherIssueType,
                user: {
                    connect: {
                        email: userEmail,
                    },
                },
            },
        });

        // Return the newly created ticket
        res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
