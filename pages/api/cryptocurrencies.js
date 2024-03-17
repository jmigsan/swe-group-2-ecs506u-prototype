import axios from 'axios';

export default async (req, res) => {
  try {
    const cryptoList = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=gbp&per_page=10&precision=2`
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
