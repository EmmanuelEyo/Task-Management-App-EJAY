import React, { useEffect, useState } from 'react';
import SideBar from './SideBar';
import { useSelector } from 'react-redux';
import Column from './Column';
import EmptyBoard from './EmptyBoard';
import AddEditBoardModal from '../modal/AddEditBoardModal';

const MainContent = ({ boardModalOpen, setBoardModalOpen }) => {
  const [toggleSideBarOpen, setToggleSideBarOpen] = useState(true);
  const [screenSize, setScreenSize] = useState([0, 0]);

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize([window.innerWidth, window.innerHeight]);
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive);
  const column = board?.columns || [];

  return (
    <div
      className={
        screenSize[0] >= 768 && toggleSideBarOpen
          ? 'bg-[#f4f7fd] scrollbar-hide overflow-x-scroll z-50 h-screen dark:bg-[#20212c] gap-6 ml-[250px] flex'
          : 'bg-[#f4f7fd] dark:bg-[#20212c] gap-6 scrollbar-hide flex overflow-x-scroll h-screen'
      }
    >
      {screenSize[0] >= 768 && <SideBar toggleSideBarOpen={toggleSideBarOpen} setToggleSideBarOpen={setToggleSideBarOpen} />}
      { column.length > 0 ? (
        <>
          {column.map((col, index) => (
            <Column key={index} colIndex={index} />
          ))}
          <div onClick={() => {
            setBoardModalOpen(true)
          }} className='flex justify-center items-center min-w-[280px] bg-[#e9effa] rounded-lg mt-[135px] h-screen scrollbar-hide hover:text-[#635fc7] cursor-pointer mx-5 mb-2 font-bold dark:bg-[#2b2c3740] text-[#828fa3] text-2xl transition duration-500 pt-[70px]'>
            + New Column
          </div>
        </>
      ) : 
        <>
          <EmptyBoard />
        </>
      }

      {boardModalOpen && <AddEditBoardModal type='edit' setBoardModalOpen={setBoardModalOpen} />}
    </div>
  );
};

export default MainContent;