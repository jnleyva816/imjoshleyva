import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='fixed top-0 left-0 w-full bg-stone-200 shadow-md z-50'>
      <div className='flex justify-between items-center p-4 px-16'>
        <div className='text-xl font-bold text-stone-700'>
          <Link to='/'>Joshua Leyva</Link>
        </div>
        <div className='md:hidden'>
          <button onClick={toggleMenu} className='text-stone-700'>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        <div className='hidden md:flex space-x-6 text-black'>
          <Link className='hover:text-stone-600' to='/home'>
            Home
          </Link>
          <Link className='hover:text-stone-600' to='/blog'>
            Blog
          </Link>
          <Link className='hover:text-stone-600' to='/about'>
            About
          </Link>
          <Link className='hover:text-stone-600' to='/gallery'>
            Gallery
          </Link>
          <Link className='hover:text-stone-600' to='/contact'>
            Contact
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className='md:hidden flex flex-col items-center bg-stone-200 py-4 space-y-4 absolute top-16 right-0 w-3/4 h-screen shadow-lg'>
          <Link
            onClick={toggleMenu}
            className='hover:text-stone-600'
            to='/home'
          >
            Home
          </Link>
          <Link
            onClick={toggleMenu}
            className='hover:text-stone-600'
            to='/blog'
          >
            Blog
          </Link>
          <Link
            onClick={toggleMenu}
            className='hover:text-stone-600'
            to='/about'
          >
            About
          </Link>
          <Link
            onClick={toggleMenu}
            className='hover:text-stone-600'
            to='/gallery'
          >
            Gallery
          </Link>
          <Link
            onClick={toggleMenu}
            className='hover:text-stone-600'
            to='/contact'
          >
            Contact
          </Link>
        </div>
      )}
    </div>
  )
}

export default Navbar
