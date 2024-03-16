// pages/inexperienced/sell/[coinId].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const InexperiencedSellPage = () => {
  const router = useRouter();
  const { coinId } = router.query;
  const [cryptoData, setCryptoData] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/cryptocurrency/${coinId}`
        );
        setCryptoData(response.data[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (coinId) {
      fetchData();
    }
  }, [coinId]);

  const handleSell = async () => {
    const userData = {
      userId: '1', // Replace with actual user ID
      coinId: cryptoData.id,
      amount: parseFloat(amount),
    };

    try {
      const sell = await axios.post(
        'http://localhost:3000/api/spot/sell',
        userData
      );
      alert('Sell order placed successfully!');
    } catch (error) {
      console.error('Error placing sell order:', error);
      alert(
        'Failed to place sell order. Please try again later. Error: ' +
          error.response.data.error
      );
    }
  };

  if (!cryptoData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link href={`http://localhost:3000/inexperienced/${cryptoData.id}`}>
        Go Back
      </Link>
      <h1>
        {cryptoData.name} ({cryptoData.symbol.toUpperCase()})
      </h1>
      <p>Price: £{cryptoData.current_price}</p>
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

export default InexperiencedSellPage;
