import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { LogOut, UserCircle2, Menu, X } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user'));
  

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      {/* Drawer component - only visible on mobile */}
      <div className="drawer lg:hidden">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        
        <div className="drawer-content">
          {/* Navbar */}
          <div className="navbar fixed top-0 left-0 right-0 z-50 shadow-lg bg-white">
            <div className="flex-none lg:hidden">
              <label htmlFor="my-drawer" className=" drawer-button">
                <Menu className="h-5 w-5" />
              </label>
            </div>
            
            <div className="flex-1">
              <a className="btn btn-ghost text-xl" onClick={() => navigate('/')}>
                ReUnite
              </a>
            </div>

            <div className="flex gap-2">
            <div className='hidden lg:block'>

<LanguageSwitcher />
</div>
              
              {!isAuthenticated ? (
                <>
                  <button className='btn btn-primary' onClick={() => navigate('/login')}>Login</button>
                  <button className='btn bg-green-500' onClick={() => navigate('/register')}>Register</button>
                </>
              ) : (
                <div className="dropdown dropdown-end">
                  <div 
                    tabIndex={0} 
                    role="button" 
                    className="w-10 sm:w-12 h-10 sm:h-12 flex justify-center items-center rounded-full p-0 px-5 sm:px-1 bg-amber-300 border-2 border-amber-950 hover:bg-amber-200"
                  >
                    <div className="w-10 rounded-full">
                      <UserCircle2 className='w-5 sm:w-9 h-5 sm:h-9 text-amber-950'/>
                    </div>
                  </div>
                  <ul tabIndex={0} className="menu dropdown-content backdrop-blur-sm bg-[url('/vintage.jpg')] bg-cover bg-center bg-opacity-70 border text-[#4a3728] border-[#8b4513] rounded-box z-[1] mt-4 w-52 p-2 shadow">
                    <div className='px-2 py-2'>
                      <Link to='/profile' className='flex gap-2 items-center w-full'>
                        <UserCircle2/> Profile
                      </Link>
                    </div>
                    <hr className='border-amber-900'/>
                    <div className='px-2 py-2'>
                      <Link to='/report-missing' className='text-foreground flex gap-2 items-center w-full'>
                        Report
                      </Link>
                    </div>
                    <hr className='border-amber-900'/>
                    <div className='px-2 py-2'>
                      <Link to='/my-complains' className='text-foreground flex gap-2 items-center w-full'>
                        My Complains
                      </Link>
                    </div>
                    <hr className='border-amber-900'/>
                    <div className='px-2 py-2' onClick={handleLogout}>
                      <a className='flex items-center gap-2 px-2'>
                        <LogOut/>Logout
                      </a>
                    </div>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drawer sidebar */}
        <div className="drawer-side z-50 absolute ">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-64 min-h-full bg-base-200 rounded-xl">
            <div className='flex justify-between items-center text-3xl pr-5 text-[#8b4513]'>
              <span>ReUnite</span>
              <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
                <X className="h-6 w-6" />
              </label>
            </div>
            <li className='px-2 py-2'><Link to='/' className="text-lg">Home</Link></li>
            <hr className='border-amber-900'/>
            {/* <li><Link to='/about' className="text-lg">M</Link></li> */}
            <div className='px-2 py-2'><LanguageSwitcher /></div>
            <hr className='border-amber-900'/>
            <li className='px-2 py-2'><Link to='/report-missing' className="text-lg">Report</Link></li>
            {user.role === 'admin' && (
              <>
                <hr className='border-amber-900'/>
                <li className='px-2 py-2'><Link to='/admin' className="text-lg">Admin Dashboard</Link></li>
                <hr className='border-amber-900'/>
                <li className='px-2 py-2'><Link to='/case-management' className="text-lg">Case Management</Link></li>
                
              </>
            )
            }
            <hr className='border-amber-900'/>
            <li className='px-2 py-2'><Link to='/my-complains' className="text-lg">My Complains</Link></li>
          </ul>
        </div>
      </div>

      {/* Desktop navbar - only visible on desktop */}
      <div className="hidden lg:block ">
        <div className="navbar fixed top-0 left-0 right-0 z-50 shadow-lg bg-white">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl" onClick={() => navigate('/')}>
              ReUnite
            </a>
            {/* <ul className="menu menu-horizontal px-1">
              <li><Link to='/' onClick={() => {document.getElementById('my-drawer-3').click()}}>Home</Link></li>
              <li><Link to='/about' onClick={() => {document.getElementById('my-drawer-3').click()}}>About</Link></li>
              <li><Link to='/contact' onClick={() => {document.getElementById('my-drawer-3').click()}}>Contact</Link></li>
            </ul> */}
          </div>

          <div className="flex gap-2">
            <div className='hidden lg:block'>

            <LanguageSwitcher />
            </div>
            
            {!isAuthenticated ? (
              <>
                <button className='btn btn-primary' onClick={() => navigate('/login')}>Login</button>
                <button className='btn bg-green-500' onClick={() => navigate('/register')}>Register</button>
              </>
            ) : (
              <div className="dropdown dropdown-end">
                <div 
                  tabIndex={0} 
                  role="button" 
                  className="w-10 sm:w-12 h-10 sm:h-12 flex justify-center items-center rounded-full p-0 px-5 sm:px-1 bg-amber-300 border-2 border-amber-950 hover:bg-amber-200"
                >
                  <div className="w-10 rounded-full">
                    <UserCircle2 className='w-5 sm:w-9 h-5 sm:h-9 text-amber-950'/>
                  </div>
                </div>
                <ul tabIndex={0} className="menu dropdown-content backdrop-blur-sm bg-[url('/vintage.jpg')] bg-cover bg-center bg-opacity-70 border text-[#4a3728] border-[#8b4513] rounded-box z-[1] mt-4 w-52 p-2 shadow">
                  <div className='px-2 py-2'>
                    <Link to='/profile' className='flex gap-2 items-center w-full'>
                      <UserCircle2/> Profile
                    </Link>
                  </div>
                  <hr className='border-amber-900'/>
                  <div className='px-2 py-2'>
                    <Link to='/report-missing' className='text-foreground flex gap-2 items-center w-full'>
                      Report
                    </Link>
                  </div>
                  <hr className='border-amber-900'/>
                  <div className='px-2 py-2'>
                    <Link to='/my-complains' className='text-foreground flex gap-2 items-center w-full'>
                      My Complains
                    </Link>
                  </div>
                  <hr className='border-amber-900'/>
                  <div className='px-2 py-2' onClick={handleLogout}>
                    <a className='flex items-center gap-2 px-2'>
                      <LogOut/>Logout
                    </a>
                  </div>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;