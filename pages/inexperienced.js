import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import InexperiencedMiniTradingViewWidget from '@/components/InexperiencedMiniTradingViewWidget/InexperiencedMiniTradingViewWidget';
import Image from 'next/image';
import styles from '@/styles/Inexperienced.module.css';

const inexperienced = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/cryptocurrencies'
        );
        setCryptocurrencies(response.data); //this should only return 10
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
        <div key={index} className={styles.listItem}>
          <Link href={`http://localhost:3000/inexperienced/${crypto.id}`}>
            <div className={styles.coinContainer}>
              <div className={styles.coinInfo}>
                <div className={styles.coinImage}>
                  <Image
                    src={crypto.image}
                    alt={`Image for ${crypto.name}`}
                    width={180}
                    height={180}
                  />
                </div>
                <div className={styles.coinDetails}>
                  <h2>{crypto.name}</h2>
                  <p>Symbol: {crypto.symbol.toUpperCase()}</p>
                  <p>Price: £{crypto.current_price}</p>
                  <p>24hr Change: {crypto.price_change_percentage_24h}%</p>
                </div>
              </div>
              <InexperiencedMiniTradingViewWidget symbol={crypto.symbol} />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};
export default inexperienced;
