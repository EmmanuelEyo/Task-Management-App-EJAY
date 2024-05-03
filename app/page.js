'use client'
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import { Provider, useDispatch, useSelector } from "react-redux";
import { setBoardActive } from "./redux/boardSlice";
import store from "./redux/store";
import { useState } from "react";
import EmptyBoard from "./components/EmptyBoard";

export default function Home() {
  return(
    <Provider store={store}>
      <ReduxContent />
    </Provider>
  )
}

function ReduxContent() {
  const [boardModalOpen, setBoardModalOpen] = useState(false)
  const dispatch = useDispatch()
  const boards = useSelector(state => state.boards)
  const activeBoard = boards.find(board => board.isActive)
  if (boards.length > 0 && !activeBoard) {
    dispatch(setBoardActive({ index: 0 }));
  }

  return (
    <div>
      <>
          {boards.length > 0 ?
            <>
              <Header boardModalOpen={boardModalOpen} setBoardModalOpen={setBoardModalOpen} />
              <MainContent boardModalOpen={boardModalOpen} setBoardModalOpen={setBoardModalOpen} />
            </>
          :
            <>
              <EmptyBoard type='add' />
            </> 
        }
      </>
    </div>
  )
}
