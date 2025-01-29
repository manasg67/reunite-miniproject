// import './App.css'
import { Outlet } from 'react-router-dom'
import AppRoutes from './routes.Jsx'
import Header from './components/Header'
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  const { t } = useTranslation();

  return (
    <>

      <div className='relative'>
        <Header />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    
      <AppRoutes />
    </>
  )
}

export default App
