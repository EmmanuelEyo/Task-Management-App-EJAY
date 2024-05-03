import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dragTask } from '../redux/boardSlice'
import Task from './Task'

const Column = ({ colIndex }) => {
    const [color, setColor] = useState(null)
    // const colors = [
    //     'bg-red-500',
    //     'bg-orange-500',
    //     'bg-blue-500',
    //     'bg-purple-500',
    //     'bg-green-500',
    //     'bg-indigo-500',
    //     'bg-yellow-500',
    //     'bg-pink-500',
    //     'bg-sky-500',
    // ]
    const columnColorMapping = {
        InQueue: 'bg-red-500',
        InProgress: 'bg-yellow-500',
        Completed: 'bg-green-500',
        Paused: 'bg-blue-500',
    }

    const dispatch = useDispatch()

    // function shuffle(array) {
    //     const shuffledArray = [...array];
    //     for (let i = shuffledArray.length - 1; i > 0; i--) {
    //       const j = Math.floor(Math.random() * (i + 1));
    //       [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    //     }
    //     return shuffledArray;
    // }

    const handleOnDragOver = (e) => e.preventDefault()

    const handleOnDrop = (e) => {
        const { prevColIndex, taskIndex } = JSON.parse(e.dataTransfer.getData('text'))

        if(colIndex !== prevColIndex) {
            dispatch(dragTask({ colIndex, prevColIndex, taskIndex }))
        }
    }

    const boards = useSelector(state => state.boards)
    const board = boards.find(board => board.isActive)
    const col = board.columns.find((col, id) => id === colIndex)

    useEffect(() => {
        if(col.name in columnColorMapping) {
            setColor(columnColorMapping[col.name])
        } else {
            setColor('bg-purple-500')
        }
    }, [col])

    if(!col) {
        return <div>No column found</div>
    }

  return (
    <div onDrop={handleOnDrop} onDragOver={handleOnDragOver} className='scrollbar-hide min-w-[280px] pt-[90px]'>
        <div className='flex items-center justify-center bg-transparent border border-x-slate-300 border-y-slate-300 dark:bg-transparent  w-40 rounded-xl h-12 gap-2 text-[#828fa3] font-semibold'>
            <div className={`rounded-full w-4 h-4 ${color}`}></div>
            {col.name} ({col.tasks.length})
        </div>

        { col.tasks.map((task, index) => (
            <Task key={index} taskIndex={index} colIndex={colIndex} />
        ))}
    </div>
  )
}

export default Column