import { useState } from 'react'
import './App.css'
import logoGreenPyramid from "./assets/logo-gp-n.png"

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-white">
        {/* Navbar */}
        <div className='relative'>
          <nav className="fixed top-0 w-full flex justify-between items-center p-4 shadow-md bg-white">
            {/* logo */}
            <a href='#' className='flex items-center'>
              <img src={logoGreenPyramid} alt="logo green pyramid" className='mr-1 h-8' />
              <div className='flex'>
                <h1 className="font-black text-2xl text-hijo mr-1">GREEN</h1>
                <h1 className="font-black text-2xl text-toska">PYRAMID</h1>
              </div>
            </a>
            {/* menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='flex items-center text-toska text-3xl rounded p-0.5 hover:outline-1'>
              {isOpen ? (
                <span className="icon-[material-symbols--menu-open-rounded]"></span>
                ) : (
                <span className="icon-[material-symbols--menu-rounded]"></span>
              )}
            </button>
          </nav>

          {/* menu option */}
          {isOpen && (
            <div className='fixed top-16 w-full px-4 pb-4 shadow-md bg-white'>
              <div className='p-4 rounded-lg bg-gray-200'>
                <ul className="text-black font-semibold">
                  <li>
                    <a href="#home" className="block py-2 px-3 cursor-pointer rounded hover:bg-toska hover:text-white">Home</a>
                  </li>
                  <li>
                    <a href="#plantCare" className="block py-2 px-3 cursor-pointer rounded hover:bg-toska hover:text-white">Plant Care</a>
                  </li>
                  <li>
                    <a href="#aboutUs" className="block py-2 px-3 cursor-pointer rounded hover:bg-toska hover:text-white">About Us</a>
                  </li>
                  <li>
                    <a href="#blog" className="block py-2 px-3 cursor-pointer rounded hover:bg-toska hover:text-white">Blog</a>
                  </li>
                  <li>
                    <a href="#dashboardIoT" className='block py-2 px-3 cursor-pointer rounded bg-toska text-white hover:bg-hijo'>Dashboard IoT</a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
