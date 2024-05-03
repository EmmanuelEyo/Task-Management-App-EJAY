import React, { useState, useEffect, useMemo } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask } from '../redux/boardSlice';
import Menu from '../components/Menu';
import { setTaskStatus } from '../redux/boardSlice';
import { IoIosCheckmark } from "react-icons/io";
import Subtask from '../components/Subtask';
import DeleteModal from './DeleteModal';
import AddEditTaskModal from './AddEditTaskModal';
import { MdDateRange } from "react-icons/md";

const TaskModal = ({ colIndex, taskIndex, setIsTaskModalOpen }) => {
  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive);
  const columns = board.columns;
  const col = columns.find((col, id) => id === colIndex);
  const task = col.tasks.find((col, id) => id === taskIndex);
  const subtasks = task.subtasks;

  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);
  const [color, setColor] = useState(null)
  const [dateColor, setDateColor] = useState('bg-gray-300')
  const [statusColor, setStatusColor] = useState(null)
  const [textColor, setTextColor] = useState(null)

  let completed = 0;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  const priorityColorMapping = useMemo(() => ({
    Low: 'bg-blue-500',
    Normal: 'bg-green-500',
    High: 'bg-red-500',
  }), [])

  useEffect(() => {
    if(task.priority in priorityColorMapping) {
        setColor(priorityColorMapping[task.priority])
    } else {
        setColor('bg-purple-500')
    }
    
    if(task.dueDate) setDateColor('bg-transparent')
  }, [col, task.priority, task.dueDate, priorityColorMapping])

  const columnColorMapping = useMemo(() => ({
    InQueue: 'border-red-500',
    InProgress: 'border-yellow-500',
    Completed: 'border-green-500',
    Paused: 'border-blue-500',
  }), [])

  const textColorMapping = useMemo(() => ({
    InQueue: 'text-red-400',
    InProgress: 'text-yellow-400',
    Completed: 'text-green-400',
    Paused: 'text-blue-400',
  }), [])

  useEffect(() => {
    if(col.name in columnColorMapping) {
        setStatusColor(columnColorMapping[col.name])
    } else {
        setStatusColor('border-purple-500')
    }
  }, [col, columnColorMapping])

  useEffect(() => {
    if(col.name in textColorMapping) {
        setTextColor(textColorMapping[col.name])
    } else {
        setTextColor('text-purple-500')
    }
  }, [col, textColorMapping])


  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => {
      setIsTaskModalOpen(false); 
    }, 500);
  };

  return (
    <div
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          closeModal();
        }
      }}
      className={`fixed inset-0 z-50 flex overflow-y-scroll scrollbar-hide justify-center items-center bg-[#00000080] transition-opacity duration-500 ${modalOpen ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`transition-transform duration-500 ease-in-out ${
          modalOpen ? 'translate-x-[34rem]' : 'translate-x-[100%]'
        } bg-white dark:bg-[#2b2c37] dark:text-white max-w-md mx-auto w-full rounded-xl p-8 overflow-y-auto shadow-lg`}
      >
        <div className="relative flex justify-between w-full items-center">
          <h1 className="text-xl">{task.title}</h1>
          <BsThreeDotsVertical onClick={() => setIsMenuOpen(!isMenuOpen)} className="cursor-pointer h-6" />
          {isMenuOpen && <Menu setOpenEditModal={() => setIsAddTaskModalOpen(true)} type="task" setOpenDeleteModal={() => setDeleteModalOpen(true)} />}
        </div>
        <div className='flex space-x-10 mt-3 items-center justify-start'>
          <p className='mt-3 text-gray-500'>Label</p>
          <p className={`rounded-md text-xs text-gray-100 w-14 mt-3 font-semibold flex justify-center items-center h-6 ${color}`}>{task.priority}</p>
        </div>
        <div className='flex space-x-8 mt-3 items-center justify-start'>
          <p className='text-gray-500'>Status</p>
          <p className={`rounded-md text-xs w-24 mt-1 font-semibold flex justify-center border ${statusColor} ${textColor} bg-transparent items-center h-7`}>{col.name}</p>
        </div>
        <div className='flex space-x-3 mt-3 items-center justify-start'>
          <p className='text-gray-500'>Due date</p>
          <p className={`rounded-md text-xs text-gray-300 w-28 mt-1 border border-blue-500 flex justify-center items-center h-7 ${dateColor}`}><MdDateRange size={15} />{task.dueDate}</p>
        </div>
        <p className="text-gray-500 font-semibold text-sm pt-6 tracking-wide">{task.description}</p>
        <p className="pt-6 text-gray-500 tracking-widest text-sm">({completed} of {subtasks.length})</p>
        <div className="mt-3">
          {subtasks.map((subtask, i) => (
            <Subtask key={i} index={i} taskIndex={taskIndex} colIndex={colIndex} />
          ))}
        </div>
        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm text-gray-500 dark:text-white" htmlFor="status">Current Status</label>
          <select
            value={task.status}
            onChange={(e) => {
              const newStatus = e.target.value;
              const newColIndex = columns.findIndex((col) => col.name === newStatus);
              dispatch(setTaskStatus({ taskIndex, colIndex, newColIndex, status: newStatus }));
            }}
            className="flex-grow px-4 py-2 rounded-md text-sm bg-transparent border-[1px] border-gray-300 focus:outline-[#635fc7]"
          >
            {columns.map((column, index) => (
              <option key={index} className="bg-white dark:bg-[#2b2c37]">{column.name}</option>
            ))}
          </select>
        </div>
      </div>

      {deleteModalOpen && <DeleteModal setDeleteModalOpen={setDeleteModalOpen} onDeleteButtonClick={() => dispatch(deleteTask({ taskIndex, colIndex }))} title={task.title} type="task" />}
      {isAddTaskModalOpen && <AddEditTaskModal setIsTaskModalOpen={setIsTaskModalOpen} type="edit" setAddEditTask={setIsAddTaskModalOpen} taskIndex={taskIndex} prevColIndex={colIndex} />}
    </div>
  );
};

export default TaskModal;
