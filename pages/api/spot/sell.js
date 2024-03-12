// pages/api/spot/sell.js

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import axios from 'axios';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, ticker, amount } = req.body;

  try {
    // Fetch user's cryptocurrency balance from the database
    const db = await open({
      filename: './path/to/your/database.db',
      driver: sqlite3.Database,
    });
    const userCryptoBalance = await db.get(
      'SELECT * FROM user_cryptocurrency_balances WHERE user_id = ? AND ticker = ?',
      userId,
      ticker
    );
    const cryptoBalance = userCryptoBalance.amount;

    if (amount > cryptoBalance) {
      return res
        .status(400)
        .json({ error: 'Insufficient cryptocurrency balance' });
    }

    // Fetch the price of the cryptocurrency in GBP from an API endpoint
    const cryptoPriceResponse = await axios.get(
      `/api/cryptocurrency/${ticker}`
    );
    const cryptoPrice = cryptoPriceResponse.data.price;

    // Calculate the total value of the cryptocurrency in GBP
    const totalValue = cryptoPrice * amount;

    // Add the amount of GBP to the user's balance
    await db.run(
      'UPDATE user_balances SET gbp_balance = gbp_balance + ? WHERE user_id = ?',
      totalValue,
      userId
    );

    // Deduct the amount of cryptocurrency from the user's balance
    await db.run(
      'UPDATE user_cryptocurrency_balances SET amount = ? WHERE user_id = ? AND ticker = ?',
      cryptoBalance - amount,
      userId,
      ticker
    );

    res.status(200).json({ message: 'Sell order executed successfully' });
  } catch (error) {
    console.error('Error executing sell order:', error);
    res.status(500).json({ error: 'Failed to execute sell order' });
  }
};
