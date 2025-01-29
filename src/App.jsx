
// import './App.css'
import { Outlet } from 'react-router-dom'
import AppRoutes from './routes.Jsx'
import Header from './components/Header'

function App() {

  return (
    <>

      <div className='relative'>
        <Header />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
        
      <AppRoutes />
      {/* <Footer /> */}
    </>
  )
}

export default App
