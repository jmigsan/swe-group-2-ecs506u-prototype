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
      price: 50000, // Example price, you can fetch real-time price here
      change_24hr: 0.05, // Example change, you can fetch real-time change here
    },
    ETH: {
      name: 'Ethereum',
      ticker: 'ETH',
      price: 2000, // Example price, you can fetch real-time price here
      change_24hr: -0.02, // Example change, you can fetch real-time change here
    },
    // Add more cryptocurrencies as needed
  };

  // Check if the requested ticker exists
  if (!cryptoData[ticker]) {
    return res.status(404).json({ message: 'Crypto not found' });
  }

  // If ticker exists, respond with the crypto data
  res.status(200).json(cryptoData[ticker]);
};
