import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
      <div>Novatrade</div>
      <Link href={'/'}>
        <button>Home</button>
      </Link>
      <Link href={'/inexperienced'}>
        <button>Inexperienced Trader</button>
      </Link>
    </nav>
  );
};
export default Navbar;
