'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import HeaderDropdown from './HeaderDropdown';
import AddEditBoardModal from '../modal/AddEditBoardModal';
import { useSelector, useDispatch } from 'react-redux';
import { deleteBoard, setBoardActive } from '../redux/boardSlice';
import AddEditTaskModal from '../modal/AddEditTaskModal';
import Menu from './Menu';
import DeleteModal from '../modal/DeleteModal';

const Header = ({ boardModalOpen, setBoardModalOpen }) => {
    const [openDropDown, setOpenDropDown] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [boardType, setBoardType] = useState('add')
    const [isMenu, setIsMenu] = useState(false)
    const [addEditTask, setAddEditTask] = useState(false)

    const dispatch = useDispatch()

    const boards = useSelector(state => state.boards)
    const board = boards.find(board => board.isActive)

    const boardName = board ? board.name : 'No Active Board'

    const setOpenEditModal = () => {
        setBoardModalOpen(true)
        setIsMenu(false)
    }

    const setOpenDeleteModal = () => {
        setIsDeleteModalOpen(true)
        setIsMenu(false)
    }

    const onDeleteButtonClick = () => {
        dispatch(deleteBoard())
        dispatch(setBoardActive({ index: 0}))
        setIsDeleteModalOpen(false)
    }

  return (
    <div className='fixed left-0 p-4 bg-white dark:bg-[#2b2c37] z-50 right-0'>
        <header className='flex dark:text-white justify-between dark:bg-[#2b2c37] items-center'>
            <div className='flex items-center space-x-2 md:space-x-4'>
                <Image src='/logo.png' alt='logo' width={40} height={40} />
                <h3 className='hidden md:inline-block font-bold md:text-4xl'>EJAY TaskMaster</h3>
                <div className='flex items-center'>
                    <h3 className='truncate md:ml-20 max-w-[200px] text-xl font-bold md:text-2xl'>{boardName}</h3>
                    { openDropDown ? <FaArrowUp className='w-3 ml-2 md:hidden cursor-pointer' onClick={() => {
                        setIsMenu(false)
                        setOpenDropDown(prevState => !prevState)
                        setBoardType('add')
                    }} /> : <FaArrowDown className='w-3 ml-2 md:hidden cursor-pointer' onClick={() => {
                        setIsMenu(false)
                        setOpenDropDown(prevState => !prevState)
                        setBoardType('add')
                    }} /> }
                </div>
            </div>

            <div className='flex space-x-4 items-center md:space-x-6'>
                <button className='button hidden md:block' onClick={() => {
                    setOpenDropDown(false)
                    setIsMenu(false)
                    setAddEditTask(state => !state)
                }}>
                    +Add New Task
                </button>
                <button onClick={() => {
                    setOpenDropDown(false)
                    setIsMenu(false)
                    setAddEditTask(state => !state)
                }} className='button py-1 px-3 md:hidden'> 
                    <FaPlus /> 
                </button>
                <BsThreeDotsVertical onClick={() => {
                    setBoardType('edit')
                    setOpenDropDown(false)
                    setIsMenu(state => !state)
                }} className='h-6 cursor-pointer' />

                { isMenu && <Menu type='boards' setOpenEditModal={setOpenEditModal} setOpenDeleteModal={setOpenDeleteModal} />}
            </div>
        </header>

        { openDropDown && <HeaderDropdown setBoardModalOpen={setBoardModalOpen} setOpenDropDown={setOpenDropDown} />}
        { boardModalOpen && <AddEditBoardModal type={boardType} setBoardModalOpen={setBoardModalOpen} /> }
        { addEditTask && <AddEditTaskModal device='mobile' type='add' setAddEditTask={setAddEditTask} /> }
        { isDeleteModalOpen && <DeleteModal setIsDeleteModalOpen={setIsDeleteModalOpen}  onDeleteButtonClick={ onDeleteButtonClick} title={board.name} type='board' />}
    </div>
  )
}

export default Header