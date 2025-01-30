import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { LogOut, UserCircle2, Menu, X, Search, Map, MessageSquare, FileText, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('role');

  const searchRoutes = [
    { path: '/search/by-name', icon: 'text', label: t('nav.search.by_name') },
    { path: '/search/by-aadhaar', icon: 'id-card', label: t('nav.search.by_aadhaar') },
    { path: '/search/by-face', icon: 'camera', label: t('nav.search.by_face') },
  ];

  const adminRoutes = [
    { path: '/admin', icon: <Settings className="w-4 h-4" />, label: t('nav.admin.dashboard') },
    { path: '/case-management', icon: <FileText className="w-4 h-4" />, label: t('nav.admin.case_management') },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const isAdmin = userRole === 'ADMIN' || userRole === 'LAW_ENFORCEMENT';

  return (
    <>
      {/* Drawer component - mobile */}
      <div className="drawer lg:hidden">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        
        <div className="drawer-content">
          {/* Mobile Navbar */}
          <div className="navbar fixed top-0 left-0 right-0 z-50 shadow-lg bg-white">
            <div className="flex-none lg:hidden">
              <label htmlFor="my-drawer" className="drawer-button">
                <Menu className="h-5 w-5" />
              </label>
            </div>
            
            <div className="flex-1">
              <Link to="/" className="btn btn-ghost text-xl">ReUnite</Link>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex gap-2">
              <div className='hidden lg:block'>
                <LanguageSwitcher />
              </div>
              
              {!isAuthenticated ? (
                <>
                  <button className='btn bg-blue-500' onClick={() => navigate('/login')}>
                    {t('nav.login')}
                  </button>
                  <button className='btn bg-blue-500' onClick={() => navigate('/register')}>
                    {t('nav.register')}
                  </button>
                </>
              ) : (
                <UserMenu handleLogout={handleLogout} t={t} isAdmin={isAdmin} />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Drawer Sidebar */}
        <div className="drawer-side z-50">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200">
            <div className='flex justify-between items-center mb-6'>
              <span className="text-2xl font-bold text-primary">ReUnite</span>
              <label htmlFor="my-drawer" className="btn btn-ghost btn-circle">
                <X className="h-6 w-6" />
              </label>
            </div>

            <NavLinks 
              searchRoutes={searchRoutes} 
              adminRoutes={adminRoutes}
              isAdmin={isAdmin}
              t={t} 
            />
          </ul>
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden lg:block">
        <div className="navbar fixed top-0 left-0 right-0 z-50 shadow-lg bg-white px-4">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost text-xl">ReUnite</Link>
            <NavLinks 
              searchRoutes={searchRoutes} 
              adminRoutes={adminRoutes}
              isAdmin={isAdmin}
              t={t} 
              isDesktop 
            />
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {!isAuthenticated ? (
              <div className="flex gap-2">
                <button className='btn bg-blue-500' onClick={() => navigate('/login')}>
                  {t('nav.login')}
                </button>
                <button className='btn bg-blue-500' onClick={() => navigate('/register')}>
                  {t('nav.register')}
                </button>
              </div>
            ) : (
              <UserMenu handleLogout={handleLogout} t={t} isAdmin={isAdmin} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const NavLinks = ({ searchRoutes, adminRoutes, isAdmin, t, isDesktop }) => {
  const location = useLocation();
  const baseClasses = isDesktop 
    ? "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
    : "flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition-colors";

  return (
    <nav className={isDesktop ? "flex items-center ml-8 space-x-2" : "flex flex-col space-y-2"}>
      {/* Search Dropdown */}
      <div className="dropdown dropdown-hover">
        <div tabIndex={0} className={`${baseClasses} ${location.pathname.includes('/search') ? 'bg-gray-100' : ''}`}>
          <Search className="w-5 h-5" />
          <span>{t('nav.search.title')}</span>
        </div>
        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          {searchRoutes.map((route) => (
            <li key={route.path}>
              <Link to={route.path} className="py-2">
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Map Link */}
      <Link 
        to="/missing-person-map" 
        className={`${baseClasses} ${location.pathname === '/missing-person-map' ? 'bg-gray-100' : ''}`}
      >
        <Map className="w-5 h-5" />
        <span>{t('nav.map')}</span>
      </Link>

      {/* Forum Link */}
      <Link 
        to="/public-forum" 
        className={`${baseClasses} ${location.pathname === '/public-forum' ? 'bg-gray-100' : ''}`}
      >
        <MessageSquare className="w-5 h-5" />
        <span>{t('nav.forum')}</span>
      </Link>

      {/* Admin Routes */}
      {isAdmin && adminRoutes.map((route) => (
        <Link
          key={route.path}
          to={route.path}
          className={`${baseClasses} ${location.pathname === route.path ? 'bg-gray-100' : ''}`}
        >
          {route.icon}
          <span>{route.label}</span>
        </Link>
      ))}
    </nav>
  );
};

const UserMenu = ({ handleLogout, t, isAdmin }) => (
  <div className="dropdown dropdown-end">
    <div 
      tabIndex={0} 
      role="button" 
      className="w-10 h-10 rounded-full bg-amber-300 border-2 border-amber-950 hover:bg-amber-200 flex items-center justify-center"
    >
      <UserCircle2 className='w-6 h-6 text-amber-950'/>
    </div>
    <ul className="menu dropdown-content mt-4 w-52 rounded-lg shadow-lg bg-base-100 border">
      <li>
        <Link to='/profile' className="py-3">
          <UserCircle2 className="w-4 h-4" />
          {t('nav.profile')}
        </Link>
      </li>
      <li>
        <Link to='/report-missing' className="py-3">
          {t('nav.report')}
        </Link>
      </li>
      <li>
        <Link to='/my-complains' className="py-3">
          {t('nav.my_complains')}
        </Link>
      </li>
      {isAdmin && (
        <>
          <li>
            <Link to='/admin' className="py-3">
              <Settings className="w-4 h-4" />
              {t('nav.admin.dashboard')}
            </Link>
          </li>
          <li>
            <Link to='/case-management' className="py-3">
              <FileText className="w-4 h-4" />
              {t('nav.admin.case_management')}
            </Link>
          </li>
        </>
      )}
      <li>
        <button onClick={handleLogout} className="py-3">
          <LogOut className="w-4 h-4" />
          {t('nav.logout')}
        </button>
      </li>
    </ul>
  </div>
);

export default Header;