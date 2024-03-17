import axios from 'axios';

export default async (req, res) => {
  const { coinId } = req.query;

  try {
    const cryptoData = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=gbp&ids=${coinId}&precision=2`
    );

    res.status(200).json(cryptoData.data);
  } catch (error) {
    console.error(error);
    if (error.response.status === 429) {
      res.status(429).json({
        error: 'CoinGecko API servers are overloaded. Try again later.',
      });
    } else {
      res.status(500).json({
        error: 'Something went wrong with the individual cryptocurrency data.',
      });
    }
  }
};
