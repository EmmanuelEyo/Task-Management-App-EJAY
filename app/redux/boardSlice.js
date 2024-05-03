import { createSlice } from "@reduxjs/toolkit";
import data from '../data/data.json'

// console.log("Initial boards state:", data.boards)

const boardSlice = createSlice({
    name: 'boards',
    initialState: data.boards,
    reducers: {
        addBoard: (state, action) => {
            const payload = action.payload
            const isActive = state.length > 0 ? false : true
            const board = {
                name: payload.name,
                isActive,
                columns: [],
            }
            board.columns = payload.newColumns
            state.push(board)
        },
        setBoardActive: (state, action) => {
            state.map((board, index) => {
                index === action.payload.index ? (board.isActive = true) : (board.isActive = false)
                return board
            })
        },
        addTask: (state, action) => {
            const { title, description, status, subtasks, newColIndex, priority, dueDate } = action.payload
            const task = { title, description, subtasks, status, priority, dueDate }
            const board = state.find(board => board.isActive)
            const column = board.columns.find((col, index) => index === newColIndex)
            column.tasks.push(task)
        },
        editBoard: (state, action) => {
            const payload = action.payload
            const board = state.find(board => board.isActive)
            board.name = payload.name
            board.columns = payload.newColumns
        },
        deleteBoard: (state, action) => {
            const board = state.find(board => board.isActive)
            state.splice(state.indexOf(board), 1)
        },
        subtaskCompleted: (state, action) => {
            const payload = action.payload
            const board = state.find(board => board.isActive)
            const col = board.columns.find((col, id) => id === payload.colIndex)
            const task = col.tasks.find((col, id) => id === payload.taskIndex)
            const subtasks = task.subtasks.find((subtask, id) => id === payload.index)
            subtasks.isCompleted = !subtasks.isCompleted
        },
        setTaskStatus: (state, action) => {
            const payload = action.payload
            const board = state.find(board => board.isActive)
            const columns = board.columns
            const col = columns.find((col, id) => id === payload.colIndex)
            if (payload.colIndex === payload.newColIndex) {
                return
            }
            const task = col.tasks.find((col, id) => id === payload.taskIndex)
            task.status = payload.status
            col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex)
            const newCol = columns.find((col, i) => i === payload.newColIndex)
            newCol.tasks.push(task)
        },
        deleteTask: (state, action) => {
            const payload = action.payload
            const board = state.find(board => board.isActive)
            const col = board.columns.find((col, id) => id === payload.colIndex)
            col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex)
        },
        editTask: (state, action) => {
            const { title, description, status, subtasks, newColIndex, prevColIndex, taskIndex, priority, dueDate } = action.payload
            const board = state.find(board => board.isActive)
            const column = board.columns.find((col, index) => index === prevColIndex)
            const task = column.tasks.find((task, index) => index === taskIndex)
            const columns = board.columns
            task.title = title
            task.description = description
            task.status = status
            task.subtasks = subtasks
            task.priority = priority
            task.dueDate = dueDate
            if(prevColIndex === newColIndex) return
            column.tasks = column.tasks.filter((task, i) => i !== taskIndex)
            const newCol = columns.find((col, i) => i === newColIndex) 
            newCol.tasks.push(task)
        },
        dragTask: (state, action) => {
            const { colIndex, prevColIndex, taskIndex } = action.payload
            const board = state.find(board => board.isActive)
            const prevCol = board.columns.find((col, i) => i === prevColIndex)
            const task = prevCol.tasks.splice(taskIndex, 1)[0]
            board.columns.find((col, i) => i === colIndex).tasks.push(task)
        }
    }
})

export const { addBoard, setBoardActive, addTask, editBoard, deleteBoard, subtaskCompleted, setTaskStatus, deleteTask, editTask, dragTask } = boardSlice.actions
export default boardSlice.reducer