import PropTypes from 'prop-types'

export function PostFilter({ field, value, onChange }) {
  return (
    <div className='bg-stone-200 p-4 rounded-lg shadow-md'>
      <label
        htmlFor={`filter-${field}`}
        className='block text-sm font-medium text-gray-700 mb-2'
      >
        Filter by: {field}:
      </label>
      <input
        type='text'
        id={`filter-${field}`}
        name={`filter-${field}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent'
        placeholder={`Filter by ${field}`}
      />
    </div>
  )
}

PostFilter.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
