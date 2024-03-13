// pages/api/spot/sell.js

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
    // Fetch user's cryptocurrency balance from the database
    const db = await open({
      filename: './sqlite.db',
      driver: sqlite3.Database,
    });

    await db.run('BEGIN TRANSACTION');

    const userCryptoBalance = await db.get(
      'SELECT amount FROM portfolios WHERE userId = ? AND ticker = ?',
      userId,
      ticker
    );
    const cryptoBalance = userCryptoBalance.amount;

    if (amount > cryptoBalance) {
      console.log('hey');
      return res
        .status(400)
        .json({ error: 'Insufficient cryptocurrency balance' });
    }

    // Fetch the price of the cryptocurrency in GBP from an API endpoint
    const cryptoPriceResponse = await axios.get(
      `http://localhost:3000/api/cryptocurrency/${ticker}`
    );
    const cryptoPrice = cryptoPriceResponse.data.price;

    // Calculate the total value of the cryptocurrency in GBP
    const totalTradeValue = cryptoPrice * amount;

    // Get current balance of user
    const currentUserCashBalance = await db.get(
      "SELECT amount FROM portfolios WHERE userId = ? and ticker = 'GBP'",
      userId
    );

    // Add the amount of GBP to the user's balance
    await db.run(
      "UPDATE portfolios SET amount = ? WHERE userId = ? and ticker = 'GBP'",
      totalTradeValue + currentUserCashBalance.amount,
      userId
    );

    // Deduct the amount of cryptocurrency from the user's balance
    await db.run(
      'UPDATE portfolios SET amount = ? WHERE userId = ? AND ticker = ?',
      cryptoBalance - amount,
      userId,
      ticker
    );

    await db.run('COMMIT');

    res.status(200).json({ message: 'Sell order executed successfully' });
  } catch (error) {
    console.error('Error executing sell order:', error);
    if (db) {
      await db.run('ROLLBACK');
    }
    res.status(500).json({ error: 'Failed to execute sell order' });
  } finally {
    if (db) {
      await db.close();
    }
  }
};
