import PropTypes from 'prop-types'
import { MdClose } from 'react-icons/md'

const Popup = ({ isOpen, onClose, imageSrc, title, children }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-lg max-w-lg w-full relative animate-fade-in'>
        <button
          className='absolute top-2 right-2 text-gray-600 hover:text-black transition-colors'
          onClick={onClose}
        >
          <MdClose size={24} />
        </button>
        {imageSrc && (
          <img
            src={imageSrc}
            alt={title}
            className='w-full h-48 object-cover rounded-t-lg'
          />
        )}
        <div className='p-6'>
          <h3 className='text-2xl font-bold mb-4'>{title}</h3>
          {children}
        </div>
      </div>
    </div>
  )
}

Popup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imageSrc: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default Popup
