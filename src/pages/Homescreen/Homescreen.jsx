import { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import Navbar from '../../components/Navbar/Navbar'
import '../../assets/plant.jpg'
import '../../assets/sab.jpg'
import '../../assets/sabine.jpg'

export const Homescreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const images = [
    'src/assets/plant.jpg',
    'src/assets/sab.jpg',
    'src/assets/sabine.jpg',
  ]

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768)
    }

    // Initial check
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Clean up the event listener
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleNext()
    }
  }

  return (
    <>
      <Navbar />
      <div className='flex flex-col min-h-screen bg-stone-200'>
        <div className='flex flex-col md:flex-row items-center justify-center min-h-screen p-4'>
          <div className='flex flex-col md:flex-row bg-stone-300 p-8 md:p-16 rounded-xl shadow-xl justify-center space-y-4 md:space-y-0 md:space-x-8'>
            {/* Left Side - Hidden on small screens */}
            <div className='hidden md:flex flex-col justify-center items-center gap-4'>
              {images.map((src, index) => (
                <div
                  key={index}
                  className='group border bg-white rounded-lg p-4 md:p-6 border-solid'
                >
                  <img
                    src={src}
                    alt={`Content ${index + 1}`}
                    className='w-40 md:w-80 p-2 grayscale rounded-lg shadow-xl group-hover:transform group-hover:scale-110 transition-transform'
                  />
                </div>
              ))}
            </div>
            {/* Right Side - Swipeable and Clickable only on small screens */}
            <div
              {...(isSmallScreen ? handlers : {})}
              className='group border bg-white rounded-lg p-4 md:p-6 border-solid relative md:static flex items-center justify-center'
            >
              <div
                onClick={isSmallScreen ? handleNext : null}
                onKeyPress={isSmallScreen ? handleKeyPress : null}
                tabIndex={isSmallScreen ? 0 : -1}
                role={isSmallScreen ? 'button' : undefined}
                className={`${
                  isSmallScreen ? 'cursor-pointer outline-none' : ''
                } flex justify-center items-center`}
              >
                <img
                  src={images[currentIndex]}
                  alt={`Content ${currentIndex + 1}`}
                  className='object-cover w-full h-72 md:h-auto md:w-full rounded-lg shadow-xl group-hover:transform group-hover:scale-110 transition-transform'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
