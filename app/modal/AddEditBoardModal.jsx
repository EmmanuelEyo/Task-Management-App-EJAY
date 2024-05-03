import React, { useState } from 'react'
import { v4 as  uuidv4 } from 'uuid'
import { MdOutlineCancel } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { addBoard, editBoard } from '../redux/boardSlice';

const AddEditBoardModal = ({setBoardModalOpen, type, }) => {
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [newColumns, setNewColumns] = useState([
        { name: 'InQueue', tasks: [], id: uuidv4() },
        { name: 'InProgress', tasks: [], id: uuidv4() },
    ])
    const [valid, setValid] = useState(true)
    const board = useSelector(state => state.boards).find(board => board.isActive)

    const onChange = (id, newValue) => {
        setNewColumns((prevState) => {
            const newState = [...prevState]
            const column = newState.find(col => col.id === id)
            column.name = newValue
            return newState
        })
    }

    if (type === 'edit' && isFirstLoad) {
        setNewColumns(
            board.columns.map(col => {
                return { ...col, id: uuidv4()}
            })
        )
        setName(board.name)
        setIsFirstLoad(false)
    }

    const Validation = () => {
        setValid(false);
    
        if (!name.trim()) {
            return false;
        }
    
        let hasEmptyColumn = false;
        newColumns.forEach((column) => {
            if (!column.name.trim()) {
                hasEmptyColumn = true;
            }
        });
    
        if (hasEmptyColumn) {
            return false;
        }
    
        setValid(true);
        return true;
    };
    

    const onSubmit = (type) => {
        setBoardModalOpen(false)
        if(type === 'add') {
            dispatch(addBoard({ name, newColumns }))
        } else{
            dispatch(editBoard({ name, newColumns}))
        }
    }

    const onDelete = (id) => {
        setNewColumns((prevState) => prevState.filter((el) => el.id !== id))
    }
  return (
    <div onClick={(e) => {
        if(e.currentTarget === e.target) {
            setBoardModalOpen(false)
        }
    }} className='fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 left-0 bottom-0 justify-center items-center flex dropdown'>
        <div className='overflow-y-scroll scrollbar-hide max-h-[95vh] bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto my-auto w-full px-8 py-8 rounded-xl'>
            <h3 className='text-lg'>{ type === 'edit' ? 'Edit' : 'Add New '} Board</h3>
            <div className='flex flex-col mt-8 space-y-1'>
                <label className='text-gray-500'>
                    Board Name
                </label>
                <input className='px-4 py-2 bg-transparent rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0' value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g Web Development' />
            </div>
            <div className='flex flex-col space-x-3 mt-8'>
                <label className='text-sm dark:text-white text-gray-500'>
                    Board Columns
                </label>

                {newColumns.map((column, index) => (
                    <div key={index} className='flex items-center w-full'>
                        <input className='px-4 py-2 bg-transparent mb-3 border-gray-600 focus:outline-[#635fc7] flex-grow rounded-md border-[0.5px] text-sm outline-[1px]' type='text' value={column.name} onChange={e => onChange(column.id, e.target.value)} />
                        <MdOutlineCancel onClick={(e) => {
                            onDelete(column.id)   
                        }} className='text-gray-500 m-4 mt-1 text-xl cursor-pointer' />
                    </div>
                ))}
                <button className='bg-[#635fc7] hover:opacity-75 dark:text-[#635fc7] text-white dark:bg-white py-2 w-full items-center mt-2 rounded-full' onClick={() => {
                    setNewColumns(state => [
                        ...state,
                        { name: '', tasks: [], id: uuidv4() },
                    ])
                }}>
                    +Add Board Column  
                </button>
                <button onClick={() => {
                    const isValidate = Validation()
                    if(isValidate === true) onSubmit(type)

                }} className='bg-[#635fc7] dark:bg-[#635fc7] py-2 text-white dark:text-white w-full relative items-center mt-2 rounded-full'>
                    { type === 'add' ? 'Create New Board' : 'Save Changes'}
                </button>
            </div>
        </div>
    </div>
  ) 
}

export default AddEditBoardModal