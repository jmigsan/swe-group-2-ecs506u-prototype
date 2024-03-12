// pages/cryptocurrency/[ticker].js

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const InexperiencedCryptoPage = () => {
  const router = useRouter();
  const { ticker } = router.query;
  const [cryptoData, setCryptoData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/cryptocurrency/${ticker}`
        );
        if (response.ok) {
          const data = await response.json();
          setCryptoData(data);
        } else {
          // Handle error
        }
      } catch (error) {
        // Handle error
      }
    };

    if (ticker) {
      fetchData();
    }
  }, [ticker]);

  if (!cryptoData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link href={'http://localhost:3000/inexperienced'}>Go Back</Link>
      <h1>{cryptoData.name}</h1>
      <p>Ticker: {cryptoData.ticker}</p>
      <p>Price: £{cryptoData.price}</p>
      <p>24hr Change: {cryptoData.change_24hr}%</p>
      <Link
        href={`http://localhost:3000/inexperienced/buy/${cryptoData.ticker}`}
      >
        <button>Buy</button>
      </Link>
      <Link
        href={`http://localhost:3000/inexperienced/sell/${cryptoData.ticker}`}
      >
        <button>Sell</button>
      </Link>
    </div>
  );
};

export default InexperiencedCryptoPage;
