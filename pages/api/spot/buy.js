// pages/api/spot/buy.js

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import axios from 'axios';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, ticker, amount } = req.body;
  let db;

  try {
    // Fetch user's GBP balance from the database
    db = await open({
      filename: './sqlite.db',
      driver: sqlite3.Database,
    });

    await db.run('BEGIN TRANSACTION');

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

    if (totalTradeCost > currentUserCashBalance.amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Deduct the amount from the user's GBP balance
    await db.run(
      "UPDATE portfolios SET amount = ? WHERE userId = ? and ticker = 'GBP'",
      currentUserCashBalance.amount - totalTradeCost,
      userId
    );

    // Add the amount of crypto to the user's balance
    const userCryptoBalance = await db.get(
      'SELECT * FROM portfolios WHERE userId = ? AND ticker = ?',
      userId,
      ticker
    );

    if (userCryptoBalance) {
      await db.run(
        'UPDATE portfolios SET amount = ? WHERE userId = ? AND ticker = ?',
        userCryptoBalance.amount + amount,
        userId,
        ticker
      );
    } else {
      await db.run(
        'INSERT INTO portfolios (userId, ticker, amount) VALUES (?, ?, ?)',
        userId,
        ticker,
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
