import React, { useState } from 'react'
import AddEditBoardModal from '../modal/AddEditBoardModal'

const EmptyBoard = ({ type }) => {
    const [createBoard, setCreateBoard] = useState(false)
  return (
    <div className='bg-white flex flex-col items-center justify-center h-screen w-screen'>
        <h3 className='text-gray-500 font-semibold'>
            { type === 'edit' ? 'This board is empty. Create a new column to get started' : 'There are no boards available. Create a new board to get started.'}
        </h3>
        <button onClick={() => {
            setCreateBoard(true)
        }} className='bg-[#635fc7] py-2 px-3 rounded-full mt-8 text-white relative w-full max-w-xs items-center hover:opacity-80 dark:bg-[#635fc7] dark:text-white font-bold'>
            { type === 'edit' ? '+ Add New Column' : '+ Add New Board'}
        </button>
        { createBoard && <AddEditBoardModal type={type} setBoardModalOpen={setCreateBoard} />}
    </div>
  )
}

export default EmptyBoard