// pages/api/crypto.js

//This is just to test. Not how we'll actually store cryptocurrency data. Unless you really want to.
//this is meant to have data of just one particular cryptocurrency. its meant to give more data than the entire cryptocurrency list.
//also meant to only do API call of just one crypto instead of getting entire cryptocurrency list.
//result only gives data for one particular crypto.

export default (req, res) => {
  const { ticker } = req.query;

  // Hardcoded crypto data
  const cryptoData = {
    BTC: {
      name: 'Bitcoin',
      ticker: 'BTC',
      price: 21000,
      change_24hr: 0.1,
    },
    ETH: {
      name: 'Ethereum',
      ticker: 'ETH',
      price: 1000,
      change_24hr: 1.0,
    },
    BNB: {
      name: 'Binance Coin',
      ticker: 'BNB',
      price: 2000,
      change_24hr: 2.0,
    },
    XRP: {
      name: 'Ripple',
      ticker: 'XRP',
      price: 0.5,
      change_24hr: -0.5,
    },
    LTC: {
      name: 'Litecoin',
      ticker: 'LTC',
      price: 150,
      change_24hr: 0.3,
    },
    ADA: {
      name: 'Cardano',
      ticker: 'ADA',
      price: 1,
      change_24hr: 0.8,
    },
    DOT: {
      name: 'Polkadot',
      ticker: 'DOT',
      price: 20,
      change_24hr: -0.2,
    },
    LINK: {
      name: 'Chainlink',
      ticker: 'LINK',
      price: 30,
      change_24hr: 0.7,
    },
    XLM: {
      name: 'Stellar',
      ticker: 'XLM',
      price: 0.4,
      change_24hr: 0.4,
    },
    BCH: {
      name: 'Bitcoin Cash',
      ticker: 'BCH',
      price: 500,
      change_24hr: -0.1,
    },
    DOGE: {
      name: 'Dogecoin',
      ticker: 'DOGE',
      price: 0.01,
      change_24hr: 2.5,
    },
    EOS: {
      name: 'EOS',
      ticker: 'EOS',
      price: 2.5,
      change_24hr: -0.9,
    },
    XMR: {
      name: 'Monero',
      ticker: 'XMR',
      price: 150,
      change_24hr: 1.2,
    },
    TRX: {
      name: 'Tron',
      ticker: 'TRX',
      price: 0.03,
      change_24hr: 0.6,
    },
    XTZ: {
      name: 'Tezos',
      ticker: 'XTZ',
      price: 2.2,
      change_24hr: -0.3,
    },
    VET: {
      name: 'VeChain',
      ticker: 'VET',
      price: 0.02,
      change_24hr: 0.9,
    },
    NEO: {
      name: 'Neo',
      ticker: 'NEO',
      price: 20,
      change_24hr: -0.5,
    },
    UNI: {
      name: 'Uniswap',
      ticker: 'UNI',
      price: 15,
      change_24hr: 1.8,
    },
    AAVE: {
      name: 'Aave',
      ticker: 'AAVE',
      price: 200,
      change_24hr: 0.5,
    },
    COMP: {
      name: 'Compound',
      ticker: 'COMP',
      price: 300,
      change_24hr: -0.7,
    },
    SNX: {
      name: 'Synthetix',
      ticker: 'SNX',
      price: 10,
      change_24hr: 0.2,
    },
  };

  // Check if the requested ticker exists
  if (!cryptoData[ticker]) {
    return res.status(404).json({ message: 'Crypto not found' });
  }

  // If ticker exists, respond with the crypto data
  res.status(200).json(cryptoData[ticker]);
};
