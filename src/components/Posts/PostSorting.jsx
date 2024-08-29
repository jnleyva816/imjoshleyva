import PropTypes from 'prop-types'

export function PostSorting({
  field = [],
  value,
  onChange,
  orderValue,
  onOrderChange,
}) {
  return (
    <div className='bg-stone-200 p-4 rounded-lg shadow-md'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:space-x-4'>
        <div className='mb-4 lg:mb-0 lg:flex-1'>
          <label
            htmlFor='sortBy'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Sort By:
          </label>
          <select
            id='sortBy'
            name='sortBy'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent'
          >
            {field.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>
        <div className='lg:flex-1'>
          <label
            htmlFor='sortOrder'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Sort Order:
          </label>
          <select
            id='sortOrder'
            name='sortOrder'
            value={orderValue}
            onChange={(e) => onOrderChange(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent'
          >
            <option value='ascending'>Ascending</option>
            <option value='descending'>Descending</option>
          </select>
        </div>
      </div>
    </div>
  )
}

PostSorting.propTypes = {
  field: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  orderValue: PropTypes.string.isRequired,
  onOrderChange: PropTypes.func.isRequired,
}
