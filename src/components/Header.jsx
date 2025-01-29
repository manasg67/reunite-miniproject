import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { LogOut, UserCircle2 } from 'lucide-react';
// import { Button } from './ui/button';
// import { Button } from './ui/button';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('accessToken'); // Check if user is authenticated

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <div className="navbar fixed top-0 left-0 right-0 z-50 shadow-lg bg-white">
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">ReUnite</a>
      </div>
      <div className="flex gap-2">
        <LanguageSwitcher />
        
        {!isAuthenticated ? (
          <>
            <button className='btn btn-primary' onClick={() => navigate('/login')}>Login</button>
            <button className='btn bg-green-500' onClick={() => navigate('/register')}>Register</button>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="w-10 sm:w-12 h-10 sm:h-12 flex justify-center items-center rounded-full p-0 px-5 sm:px-1 bg-amber-300 border-2 border-amber-950 hover:bg-amber-200">
              <div className="w-10 rounded-full">
                <UserCircle2 className='w-5 sm:w-9 h-5 sm:h-9 text-amber-950'/>
              </div>
            </div>
            <ul tabIndex={0} className="menu dropdown-content backdrop-blur-sm bg-[url('/vintage.jpg')] bg-cover bg-center bg-opacity-70 border text-[#4a3728] border-[#8b4513] rounded-box z-[1] mt-4 w-52 p-2 shadow">
              <div className='px-2 py-2'><Link to='/profile' className='flex gap-2 items-center w-full'><UserCircle2/> Profile</Link></div>
              <hr className='border-amber-900'/>
              <div className='px-2 py-2'><Link to='/report-missing' className='text-foreground flex gap-2 items-center w-full'>Report</Link></div>
              <hr className='border-amber-900'/>
              <div className='px-2 py-2'><Link to='/my-complains' className='text-foreground flex gap-2 items-center w-full'>My Complains</Link></div>
              <hr className='border-amber-900'/>
              <div className='px-2 py-2' onClick={handleLogout}>
                <a className='flex items-center gap-2 px-2'><LogOut/>Logout</a>
              </div>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;