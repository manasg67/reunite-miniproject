
// import './App.css'
import { Outlet } from 'react-router-dom'
import AppRoutes from './routes.Jsx'
import Header from './components/Header'

function App() {

  return (
    <>

      <div className='relative bg-gradient-to-b from-blue-100 to-white'>
        <Header />
        <main className="w-full bg-gradient-to-b from-blue-100 to-white text-black">
          <Outlet />
        </main>
      </div>
        
      <AppRoutes />
      {/* <Footer /> */}
    </>
  )
}

export default App
