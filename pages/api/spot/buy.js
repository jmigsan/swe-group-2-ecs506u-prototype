// pages/api/spot/buy.js

import axios from 'axios';
import prisma from '../_prismaClient';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, coinId, amount } = req.body;

  try {
    // Fetch the price of the cryptocurrency in GBP from an API endpoint
    const userGbp = await prisma.portfolio.findUnique({
      where: {
        userId_currency: {
          userId: userId,
          currency: 'GBP',
        },
      },
    });

    const cryptoPriceResponse = await axios.get(
      `http://localhost:3000/api/cryptocurrency/${coinId}`
    );
    const cryptoPrice = cryptoPriceResponse.data[0].current_price;

    // Calculate the total cost in GBP for the trade
    const totalTradeCost = cryptoPrice * amount;

    if (totalTradeCost > userGbp.amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Deduct the amount from the user's GBP balance
    const deductUserGbp = await prisma.portfolio.update({
      where: {
        userId_currency: {
          userId: userId,
          currency: 'GBP',
        },
      },
      data: {
        amount: userGbp.amount - totalTradeCost,
      },
    });

    // Add the amount of crypto to the user's balance
    const userCryptoBalance = await prisma.portfolio.findUnique({
      where: {
        userId_currency: {
          userId: userId,
          currency: coinId,
        },
      },
    });

    if (userCryptoBalance) {
      const updateUserCrypto = await prisma.portfolio.update({
        where: {
          userId_currency: {
            userId: userId,
            currency: coinId,
          },
        },
        data: {
          amount: userCryptoBalance.amount + amount,
        },
      });
    } else {
      const addUserCrypto = await prisma.portfolio.create({
        data: {
          userId: userId,
          currency: coinId,
          amount: amount,
        },
      });
    }

    res.status(200).json({ message: 'Trade executed successfully' });
  } catch (error) {
    console.error('Error executing trade:', error);
    res.status(500).json({ error: 'Failed to execute trade' });
  }
};
