import Navbar from '@/components/Navbar/Navbar';
import '@/styles/globals.css';

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
};

export default App;
