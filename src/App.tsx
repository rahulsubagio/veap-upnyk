import { useState } from 'react'
import './App.css'
import logoGreenPyramid from './assets/logo-gp-n.png'
import photoGreenPyramid from './assets/green-house-pyramid.jpg'

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-white">
        {/* Navbar */}
        <div className='relative'>
          <nav className="fixed top-0 w-full flex justify-between items-center p-4 shadow-md bg-bgjo">
            {/* logo */}
            <a href='#' className='flex items-center'>
              <img src={logoGreenPyramid} alt="logo green pyramid" className='mr-1 h-8' />
              <div className='flex'>
                <h1 className="font-black text-2xl text-hijo mr-1">GREEN</h1>
                <h1 className="font-black text-2xl text-toska">PYRAMID</h1>
              </div>
            </a>
            {/* menu option md & lg */}
            <ul className='hidden font-semibold md:flex'>
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
            <div className='fixed top-16 w-full px-4 pb-4 shadow-md bg-bgjo md:hidden'>
              <ul className="pt-4 pb-2 px-6 font-semibold">
                <li className='border-b border-gray-300 mb-1 pb-1'>
                  <a href="#home" className="block py-2 hover:text-toska">Home</a>
                </li>
                <li className='border-b border-gray-300 mb-1 pb-1'>
                  <a href="#plantCare" className="block py-2 hover:text-toska">Plant Care</a>
                </li>
                <li className='border-b border-gray-300 mb-1 pb-1'>
                  <a href="#blog" className="block py-2 hover:text-toska">Blog</a>
                </li>
                <li className='border-b border-gray-300 mb-1 pb-1'>
                  <a href="#aboutUs" className="block py-2 hover:text-toska">About Us</a>
                </li>
                <li className='mt-6 text-center'>
                  <a href="#dashboardIoT" className='block py-2 px-4 rounded-lg outline-1 text-toska font-bold hover:bg-toska hover:text-white hover:outline-toska'>Dashboard IoT <span className="icon-[material-symbols--call-made-rounded]"></span></a>
                </li>
              </ul>
            </div>
          )}
        </div>
        {/* Navbar end */}

        {/* Hero section */}
        <section className='pt-22 px-6 flex flex-col justify-between bg-bgjo h-dvh'>
          <div className=''>
            <img src={photoGreenPyramid} alt="green pyramid photo" className='rounded-2xl -outline-offset-10 outline-3 outline-bgjo' />
          </div>
          <div className='text-center'>
            <h1 className='text-3xl font-bold'>Welcome to Green Pyramid</h1>
            <p className='mt-2 text-sm'>
              Green Pyramid is a modern agricultural facility that supports research and learning while implementing IoT technology to enhance crop cultivation efficiency.
            </p>
          </div>
        </section>
        {/* Hero section end */}
      </div>
    </>
  )
}

export default App
