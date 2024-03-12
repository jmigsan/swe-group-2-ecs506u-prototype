// pages/api/cryptocurrencies.js

//this is all the cryptocurrencies on the page. this is just for use on the crypto list.
//when getting individual cryptocurrency data, theres another api endpoint for that. its supposed to be so that particular cryptocurrency has more data than just the list.
//and wouldnt be necessary to get entire list just for data of one crypto.

const cryptocurrencies = [
  { name: 'Bitcoin', ticker: 'BTC', price: 21000, '24hr-change': 0.1 },
  { name: 'Ethereum', ticker: 'ETH', price: 1000, '24hr-change': 1.0 },
  { name: 'Binance Coin', ticker: 'BNB', price: 2000, '24hr-change': 2.0 },
  { name: 'Ripple', ticker: 'XRP', price: 0.5, '24hr-change': -0.5 },
  { name: 'Litecoin', ticker: 'LTC', price: 150, '24hr-change': 0.3 },
  { name: 'Cardano', ticker: 'ADA', price: 1, '24hr-change': 0.8 },
  { name: 'Polkadot', ticker: 'DOT', price: 20, '24hr-change': -0.2 },
  { name: 'Chainlink', ticker: 'LINK', price: 30, '24hr-change': 0.7 },
  { name: 'Stellar', ticker: 'XLM', price: 0.4, '24hr-change': 0.4 },
  { name: 'Bitcoin Cash', ticker: 'BCH', price: 500, '24hr-change': -0.1 },
  { name: 'Dogecoin', ticker: 'DOGE', price: 0.01, '24hr-change': 2.5 },
  { name: 'EOS', ticker: 'EOS', price: 2.5, '24hr-change': -0.9 },
  { name: 'Monero', ticker: 'XMR', price: 150, '24hr-change': 1.2 },
  { name: 'Tron', ticker: 'TRX', price: 0.03, '24hr-change': 0.6 },
  { name: 'Tezos', ticker: 'XTZ', price: 2.2, '24hr-change': -0.3 },
  { name: 'VeChain', ticker: 'VET', price: 0.02, '24hr-change': 0.9 },
  { name: 'Neo', ticker: 'NEO', price: 20, '24hr-change': -0.5 },
  { name: 'Uniswap', ticker: 'UNI', price: 15, '24hr-change': 1.8 },
  { name: 'Aave', ticker: 'AAVE', price: 200, '24hr-change': 0.5 },
  { name: 'Compound', ticker: 'COMP', price: 300, '24hr-change': -0.7 },
  { name: 'Synthetix', ticker: 'SNX', price: 10, '24hr-change': 0.2 },
];

export default (req, res) => {
  res.status(200).json(cryptocurrencies);
};
