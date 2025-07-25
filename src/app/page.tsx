"use client"; // Diperlukan untuk hook seperti useState pada komponen Header

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Menu, Leaf, FlaskConical, BookOpen, ArrowBigRightDash,
  BarChart2, MapPin, Clock, Mail, Instagram, Youtube, Facebook, LayoutGrid 
} from 'lucide-react';
import { TextAnimate } from "@veap/components/magicui/text-animate";
import Link from 'next/link';
import { BlurFade } from '@veap/components/magicui/blur-fade';

const navLinks = [
  { href: "#tentang", label: "About" },
  { href: "#koleksi", label: "Collection" },
  { href: "#iot", label: "IoT Dashboard" },
  { href: "#kunjungan", label: "Visit" },
];

const featureCards = [
  {
    icon: <Leaf className="w-10 h-10 text-blue-500" />,
    title: "Conservation",
    description: "Preserving rare and local plant species as part of Indonesia's biodiversity heritage.",
  },
  {
    icon: <FlaskConical className="w-10 h-10 text-blue-500" />,
    title: "Innovative Research",
    description: "Modern facilities for research in biotechnology, precision agriculture, and horticulture.",
  },
  {
    icon: <BookOpen className="w-10 h-10 text-blue-500" />,
    title: "Education",
    description: "An interactive learning resource for students, academics, and the general public.",
  },
];

const plantCollections = [
  {
    imgSrc: "/images/tanaman-hias.jpg",
    title: "Orchids & Ornamental Plants",
    description: "A stunning collection of monthly orchids, Vanda, and exotic ornamental plants with unique beauty.",
  },
  {
    imgSrc: "/images/kaktus.jpg",
    title: "Cacti & Succulents",
    description: "Extraordinary adaptation of desert plants, with various shapes and sizes, adding charm to your collection.",
  },
  {
    imgSrc: "/images/tanaman-herbal.jpg",
    title: "Medicinal & Herbal Plants",
    description: "Explore our living pharmacy, rich in plants that offer health benefits and support traditional healing.",
  },
  {
    imgSrc: "/images/hidroponik.jpg",
    title: "Hydroponics",
    description: "Urban farming innovations to support the sustainability and resilience of future food sources.",
  },
];

