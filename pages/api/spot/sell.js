// pages/api/spot/sell.js

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import axios from 'axios';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, coinId, amount } = req.body;
  let db;

  console.log(req.body);

  try {
    // Fetch user's cryptocurrency balance from the database
    const db = await open({
      filename: './sqlite.db',
      driver: sqlite3.Database,
    });

    await db.run('BEGIN TRANSACTION');

    const userCryptoBalance = await db.get(
      'SELECT amount FROM portfolios WHERE userId = ? AND currency = ?',
      userId,
      coinId
    );

    console.log(userCryptoBalance);

    const cryptoBalance = userCryptoBalance.amount;

    if (amount > cryptoBalance) {
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
    const currentUserCashBalance = await db.get(
      "SELECT amount FROM portfolios WHERE userId = ? and currency = 'GBP'",
      userId
    );

    // Add the amount of GBP to the user's balance
    await db.run(
      "UPDATE portfolios SET amount = ? WHERE userId = ? and currency = 'GBP'",
      totalTradeValue + currentUserCashBalance.amount,
      userId
    );

    // Deduct the amount of cryptocurrency from the user's balance
    await db.run(
      'UPDATE portfolios SET amount = ? WHERE userId = ? AND currency = ?',
      cryptoBalance - amount,
      userId,
      coinId
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
