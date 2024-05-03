import React, { useState } from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux'
import { deleteTask } from '../redux/boardSlice';
import Menu from '../components/Menu';
import { setTaskStatus } from '../redux/boardSlice';
import { IoIosCheckmark } from "react-icons/io";
import Subtask from '../components/Subtask';
import DeleteModal from './DeleteModal';
import AddEditTaskModal from './AddEditTaskModal';

const TaskModal = ({ colIndex, taskIndex, setIsTaskModalOpen }) => {
  const boards = useSelector(state => state.boards)
  const board = boards.find(board => board.isActive)
  const columns = board.columns
  const col = columns.find((col, id) => id === colIndex)
  const task = col.tasks.find((col, id) => id === taskIndex)
  const subtasks = task.subtasks

  const dispatch = useDispatch()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  let completed = 0
  subtasks.forEach(subtask => {
      if(subtask.isCompleted) {
          completed++
      }
  })

  const setOpenEditModal = () => {
    setIsAddTaskModalOpen(true)
    setIsMenuOpen(false)
  }

  const setOpenDeleteModal = () => {
    setIsMenuOpen(false)
    setDeleteModalOpen(true)
  }

  const onChange = (e) => {
    setStatus(e.target.value)
    setNewColIndex(e.target.selectedIndex)
    console.log(setNewColIndex)
  }

  const onClose = (e) => {
    if(e.target !== e.currentTarget) return
    dispatch(setTaskStatus({ taskIndex, colIndex, newColIndex, status }))
    setIsTaskModalOpen(false) 
  }

  const onDeleteButtonClick = () => {
    dispatch(deleteTask({ taskIndex, colIndex }))
    setIsAddTaskModalOpen(false)
    setDeleteModalOpen(false)
  }

  const [status, setStatus] = useState(task.status)
  const [newColIndex, setNewColIndex] = useState(columns.indexOf(col))
  // const [menuOpen, setMenuOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)


  return (
    <div onClick={onClose} className='bg-[#00000080] justify-center items-center flex fixed right-0 left-0 top-0 bottom-0 overflow-scroll scrollbar-hide px-2 py-4 z-50'>
      <div onClick={(e) => {
        if(e.currentTarget === e.target) {
          setIsMenuOpen(false)
        }
      }} className='bg-white scrollbar-hide overflow-y-scroll max-h-[95vh] text-black dark:text-white dark:bg-[#2b2c37] px-8 py-8 rounded-xl font-bold shadow-md my-auto shadow-[#364e7e1a] w-full max-w-md mx-auto'>
        <div className='relative flex justify-between w-full items-center'>
          <h1 className='text-lg'>{task.title}</h1>
          <BsThreeDotsVertical onClick={() => {
            setIsMenuOpen(state => !state)
          }} className='cursor-pointer h-6' />
          {isMenuOpen && <Menu setOpenEditModal={setOpenEditModal} type='task' setOpenDeleteModal={setOpenDeleteModal} />}
        </div>
        <p className='text-gray-500 font-semibold text-sm pt-6 tracking-wide'>{task.description}</p>
        <p className='pt-6 text-gray-500 tracking-widest text-sm'>({completed} of {subtasks.length})</p>
        <div className='mt-3'>
          {subtasks.map((subtask, i) => {
            return(
              <Subtask key={i} index={i} taskIndex={taskIndex} colIndex={colIndex} />
            )
          })}
        </div>
        <div className='mt-8 flex flex-col space-y-3'>
          <label className='text-sm text-gray-500 dark:text-white' htmlFor="status">Current Status</label>
          <select
            value={status}
            onChange={onChange}
            className='   flex-grow px-4 py-2 rounded-md text-sm bg-white dark:bg-[#2b2c37] border-[1px] border-gray-300 outline-none transition-all hover:shadow-md'
            name="status"
          >
            {columns.map((column, index) => (
              <option className='bg-white dark:bg-[#2b2c37]' value={column.name} key={index}>
                {column.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      { deleteModalOpen && <DeleteModal setDeleteModalOpen={setDeleteModalOpen} onDeleteButtonClick={ onDeleteButtonClick} title={task.title} type='task' /> }
      { isAddTaskModalOpen && <AddEditTaskModal setIsTaskModalOpen={setIsTaskModalOpen} type='edit' setAddEditTask={setIsAddTaskModalOpen} taskIndex={taskIndex} prevColIndex={colIndex} />}
    </div>
  )
}

export default TaskModal