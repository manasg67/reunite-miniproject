import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
// import { Button } from './ui/button';
// import { Button } from './ui/button';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="navbar fixed top-0 left-0 right-0 z-50 shadow-lg bg-base-100">
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
        <button className='btn btn-primary' onClick={() => navigate('/login')}>Login</button>
        <button className='btn bg-green-500' onClick={() => navigate('/register')}>Register</button>
      </div>
    </div>
  );
}

export default Header;