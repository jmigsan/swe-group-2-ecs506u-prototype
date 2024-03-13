import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import InexperiencedMiniTradingViewWidget from '@/components/InexperiencedMiniTradingViewWidget/InexperiencedMiniTradingViewWidget';

const inexperienced = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/cryptocurrencies'
        );
        setCryptocurrencies(response.data.slice(0, 10)); //gets first 10 cryptos out of how many get received
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Cryptocurrency list</h2>
      {cryptocurrencies.map((crypto, index) => (
        <div>
          <Link href={`http://localhost:3000/inexperienced/${crypto.ticker}`}>
            <div key={index}>
              <p>Name: {crypto.name}</p>
              <p>Ticker: {crypto.ticker}</p>
              <p>Price: £{crypto.price}</p>
              <p>24hr Change: {crypto['24hr-change']}%</p>
              <InexperiencedMiniTradingViewWidget crypto={crypto} />
            </div>
          </Link>
          <br />
        </div>
      ))}
    </div>
  );
};
export default inexperienced;
