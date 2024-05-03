import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SiTask } from "react-icons/si";
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import { Switch } from '@headlessui/react';
import useDarkMode from '../hooks/useDarkMode';
import { setBoardActive } from '../redux/boardSlice';

const HeaderDropdown = ({ setOpenDropDown, setBoardModalOpen }) => {
    const dispatch = useDispatch()
    const [colorTheme, setTheme] = useDarkMode()
    const [darkSide, setDarkSide] = useState(colorTheme === 'light')

    const toggleDarkMode = (toggle) => {
        setTheme(toggle ? 'dark' : 'light')
        setDarkSide(toggle)
    }



    const boards = useSelector(state => state.boards)
    // console.log('boards:', boards)

  return (
    <div className='py-10 px-6 absolute left-0 right-0 top-16 bg-[#00000080] bottom-[-100vh]' onClick={(e) => {
        if(e.currentTarget === e.target) {
            setOpenDropDown(false)
        }
    }}>
        <div className='bg-white shadow-md py-4 dark:bg-[#2b2c37] shadow-[#364e7e1a] rounded-xl w-full'>
            <h3 className='text-gray-600 dark:text-gray-300 font-semibold mx-4 mb-8'>All Boards ({boards.length})</h3>
            <div>
                {boards.map((board, index) => (
                    <div onClick={() => {
                        dispatch(setBoardActive({index}))
                    }} className={`flex items-baseline cursor-pointer dark:text-white space-x-3 px-5 py-4 ${board.isActive && 'bg-[#635fc7] text-white mr-8 rounded-r-full'}`} key={index}>
                        <SiTask className='mt-1' />
                        <p>{board.name}</p> 
                    </div>
                ))}
                <div className='flex items-baseline space-x-3 px-5 py-4 text-[#635fc7]' onClick={() => {
                    setBoardModalOpen(true)
                    setOpenDropDown(false)
                }}>
                    <SiTask />
                    <p className='text-lg font-bold cursor-pointer'>Create New Board</p>
                </div>
                <div className='bg-slate-100 p-4 space-x-2 dark:bg-[#20212c] flex justify-center items-center rounded-lg'>
                    <CiLight className='text-[#635fc7]' />
                    <Switch toggle={darkSide} onChange={toggleDarkMode} className={`${darkSide ? 'bg-[#635fc7]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}>
                        <span className={`${darkSide ? 'translate-x-6' : 'translate-x-1'} inline-block bg-white transform transition h-4 w-4 rounded-full`} />
                    </Switch>
                    <MdDarkMode />
                </div>
            </div>
        </div>
    </div>
  )
}

export default HeaderDropdown