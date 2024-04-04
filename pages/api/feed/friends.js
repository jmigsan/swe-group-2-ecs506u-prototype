
import prisma from '../../lib/prisma'; 

export default async function handle(req, res) {
  const { userId } = req.query; // user ID is passed as a query parameter

  try {
    const userWithFriends = await prisma.investor.findUnique({
      where: { id: userId },
      include: {
        friends: true, 
      },
    });

    res.status(200).json(userWithFriends.friends);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching friends' });
  }
}
