import axios from 'axios';
import prisma from '../_prismaClient';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, coinId, amount } = req.body;

  try {
    // Fetch user's cryptocurrency balance from the database
    const userCryptoBalance = await prisma.portfolio.findUnique({
      where: {
        userId_currency: {
          userId: userId,
          currency: coinId,
        },
      },
    });

    if (amount > userCryptoBalance.amount) {
      return res
        .status(400)
        .json({ error: 'Insufficient cryptocurrency balance' });
    }

    // Fetch the price of the cryptocurrency in GBP from an API endpoint
    const cryptoPriceResponse = await axios.get(
      `http://localhost:3000/api/cryptocurrency/${coinId}`
    );
    const cryptoPrice = cryptoPriceResponse.data[0].current_price;

    // Calculate the total value of the cryptocurrency in GBP
    const totalTradeValue = cryptoPrice * amount;

    // Get current balance of user
    const userGbp = await prisma.portfolio.findUnique({
      where: {
        userId_currency: {
          userId: userId,
          currency: 'GBP',
        },
      },
    });

    // Deduct the amount of cryptocurrency from the user's balance
    const removeUserCrypto = await prisma.portfolio.update({
      where: {
        userId_currency: {
          userId: userId,
          currency: coinId,
        },
      },
      data: {
        amount: userCryptoBalance.amount - amount,
      },
    });

    // Add the amount of GBP to the user's balance
    const addUserGbp = await prisma.portfolio.update({
      where: {
        userId_currency: {
          userId: userId,
          currency: 'GBP',
        },
      },
      data: {
        amount: userGbp.amount + totalTradeValue,
      },
    });

    res.status(200).json({ message: 'Sell order executed successfully' });
  } catch (error) {
    console.error('Error executing sell order:', error);
    res.status(500).json({ error: 'Failed to execute sell order' });
  }
};
