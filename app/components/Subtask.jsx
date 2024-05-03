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
    <div className="flex rounded-md items-center justify-start p-3 gap-4 w-full hover:bg-[#645fc740] dark:hover:bg-[#645fc740] relative mb-3">
      <input
        onChange={handleCompleted}
        type="checkbox"
        className={`w-4 h-4 cursor-pointer accent-[#635fc7]`} 
        checked={checked}
        style={{
          appearance: 'none', 
          backgroundColor: checked ? '#635fc7' : 'transparent', 
          border: '2px solid #635fc7',
          borderRadius: '50%',
          height: '20px', 
          width: '20px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
      {checked && (
        <span
          style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            backgroundColor: '#fff',
            borderRadius: '50%',
          }}
        ></span>
      )}
      <p className={checked ? 'line-through opacity-30 text-sm' : 'text-sm'}>{subtasks.title}</p>
    </div>
  )
}

export default Subtask