// --- UI Component ---
const Header = ({ activeSection }: { activeSection: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
  }`;

  return (
    <header id='header' className={headerClasses}>
      <div className="container md:px-20 mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold flex items-center gap-2">
          <Image src="/images/TEAM.png" alt="logo green pyramid" width={100} height={50} />
        </a>
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={`transition duration-300 py-2 relative ${
              activeSection === link.href.substring(1)
                ? 'text-blue-900 font-bold'
                : 'text-gray-600 hover:text-blue-900'
            }`}>
              {link.label}
              {activeSection === link.href.substring(1) && (
                <span className="absolute left-1/2 -bottom-1 h-[2px] w-3/5 -translate-x-1/2 rounded-full bg-blue-900"></span>
              )}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a href="/dashboard" id="portal" className="hidden lg:flex bg-blue-900 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition duration-300 shadow-md items-center gap-2">
            <BarChart2 className="w-5 h-5" />
            <span>Access IoT Dashboard</span>
          </a>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-blue-200">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden md:px-20 px-6 pb-4">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="block py-2 text-gray-600 hover:text-blue-900" onClick={() => setIsMenuOpen(false)}>{link.label}</a>
          ))}
          <a href="/dashboard" id="portal" className="lg:hidden flex bg-blue-900 text-white px-5 py-2.5 my-2 rounded-lg font-semibold hover:bg-blue-800 transition duration-300 shadow-md items-center gap-2">
            <BarChart2 className="w-5 h-5" />
            <span>Access IoT Dashboard</span>
          </a>
        </div>
      )}
    </header>
  );
};

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    const sections = document.querySelectorAll('main > section[id]');
    sections.forEach((section) => {
      if (observer.current) {
          observer.current.observe(section);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (observer.current) {
            observer.current.unobserve(section);
        }
      });
    };
  }, []);

  return (
    <div className='bg-gray-50 text-gray-800'>
      <Header activeSection={activeSection}/>
      <main className=''>

        {/* Hero Section */}
        <section id='hero' className='min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex items-center'>
          <div className='container md:px-28 mx-auto px-6 grid md:grid-cols-2 gap-10 items-center pt-24 md:pt-0'>
            {/* Left Column: Text Content */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-900 leading-tight">
                <TextAnimate animation="blurInUp" by="word" once>
                  Veteran Education Agro Park
                </TextAnimate>
              </h1>
              <div className='mt-6 text-lg text-gray-600 max-w-lg mx-auto md:mx-0'>
                <p className='font-extrabold'>Where Innovation Meets Agriculture.</p>
                <p className='mt-1.5'>
                  Discover the future of agriculture at the VEAP, a place where nature and technology come together.
                </p>
              </div>
              <div className="mt-10 flex justify-center md:justify-start items-center gap-4">
                <a href="#koleksi" className="bg-blue-900 text-white px-7 py-3 rounded-lg font-bold hover:bg-blue-800 transition duration-300 shadow-lg flex items-center gap-4">
                  Start Exploring <ArrowBigRightDash />
                </a>
              </div>
            </div>
            {/* Right Column: Image with Graphics */}
            <div className="relative h-full flex justify-center items-center">
              <svg className="absolute w-sm h-full text-blue-100 opacity-70 -z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M52.6,-66.9C67.2,-56.3,77.4,-40.4,81.1,-23.3C84.8,-6.3,82,12.1,73.8,27.2C65.5,42.3,51.8,54.1,36.9,64.1C21.9,74.1,5.8,82.4,-10.8,83.1C-27.4,83.9,-44.5,77.1,-58.4,65.8C-72.3,54.5,-83,38.7,-86.8,22C-90.5,5.3,-87.3,-12.3,-78.4,-26.8C-69.5,-41.3,-55,-52.7,-40.1,-63C-25.2,-73.4,-10,-82.7,5.5,-85.5C21.1,-88.3,42.1,-85.1,52.6,-66.9Z" transform="translate(100 100)"></path>
              </svg>
              {/* <div className="absolute h-[500px] w-full overflow-hidden">
                <Ripple />
              </div> */}
              <div className="relative z-10 transform transition-transform duration-500 hover:scale-105">
                <BlurFade direction='down' delay={0.25}>
                  <Image src="/images/green-house-pyramid-isometric2-removebg-preview.png" width={450} height={450} alt="gambar green house vektor" data-aos="fade-down" className='rounded-b-full' />
                </BlurFade>
              </div>
              <div className="absolute top-10 right-5 text-blue-200 -z-0" style={{ fontSize: '3rem', lineHeight: 0.5 }}>...<br/>...<br/>...<br/>...</div>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section id='tentang' className='py-20'>
          <div className='container md:px-28 mx-auto px-6'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-800'>Living Laboratory for a Green Future</h2>
              <p className='mt-4 max-w-2xl mx-auto text-gray-600'>VEAP are dedicated to fostering a sustainable and innovative agricultural ecosystem that serves both as an educational hub and a demonstration of precision farming.</p>
            </div>
            <div className='grid md:grid-cols-3 gap-5 text-center'>
              {featureCards.map((feature, index) => 
                <div key={index} className='p-6' data-aos="zoom-in">
                  <div className='flex justify-center items-center mb-4'>
                    <div className='bg-blue-100 p-4 rounded-full'>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
                  <p className='text-gray-600'>{feature.description}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Collection Section */}
        <section id='koleksi' className='py-20 bg-gray-100'>
          <div className='container md:px-28 mx-auto px-6'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-800'>Explore Our Rich Flora Collection</h2>
              <p className='mt-4 max-w-2xl mx-auto text-gray-600'>Discover the diverse categories of plants that we nurture and research at VEAP.</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8' data-aos="zoom-in-up">
              {plantCollections.map((collection, index) => 
                <div key={index} className='g-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition duration-300 group'>
                  <div className='relative w-full h-48'>
                    <Image src={collection.imgSrc} layout="fill" objectFit="cover" alt={collection.title} />
                  </div>
                  <div className='p-6'>
                    <h3 className='text-xl font-semibold'>{collection.title}</h3>
                    <p className='mt-2 text-gray-600 text-sm'>{collection.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* IoT Section */}
        <section id='iot' className='py-20'>
          <div className='container md:px-28 mx-auto px-6'>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left" data-aos="fade-right">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Monitor Growth in Real-Time</h2>
                <p className="mt-4 text-gray-600">Access our IoT Dashboard to monitor vital data such as temperature, humidity, light, and nutrients in real-time, from anywhere.</p>
                <Link href="/dashboard" id="portal" className="mt-8 mx-auto md:mx-0 bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition duration-300 shadow-lg flex items-center gap-2 w-fit">
                    <BarChart2 className="w-5 h-5" />
                    Access IoT Dashboard
                </Link>
              </div>
              <div data-aos="fade-left">
                <div className="relative w-full h-80 rounded-lg shadow-xl overflow-hidden transform transition-transform duration-500 hover:scale-105">
                  <Image src="/images/green-pyramid-dash.png" layout="fill" objectFit="cover" alt="[Ilustrasi Dashboard IoT]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visit Section */}
        <section id='kunjungan' className='py-20 bg-gray-100'>
          <div className="container md:px-28 mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Interested in Visiting?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600">We are open for educational visits! Check out our location and operational hours below.</p>
            <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white p-6 rounded-lg shadow-md" data-aos="flip-down">
                <MapPin className="w-8 h-8 text-blue-500 mb-3" />
                <h4 className="font-semibold text-lg">Location</h4>
                <p className="text-gray-600">Campus 1, UPN Veteran Yogyakarta</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md" data-aos="flip-down">
                <Clock className="w-8 h-8 text-blue-500 mb-3" />
                <h4 className="font-semibold text-lg">Opening Hours</h4>
                <p className="text-gray-600">Monday - Friday (09:00 - 15:00)<br />Open to the public (with prior reservation)</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md" data-aos="flip-down">
                <Mail className="w-8 h-8 text-blue-500 mb-3" />
                <h4 className="font-semibold text-lg">Contact</h4>
                <p className="text-gray-600">For research and collaborations:<br /><a href="https://api.whatsapp.com/send?phone=6281575777564" className="text-blue-500 hover:underline">+62 815-7577-7564</a></p>
              </div>
            </div>
            <div className="mt-12 rounded-lg overflow-hidden shadow-xl" data-aos="fade-up">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15813.039808560325!2d110.39125435541989!3d-7.762232499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a599a0272fccd%3A0x39e7804d39e1d0a!2sUniversitas%20Pembangunan%20Nasional%20Veteran%20Yogyakarta!5e0!3m2!1sid!2sid!4v1750016585528!5m2!1sid!2sid" 
                width="100%" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white">
          <div className="container md:px-28 mx-auto px-6 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                  <h3 className="text-xl font-semibold">Veteran Edu Agro Park</h3>
                  <p className="mt-2 text-gray-400">Innovating, Conserving, and Educating.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold">Navigation</h4>
                <ul className="mt-2 space-y-2">
                  {navLinks.map((link) => (
                      <li key={link.href}><a href={link.href} className="text-gray-400 hover:text-white">{link.label}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold">Stay Connected with Us</h4>
                <p className='mt-2 text-gray-400'>Follow us on social media to stay updated!</p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white"><Instagram className="w-6 h-6" /></a>
                  <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-white"><Youtube className="w-6 h-6" /></a>
                  <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white"><Facebook className="w-6 h-6" /></a>
                </div>
              </div>
            </div>
            <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500">
              <p>&copy; {new Date().getFullYear()} VEAP | Veteran Education Agro Park <br />All Rights Reserved</p>
            </div>
          </div>
        </footer>
        <div className="group fixed bottom-8 right-8 z-50">
          <Link 
            href="/dashboard" 
            title="Go to Dashboard Portal"
            className="bg-blue-900 text-white p-4 rounded-full shadow-lg group-hover:bg-blue-800 transition-all duration-300 group-hover:scale-110 flex items-center justify-center"
          >
            <LayoutGrid className="w-6 h-6" />
          </Link>
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-gray-700 text-white text-sm rounded-md shadow-lg px-3 py-1.5 whitespace-nowrap">
              Access IoT Dashboard
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
