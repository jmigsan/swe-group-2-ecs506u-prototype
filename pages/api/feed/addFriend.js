
import prisma from '../../lib/prisma'; 

export default async function handle(req, res) {
  const { userId, friendEmail } = req.body;

  try {
    const friend = await prisma.investor.findUnique({
      where: { email: friendEmail },
    });

    if (!friend) {
      return res.status(404).json({ error: 'Friend not found' });
    }

    await prisma.investor.update({
      where: { id: userId },
      data: {
        friends: {
          connect: { id: friend.id },
        },
      },
    });

    res.status(200).json({ message: 'Friend added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding a friend' });
  }
}
