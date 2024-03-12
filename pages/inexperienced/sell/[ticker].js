// pages/inexperienced/sell/[ticker].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const SellPage = () => {
  const router = useRouter();
  const { ticker } = router.query;
  const [cryptoData, setCryptoData] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/cryptocurrency/${ticker}`
        );
        setCryptoData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (ticker) {
      fetchData();
    }
  }, [ticker]);

  const handleSell = async () => {
    const userData = {
      userId: '123456', // Replace with actual user ID
      ticker: cryptoData.ticker,
      amount: parseFloat(amount),
    };

    try {
      await axios.post('http://localhost:3000/api/spot/sell', userData);
      alert('Sell order placed successfully!');
    } catch (error) {
      console.error('Error placing sell order:', error);
      alert('Failed to place sell order. Please try again later.');
    }
  };

  if (!cryptoData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link href={`http://localhost:3000/inexperienced/${cryptoData.ticker}`}>
        Go Back
      </Link>
      <h1>
        {cryptoData.name} ({cryptoData.ticker})
      </h1>
      <p>Price: £{cryptoData.price}</p>
      <input
        type='number'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder='Enter amount to sell'
      />
      <button onClick={handleSell}>Sell</button>
    </div>
  );
};

export default SellPage;
