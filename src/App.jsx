
import './App.css'
import { Outlet } from 'react-router-dom'
import AppRoutes from './routes.Jsx'
import Header from './components/Header'

function App() {

  return (
    <>

      <div className='relative z-40'>
        <Header />
        <main className="flex-grow">
          <Outlet />
          {/* <Toaster position="top-right" richColors /> */}
        </main>
      </div>
      <AppRoutes />
      {/* <Footer /> */}
    </>
  )
}

export default App
