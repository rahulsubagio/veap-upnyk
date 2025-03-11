import './App.css'

function App() {
  return (
    <>
      <div className="bg-white">
        {/* Navbar */}
        <nav className="flex justify-between items-center px-12 py-6 shadow-md">
          <h1 className="text-2xl font-bold text-toska">Naturo</h1>
          <ul className="hidden md:flex space-x-6 text-gray-700">
            <li className="hover:text-green-600 cursor-pointer">Home</li>
            <li className="hover:text-green-600 cursor-pointer">Plant Care</li>
            <li className="hover:text-green-600 cursor-pointer">About Us</li>
            <li className="hover:text-green-600 cursor-pointer">Blog</li>
          </ul>
          <button className="border border-green-600 text-green-600 px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition">
            IoT Dashboard
          </button>
        </nav>

        {/* Hero Section */}
        <section className="text-center mt-16 px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Create a Thriving Environment with Green Companions
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Plants reduce stress and improve your mood, so they are ideal for use at home and in the workplace.
          </p>
          <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition">
            Book a demo
          </button>
        </section>

        {/* Main Content */}
        <section className="flex flex-wrap justify-center items-center mt-12 px-6 md:px-16">
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-xs text-center">
            <h3 className="text-xl font-bold">100%</h3>
            <p className="text-sm mt-2">Satisfied clients</p>
          </div>

          <img
            src="https://source.unsplash.com/400x400/?plant,greenhouse"
            alt="Plant Care"
            className="rounded-lg shadow-lg mx-6 my-4 md:my-0"
          />

          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg max-w-xs text-center">
            <h3 className="text-xl font-bold">70%</h3>
            <p className="text-sm mt-2">People were convinced and improved their plant care</p>
          </div>
        </section>

        {/* Video Section */}
        <section className="text-center mt-12">
          <p className="text-gray-700">Useful video instructions for plant care</p>
          <div className="mt-4">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/5E0-QyzEJMg"
              title="YouTube video player"
              className="mx-auto rounded-lg shadow-lg"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      </div>
    </>
  )
}

export default App
