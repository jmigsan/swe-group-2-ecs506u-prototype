// pages/cryptocurrency/[ticker].js

import InexperiencedTradingViewWidget from '@/components/InexperiencedTradingViewWidget/InexperiencedTradingViewWidget';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '@/styles/Inexperienced.module.css';
import axios from 'axios';

const InexperiencedCryptoPage = () => {
  const router = useRouter();
  const { coinId } = router.query;
  const [cryptoData, setCryptoData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/cryptocurrency/${coinId}`
        );
        setCryptoData(response.data[0]);
      } catch (error) {
        console.error(error);
      }
    };

    if (coinId) {
      fetchData();
    }
  }, [coinId]);

  if (!cryptoData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link href={'http://localhost:3000/inexperienced'}>Go Back</Link>
      <h1>{cryptoData.name}</h1>
      <p>Symbol: {cryptoData.symbol.toUpperCase()}</p>
      <p>Price: £{cryptoData.current_price}</p>
      <p>24hr Change: {cryptoData.price_change_percentage_24h}%</p>

      <Link href={`http://localhost:3000/inexperienced/buy/${cryptoData.id}`}>
        <button>Buy</button>
      </Link>
      <Link href={`http://localhost:3000/inexperienced/sell/${cryptoData.id}`}>
        <button>Sell</button>
      </Link>
      <div className={styles.fullChartOnPage}>
        <InexperiencedTradingViewWidget symbol={cryptoData.symbol} />
      </div>
    </div>
  );
};

export default InexperiencedCryptoPage;
