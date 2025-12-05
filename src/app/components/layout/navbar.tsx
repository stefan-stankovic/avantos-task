import { Link } from 'react-router';

export const Navbar = () => {
  return (
    <nav className='bg-[#f3b735] border-b border-b-primary inset-0 w-full sticky flex items-center justify-between px-6 lg:px-8 py-3'>
      <Link to='/'>Avantos Task</Link>
    </nav>
  );
};
