import axios from 'axios';

export default async (req, res) => {
  try {
    const cryptoList = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=10&convert=USD&CMC_PRO_API_KEY=0dfccf0c-0787-4bce-82e2-e8144dc9ae2b`
    );

    res.status(200).json(cryptoList.data);
  } catch (error) {
    if (error.response.status === 429) {
      res.status(429).json({
        error: 'CoinGecko API servers are overloaded. Try again later.',
      });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Something went wrong with cryptocurrency list.' });
    }
  }
};
