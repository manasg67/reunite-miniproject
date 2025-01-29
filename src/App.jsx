
// import './App.css'
import { Outlet } from 'react-router-dom'
import AppRoutes from './routes.Jsx'
import Header from './components/Header'

function App() {

  return (
    <>

      <div className=''>
        <Header />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
        {/* <h1 className="text-3xl text-red-500 font-bold underline">
      Hello world!
    </h1> */}
      <AppRoutes />
      {/* <Footer /> */}
    </>
  )
}

export default App
