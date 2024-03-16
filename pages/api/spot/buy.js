// pages/api/spot/buy.js

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import axios from 'axios';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, coinId, amount } = req.body;

  let db;

  try {
    // Fetch user's GBP balance from the database
    db = await open({
      filename: './sqlite.db',
      driver: sqlite3.Database,
    });

    await db.run('BEGIN TRANSACTION');

    const currentUserCashBalance = await db.get(
      "SELECT amount FROM portfolios WHERE userId = ? and currency = 'GBP'",
      userId
    );

    // Fetch the price of the cryptocurrency in GBP from an API endpoint
    const cryptoPriceResponse = await axios.get(
      `http://localhost:3000/api/cryptocurrency/${coinId}`
    );
    const cryptoPrice = cryptoPriceResponse.data[0].current_price;

    // Calculate the total cost in GBP for the trade
    const totalTradeCost = cryptoPrice * amount;

    if (totalTradeCost > currentUserCashBalance.amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Deduct the amount from the user's GBP balance
    await db.run(
      "UPDATE portfolios SET amount = ? WHERE userId = ? and currency = 'GBP'",
      currentUserCashBalance.amount - totalTradeCost,
      userId
    );

    // Add the amount of crypto to the user's balance
    const userCryptoBalance = await db.get(
      'SELECT * FROM portfolios WHERE userId = ? AND currency = ?',
      userId,
      coinId
    );

    if (userCryptoBalance) {
      await db.run(
        'UPDATE portfolios SET amount = ? WHERE userId = ? AND currency = ?',
        userCryptoBalance.amount + amount,
        userId,
        coinId
      );
    } else {
      await db.run(
        'INSERT INTO portfolios (userId, currency, amount) VALUES (?, ?, ?)',
        userId,
        coinId,
        amount
      );
    }

    await db.run('COMMIT');

    res.status(200).json({ message: 'Trade executed successfully' });
  } catch (error) {
    console.error('Error executing trade:', error);
    if (db) {
      await db.run('ROLLBACK');
    }
    res.status(500).json({ error: 'Failed to execute trade' });
  } finally {
    if (db) {
      await db.close();
    }
  }
};
