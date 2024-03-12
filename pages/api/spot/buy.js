// pages/api/spot/buy.js

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import axios from 'axios';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, ticker, amount } = req.body;

  try {
    // Fetch user's GBP balance from the database
    const db = await open({
      filename: './sqlite.db',
      driver: sqlite3.Database,
    });
    const currentUserCashBalance = await db.get(
      "SELECT amount FROM portfolios WHERE userId = ? and ticker = 'GBP'",
      userId
    );

    // Fetch the price of the cryptocurrency in GBP from an API endpoint
    const cryptoPriceResponse = await axios.get(
      `http://localhost:3000/api/cryptocurrency/${ticker}`
    );
    const cryptoPrice = cryptoPriceResponse.data.price;

    // Calculate the total cost in GBP for the trade
    const totalTradeCost = cryptoPrice * amount;

    if (totalTradeCost > gbpBalance) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Deduct the amount from the user's GBP balance
    await db.run(
      "UPDATE portfolios SET amount = ? WHERE userId = ? and ticker = 'GBP'",
      currentUserCashBalance - totalTradeCost,
      userId
    );

    // Add the amount of crypto to the user's balance
    const userCryptoBalance = await db.get(
      'SELECT * FROM user_cryptocurrency_balances WHERE user_id = ? AND ticker = ?',
      userId,
      ticker
    );
    if (userCryptoBalance) {
      await db.run(
        'UPDATE user_cryptocurrency_balances SET amount = ? WHERE user_id = ? AND ticker = ?',
        userCryptoBalance.amount + amount,
        userId,
        ticker
      );
    } else {
      await db.run(
        'INSERT INTO user_cryptocurrency_balances (user_id, ticker, amount) VALUES (?, ?, ?)',
        userId,
        ticker,
        amount
      );
    }

    res.status(200).json({ message: 'Trade executed successfully' });
  } catch (error) {
    console.error('Error executing trade:', error);
    res.status(500).json({ error: 'Failed to execute trade' });
  }
};
