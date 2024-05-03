import React from 'react'

const DeleteModal = ({ type, title, setIsDeleteModalOpen, onDeleteButtonClick }) => {
  return (
    <div onClick={(e) => {
        if(e.currentTarget === e.target) {
            setIsDeleteModalOpen(false)
        }
    }} className='fixed right-0 bottom-0 left-0 top-0 bg-[#00000080] justify-center items-center flex px-2 py-4 z-50'>
        <div className='scrollbar-hide overflow-y-scroll max-h-[95vh] bg-white my-auto text-black rounded-xl py-8 px-8 dark:bg-[#2b2c37] dark:text-white w-full'>
            <h3 className='font-bold text-red-500 text-xl'>Delete this {type}</h3>
            { type === 'task' ? (
                <p className='text-gray-500 font-semibold pt-6 tracking-wide text-sm'>
                    Are you sure you want to delete the &quot;{title}&quot; task and its subtasks?
                    This action cannot be reversed
                </p>
            ): <p className='text-gray-500 font-semibold pt-6 tracking-wide text-sm'>
                    Are you sure you want to delete the &quot;{title}&quot; board?
                    This action will remove all columns and tasks, and cannot be reversed
                </p>
            }
            <div className='flex w-full mt-4 space-x-4 items-center'>
                <button onClick={onDeleteButtonClick} className='w-full items-center text-white bg-red-500 py-2 rounded-full font-semibold hover:opacity-80'>Delete</button>
                <button onClick={() => setIsDeleteModalOpen(false)} className='w-full items-center py-2 rounded-full font-semibold text-[#635fc7] bg-[#1e19a31a] hover:opacity-80'>Cancel</button>
            </div>
        </div> 
    </div>
  )
}

export default DeleteModal