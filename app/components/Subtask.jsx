import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { subtaskCompleted } from '../redux/boardSlice'


const Subtask = ({ index, colIndex, taskIndex }) => {
  const boards = useSelector(state => state.boards)
  const board = boards.find(board => board.isActive)
  const col = board.columns.find((col, id) => id === colIndex)
  const task = col.tasks.find((col, id) => id === taskIndex)
  const subtasks = task.subtasks.find((subtask, id) => id === index)
  const checked = subtasks.isCompleted

  const dispatch = useDispatch()

  const handleCompleted = () => {
    dispatch(subtaskCompleted({ index, colIndex, taskIndex }))
  }
  
  return (
    <div className='flex bg-[#f4f7fd] rounded-md items-center justify-start p-3 gap-4 w-full dark:bg-[#20212c] hover:bg-[#645fc740] dark:hover:bg-[#645fc740] relative mb-3'>
      <input onChange={handleCompleted} type='checkbox' className='w-4 h-4 accent-[#635fc7] cursor-pointer' checked={checked} />
      <p className={checked && ' line-through opacity-30'}>{subtasks.title}</p>
    </div>
  )
}

export default Subtask