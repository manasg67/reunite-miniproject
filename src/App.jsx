
import './App.css'
import { Outlet } from 'react-router-dom'
import AppRoutes from './routes.Jsx'
import Header from './components/Header'

function App() {

  return (
    <>

      {/* <div className='relative z-40 text-red-500'>
        <Header />
        <main className="flex-grow">
          <Outlet />
          
        </main>
      </div> */}
        <h1 className="text-3xl text-red-500 font-bold underline">
      Hello world!
    </h1>
      {/* <AppRoutes /> */}
      {/* <Footer /> */}
    </>
  )
}

export default App
