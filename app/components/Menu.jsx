import React from 'react'

const Menu = ({ type, setOpenEditModal, setOpenDeleteModal }) => {
  return (
    <div className={ type === 'boards' ? ' absolute top-16 right-5' : 'absolute top-6 right-4'}>
      <div className='flex justify-end items-center'>
        <div className='w-40 text-sm z-50 font-medium space-y-4 bg-white dark:bg-[#20212c] rounded-lg h-auto pr-12 shadow-md py-5 px-4 shadow-[#364e7e1a]'>
          <p onClick={() => {
            setOpenEditModal()
          }} className='cursor-pointer text-gray-700 dark:text-gray-400'>Edit {type}</p>
          <p onClick={() => {
            setOpenDeleteModal()
          }} className='cursor-pointer text-red-500'>Delete {type}</p>
        </div>
      </div>
    </div>
  )
}

export default Menu