import { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Popup from '../../components/Popup/Popup'
import {
  FaGraduationCap,
  FaBriefcase,
  FaCode,
  FaProjectDiagram,
} from 'react-icons/fa'

export const About = () => {
  const [openPopup, setOpenPopup] = useState(null)

  const togglePopup = (section) => {
    setOpenPopup(openPopup === section ? null : section)
  }

  return (
    <div className='min-h-screen bg-stone-200 flex flex-col items-center'>
      {/* Navbar */}
      <Navbar />

      {/* About Me Section */}
      <section className='w-full max-w-4xl mx-auto p-8 bg-stone-200 shadow-lg rounded-lg mb-8 mt-16'>
        <div className='w-full'>
          <img
            src='https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fG11c2ljJTJHYXJ0JTJHZ29sZnxlbnwwfHx8fDE2NjI0NjM4Mzg&ixlib=rb-1.2.1&q=80&w=1080'
            alt='Music, Art, Golf, and Landscapes'
            className='w-full h-64 object-cover rounded-t-lg'
          />
        </div>
        <div className='p-8 text-center'>
          <h2 className='text-4xl font-bold mb-4'>About Me 🎉</h2>
          <p className='text-lg'>
            Hi, I&apos;m Josh! A passionate Full Stack Engineer and Software
            Developer with a love for frontend engineering. I thrive on creating
            seamless and efficient user experiences through innovative designs
            and cutting-edge technologies.
          </p>
          <p className='text-lg mt-4'>
            Outside of coding, I enjoy 🎶 music, 🎨 art, 🏌️‍♂️ golf, and exploring
            beautiful landscapes. These hobbies fuel my creativity and inspire
            me to build interactive, visually appealing web applications.
          </p>
        </div>
      </section>

      {/* Interactive Titles Section */}
      <section className='w-full max-w-4xl mx-auto p-8 bg-stone-200 shadow-lg rounded-lg'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div className='relative'>
            <button
              className='flex items-center justify-center text-lg bg-stone-300 p-4 rounded-full shadow-md hover:bg-stone-400 transition-all'
              onClick={() => togglePopup('education')}
              style={{ width: '100%', height: '60px' }}
            >
              <FaGraduationCap className='mr-2' /> Education
            </button>
            <Popup
              isOpen={openPopup === 'education'}
              onClose={() => setOpenPopup(null)}
              title='Education'
              imageUrl='https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDZ8fGVkdWNhdGlvbnxlbnwwfHx8fDE2NjI0NjUyMzE&ixlib=rb-1.2.1&q=80&w=1080'
            >
              <p>
                🎓 Bachelor&apos;s Degree in Computer Science from XYZ
                University. Specialized in Software Engineering and Full Stack
                Development.
              </p>
            </Popup>
          </div>

          <div className='relative'>
            <button
              className='flex items-center justify-center text-lg bg-stone-300 p-4 rounded-full shadow-md hover:bg-stone-400 transition-all'
              onClick={() => togglePopup('experience')}
              style={{ width: '100%', height: '60px' }}
            >
              <FaBriefcase className='mr-2' /> Experience
            </button>
            <Popup
              isOpen={openPopup === 'experience'}
              onClose={() => setOpenPopup(null)}
              title='Experience'
              imageUrl='https://images.unsplash.com/photo-1536323760109-ca8b8f9a7fda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGV4cGVyaWVuY2V8ZW58MHx8fHwxNjYyNDY1MzA4&ixlib=rb-1.2.1&q=80&w=1080'
            >
              <p>
                🛠️ 5+ years as a Full Stack Developer, building web apps and
                working with technologies like React, Node.js, and more.
              </p>
            </Popup>
          </div>

          <div className='relative'>
            <button
              className='flex items-center justify-center text-lg bg-stone-300 p-4 rounded-full shadow-md hover:bg-stone-400 transition-all'
              onClick={() => togglePopup('skills')}
              style={{ width: '100%', height: '60px' }}
            >
              <FaCode className='mr-2' /> Skills
            </button>
            <Popup
              isOpen={openPopup === 'skills'}
              onClose={() => setOpenPopup(null)}
              title='Skills'
              imageUrl='https://images.unsplash.com/photo-1560696793-5fddef4e7f7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDd8fHNjYW5uaW5nfGVufDB8fHx8MTY2MjQ2NTMyNA&ixlib=rb-1.2.1&q=80&w=1080'
            >
              <p>
                💻 Expert in JavaScript, React, Node.js, CSS, and more. Adept at
                creating responsive, dynamic user interfaces.
              </p>
            </Popup>
          </div>

          <div className='relative'>
            <button
              className='flex items-center justify-center text-lg bg-stone-300 p-4 rounded-full shadow-md hover:bg-stone-400 transition-all'
              onClick={() => togglePopup('projects')}
              style={{ width: '100%', height: '60px' }}
            >
              <FaProjectDiagram className='mr-2' /> Projects
            </button>
            <Popup
              isOpen={openPopup === 'projects'}
              onClose={() => setOpenPopup(null)}
              title='Projects'
              imageUrl='https://images.unsplash.com/photo-1581091870620-794d2e2d04a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDh8fHByb2plY3RzfGVufDB8fHx8MTY2MjQ2NTMzOQ&ixlib=rb-1.2.1&q=80&w=1080'
            >
              <p>
                🔥 Developed a portfolio of web applications, including
                e-commerce platforms and interactive dashboards that showcase my
                ability to blend creativity with technical expertise.
              </p>
            </Popup>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
