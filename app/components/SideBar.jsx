import React, { useState } from 'react';
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux';
import { setBoardActive } from '../redux/boardSlice';
import { SiTask } from 'react-icons/si';
import useDarkMode from '../hooks/useDarkMode';
import { CiLight } from 'react-icons/ci';
import { MdDarkMode } from 'react-icons/md';
import { FaRegEyeSlash } from "react-icons/fa6";
import { CiChat1 } from "react-icons/ci";
import { Switch } from '@headlessui/react';
import AddEditBoardModal from '../modal/AddEditBoardModal';
import { FiLogOut } from "react-icons/fi";
import { useAuth } from '../context/AuthContext';

function Sidebar({ toggleSideBarOpen, setToggleSideBarOpen }) {
  const dispatch = useDispatch();
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [colorTheme, setTheme] = useDarkMode();
  const [darkSide, setDarkSide] = useState(colorTheme === 'light');
  const { handleUserLogout } = useAuth()

  const toggleDarkMode = (checked) => {
    setTheme(checked ? 'dark' : 'light');
    setDarkSide(checked);
  };

  const boards = useSelector((state) => state.boards);

  const toggleSidebar = () => {
    setToggleSideBarOpen((curr) => !curr);
  };

  return (
    <div>
      <div
        className={
          toggleSideBarOpen
            ? `min-w-[250px] bg-white dark:bg-[#2b2c37] fixed top-[72px] h-screen items-center left-0 z-20`
            : ` bg-[#635FC7] dark:bg-[#2b2c37] dark:hover:bg-[#635FC7] top-auto bottom-10 justify-center items-center hover:opacity-80 cursor-pointer  p-0 transition duration-300 transform fixed felx w-[56px] h-[48px] rounded-r-full  `
        }
      >
        <div>
          {/* reWrite modal  */}

          {toggleSideBarOpen && (
            <div className=" bg-white dark:bg-[#2b2c37] w-full py-4 rounded-xl">
              <h3 className=" dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8 ">
                ALL BOARDS ({boards?.length})
              </h3>

              <div className="  dropdown-borad flex flex-col h-[65vh]  justify-between ">
                <div>
                  {boards.map((board, index) => (
                    <div
                      className={` flex items-baseline space-x-2 px-5 mr-8 rounded-r-full duration-500 ease-in-out py-4 cursor-pointer hover:bg-[#635fc71a] hover:text-[#635fc7] dark:hover:bg-white dark:hover:text-[#635fc7] dark:text-white  ${
                        board.isActive &&
                        " bg-[#635fc7] rounded-r-full text-white mr-8 "
                      } `}
                      key={index}
                      onClick={() => {
                        dispatch(setBoardActive({ index }));
                      }}
                    >
                      <SiTask className="  filter-white  h-4 " />{" "}
                      <p className=" text-lg font-bold ">{board.name}</p>
                    </div>
                  ))}

                  <div
                    className=" flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer text-[#635fc7] px-5 py-4 hover:bg-[#635fc71a] hover:text-[#635fc7] dark:hover:bg-white"
                    onClick={() => {
                      setBoardModalOpen(true);
                    }}
                  >
                    <SiTask className="h-4" />
                    <p className="text-lg font-bold">Create New Board </p>
                  </div>
                  <Link href='/chatlify'>
                    <div
                      className=" flex justify-start items-center space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer text-[#635fc7] px-5 py-4">
                      <CiChat1 size={20} />
                      <p className="text-lg font-bold">Chatlify </p>
                    </div>
                  </Link>
                </div>

                <div onClick={handleUserLogout} className=" flex justify-center items-center space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer text-[#635fc7] px-5 py-4">
                  <FiLogOut size={50} />
                </div>

                <div className=" mx-2  p-4 relative space-x-2 bg-slate-100 dark:bg-[#20212c] flex justify-center items-center rounded-lg">
                  <CiLight />

                  <Switch
                    checked={darkSide}
                    onChange={toggleDarkMode}
                    className={`${
                      darkSide ? "bg-[#635fc7]" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span
                      className={`${
                        darkSide ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>

                  <MdDarkMode />
                </div>
              </div>
            </div>
          )}

          {/* Sidebar hide/show toggle */}
          {toggleSideBarOpen ? (
            <div
              onClick={() => toggleSidebar()}
              className=" flex  items-center mt-2  absolute bottom-16  text-lg font-bold  rounded-r-full hover:text-[#635FC7] cursor-pointer mr-6 mb-8 px-8 py-4 hover:bg-[#635fc71a] dark:hover:bg-white  space-x-2 justify-center  my-4 text-gray-500 "
            >
              <FaRegEyeSlash className=" min-w-[20px]" />
              {toggleSideBarOpen && <p> Hide Sidebar </p>}
            </div>
          ) : (
            <div className=" absolute p-5  " onClick={() => toggleSidebar()}>
              <FaRegEyeSlash size={25} className='-mt-2' />
            </div>
          )}
        </div>
      </div>

      {boardModalOpen && (
        <AddEditBoardModal
          type="add"
          setBoardModalOpen={setBoardModalOpen}
        />
      )}
    </div>
  );
}

export default Sidebar;