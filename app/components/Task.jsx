import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { MdDateRange } from "react-icons/md";
import TaskModal from '../modal/TaskModal'

const Task = ({ taskIndex, colIndex }) => {
    const [color, setColor] = useState(null)
    const [dateColor, setDateColor] = useState('bg-gray-300')
    const boards = useSelector(state => state.boards)
    const board = boards.find(board => board.isActive)
    const col = board.columns.find((col, id) => id === colIndex)
    const task = col.tasks.find((col, id) => id === taskIndex)

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

    const priorityColorMapping = {
        Low: 'bg-blue-500',
        Normal: 'bg-green-500',
        High: 'bg-red-500',
    }

    useEffect(() => {
        if(task.priority in priorityColorMapping) {
            setColor(priorityColorMapping[task.priority])
        } else {
            setColor('bg-purple-500')
        }
        
        if(task.dueDate) setDateColor('bg-transparent')
    }, [col, task.priority, task.dueDate])

    let completed = 0
    let subtasks = task.subtasks
    subtasks.forEach(subtask => {
        if(subtask.isCompleted) {
            completed++
        }
    })
    const handleOnDrag = (e) => {
        e.dataTransfer.setData('text', JSON.stringify({ taskIndex, prevColIndex : colIndex }))
    }
  return (
    <div>
        <div draggable onDragStart={handleOnDrag} onClick={() => {
            setIsTaskModalOpen(true)
        }} className='w-[280px] first:my-5 mt-10 rounded-lg mb-6 bg-white dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-[#635fc7] dark:text-white dark:hover:text-[#635fc7] cursor-pointer'>
            <p className='font-bold tracking-wide'>{task.title}</p>
            <div className="flex space-x-2">
                <p className={`rounded-md text-xs text-gray-100 w-16 mt-3 font-semibold flex justify-center items-center h-7 ${color}`}>{task.priority}</p>
                <p className={`rounded-md text-xs text-gray-300 w-28 mt-3 border border-blue-500 flex justify-center items-center h-7 ${dateColor}`}><MdDateRange size={15} />{task.dueDate}</p>
            </div>
            <p className='text-xs text-gray-400 mt-3 flex justify-start items-center'>{task.description}</p>
            <p className='font-bold text-xs mt-2 text-gray-500 tracking-tighter'>{completed} of {subtasks.length} completed tasks</p>
        </div>

        {isTaskModalOpen && (
            <TaskModal taskIndex={taskIndex} setIsTaskModalOpen={setIsTaskModalOpen} colIndex={colIndex} />
        )}
    </div>
  )
}

export default Task