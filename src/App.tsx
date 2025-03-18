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
            {/* menu option md & lg */}
            <ul className='hidden text-gray-700 font-semibold md:flex'>
              <li>
                <a href="#home" className='mx-2 hover:text-toska'>Home</a>
              </li>
              <li>
                <a href="#plantCare" className='mx-2 hover:text-toska'>Plant Care</a>
              </li>
              <li>
                <a href="#blog" className='mx-2 hover:text-toska'>Blog</a>
              </li>
              <li>
                <a href="#aboutUs" className='mx-2 hover:text-toska'>Abaout Us</a>
              </li>
            </ul>
            <button className='hidden md:block'>
              <a href="#dashboardIoT" className='bg-toska text-white font-semibold py-2 px-3 rounded-md hover:bg-teal-500'>Dashboard IoT <span className="icon-[material-symbols--call-made-rounded]"></span></a>
            </button>
            {/* menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='flex items-center text-toska text-3xl rounded p-0.5 hover:outline-1 md:hidden'>
              {isOpen ? (
                <span className="icon-[material-symbols--menu-open-rounded]"></span>
                ) : (
                <span className="icon-[material-symbols--menu-rounded]"></span>
              )}
            </button>
            {/* menu button end */}
          </nav>

          {/* menu option */}
          {isOpen && (
            <div className='fixed top-16 w-full px-4 pb-4 shadow-md bg-white md:hidden'>
              <div className='p-4 rounded-lg bg-gray-200'>
                <ul className="text-gray-700 font-semibold">
                  <li className='mb-1'>
                    <a href="#home" className="block py-2 px-3 cursor-pointer rounded hover:bg-toska hover:text-white">Home</a>
                  </li>
                  <li className='my-1'>
                    <a href="#plantCare" className="block py-2 px-3 cursor-pointer rounded hover:bg-toska hover:text-white">Plant Care</a>
                  </li>
                  <li className='my-1'>
                    <a href="#blog" className="block py-2 px-3 cursor-pointer rounded hover:bg-toska hover:text-white">Blog</a>
                  </li>
                  <li className='my-1'>
                    <a href="#aboutUs" className="block py-2 px-3 cursor-pointer rounded hover:bg-toska hover:text-white">About Us</a>
                  </li>
                  <li className='border-t border-gray-400 mt-2 pt-2'>
                    <a href="#dashboardIoT" className='block py-2 px-3 cursor-pointer rounded text-toska font-bold hover:text-teal-500'>Dashboard IoT <span className="icon-[material-symbols--call-made-rounded]"></span></a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        {/* Navbar end */}

        {/* Hero section */}

        {/* Hero section end */}
      </div>
    </>
  )
}

export default App
