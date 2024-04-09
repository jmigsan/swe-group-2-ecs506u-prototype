import { prisma } from '@/pages/prismaClient';

export default async function handler(req, res) {
    if (req.method === 'PATCH') {
        try {

            const ticketId = parseInt(req.query.id);
            const { newValue, adminComments} = req.body;
            console.log("ticket number ", ticketId)
            console.log("updateTicket endpoint new value ", newValue)
            console.log("admin comments", adminComments)


            const updatedTicket = await prisma.ticket.update({
                where: {
                    id: ticketId,
                },
                data: {
                    solved: newValue,
                    comments: {
                        set: adminComments
                    },
                },
            });


            res.status(200).json({ message: 'Ticket updated successfully', ticket: updatedTicket });
        } catch (error) {

            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        // Handle other HTTP methods if needed
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}