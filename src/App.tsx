import { useState } from 'react'
import './App.css'
import logoGreenPyramid from "./assets/logo-gp-n.png"

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-white">
        {/* Navbar */}
        <nav className="flex justify-between items-center p-4 shadow-md">
          {/* logo */}
          <a href='#' className='flex items-center bg-oren'>
            <img src={logoGreenPyramid} alt="logo green pyramid" className='mr-1 h-8' />
            <div className='flex'>
              <h1 className="font-black text-2xl text-hijo mr-1">GREEN</h1>
              <h1 className="font-black text-2xl text-toska">PYRAMID</h1>
            </div>
          </a>
          {/* menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='text-toska text-3xl bg-oren'>
            {isOpen ? (
              <span className="icon-[material-symbols--menu-open-rounded]"></span>
              ) : (
              <span className="icon-[material-symbols--menu-rounded]"></span>
            )}
          </button>
        </nav>

        {/* menu option */}
        {isOpen && (
          <div className=''>
            <ul className="space-x-6 text-gray-700">
              <li className="hover:text-green-600 cursor-pointer">Home</li>
              <li className="hover:text-green-600 cursor-pointer">Plant Care</li>
              <li className="hover:text-green-600 cursor-pointer">About Us</li>
              <li className="hover:text-green-600 cursor-pointer">Blog</li>
            </ul>
          </div>
        )}

        
      </div>
    </>
  )
}

export default App
