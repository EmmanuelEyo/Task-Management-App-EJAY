import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { MdOutlineCancel } from "react-icons/md";
import { addTask, editTask } from "../redux/boardSlice";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddEditTaskModal({
  type,
  device,
  setAddEditTask,
  setIsTaskModalOpen,
  taskIndex,
  prevColIndex = 0,
}) {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.boards.find((board) => board.isActive));

  const columns = board.columns;
  const prevCol = columns[prevColIndex];
  const task = taskIndex !== null ? prevCol.tasks[taskIndex] : null;

  const [title, setTitle] = useState(task ? task.title : "");
  const [valid, setValid] = useState(true)
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [description, setDescription] = useState(task ? task.description : "");
  const [status, setStatus] = useState(columns[prevColIndex].name);
  const [newColIndex, setNewColIndex] = useState(prevColIndex);
  const [priority, setPriority] = useState(task ? task.priority : "Low");
  const [dueDate, setDueDate] = useState(task ? task.dueDate || "" : ""); 
  const [subtasks, setSubtasks] = useState(task ? task.subtasks.map((st) => ({ ...st, id: uuidv4() })) : [
    { title: "", isCompleted: false, id: uuidv4() },
    { title: "", isCompleted: false, id: uuidv4() },
  ]);

  const onChangeSubtasks = (id, newValue) => {
    setSubtasks((prevState) => {
      const newState = [...prevState];
      const subtask = newState.find((subtask) => subtask.id === id);
      subtask.title = newValue;
      return newState;
    });
  };

  const handleChangePriority = (e) => {
    setPriority(e.target.value);
  };

  const handleChangeDueDate = (date) => {
    setDueDate(date);
  };

  const onChangeStatus = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

   const Validate = () => {
    setValid(false);

    if (!title.trim()) {
        return false;
    }

    let emptyColumn = false;
    subtasks.forEach((column) => {
        if (!column.title.trim()) {
            emptyColumn = true;
        }
    });

    if (emptyColumn) {
        return false;
    }

    setValid(true);
    return true;
  };

  if (type === "edit" && isFirstLoad) {
    const initialDueDate = task.dueDate
    let validDate = null
    try{
      validDate = new Date(initialDueDate)
      if(isNaN(validDate.getTime())) {
        validDate = ''
      }
    } catch (error) {
      validDate = ''
    }
    setSubtasks(
      task.subtasks.map(subtask => {
        return { ...subtask, id: uuidv4() };
      })
    );
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority)
    setDueDate(validDate)
    setIsFirstLoad(false);
  }

  const onDelete = (id) => {
    setSubtasks(prevState => prevState.filter((el) => el.id !== id));
  };

  const handleSubmit = (type) => {
    let formattedDueDate = "";
  
    if (dueDate instanceof Date) {
      formattedDueDate = dueDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  
    if (type === "add") {
      dispatch(
        addTask({
          title,
          description,
          subtasks,
          status,
          priority,
          dueDate: formattedDueDate,
          newColIndex,
        })
      );
    } else {
      dispatch(
        editTask({
          title,
          description,
          subtasks,
          status,
          priority,
          taskIndex,
          dueDate: formattedDueDate,
          prevColIndex,
          newColIndex,
        })
      );
    }
  
    setAddEditTask(false); // Close modal after submitting
  };
  
  
  
  

  return (
    <div
      className={
        device === "mobile" ? "py-6 px-6 pb-40  absolute overflow-y-scroll  left-0 flex  right-0 bottom-[-100vh] top-0 dropdown " : "py-6 px-6 pb-40  absolute overflow-y-scroll  left-0 flex  right-0 bottom-0 top-0 dropdown "
      }
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          setAddEditTask(false)
        }
        
      }}
    >
      {/* Modal Section */}

      <div
        className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  my-auto  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl">
        <h3 className=" text-lg ">
          {type === "edit" ? "Edit" : "Add New"} Task
        </h3>


        <div className="mt-8 flex flex-col space-y-1">
          <label className="  text-sm dark:text-white text-gray-500">
            Task Name
          </label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} id="task-name-input" type="text" className=" bg-transparent  px-4 py-2 outline-none focus:border-0 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0  " placeholder=" e.g Take coffee break"
          />
        </div>

        <div className="mt-8 flex flex-col space-y-1">
          <label className="  text-sm dark:text-white text-gray-500">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="task-description-input"
            className="bg-transparent outline-none min-h-[200px] focus:border-0 px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px] "
            placeholder="e.g. It's always good to take a break. This 
            15 minute break will  recharge the batteries 
            a little."
          />
        </div>


        <div className="mt-8 flex flex-col space-y-3">
          <label className="  text-sm dark:text-white text-gray-500">
            Subtasks
          </label>

          {subtasks.map((subtask, index) => (
            <div key={index} className=" flex items-center w-full ">
              <input onChange={(e) => onChangeSubtasks(subtask.id, e.target.value)} type="text" value={subtask.title} className="bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]" placeholder=" e.g Take coffee break"
              />
                <MdOutlineCancel onClick={(e) => {
                  onDelete(subtask.id)   
                }} className='text-gray-500 m-4 mt-1 text-xl cursor-pointer' />
            </div>
          ))}

          <button
            className=" w-full items-center dark:text-[#635fc7] dark:bg-white text-white bg-[#635fc7] py-2 rounded-full " onClick={() => {
              setSubtasks((state) => [
                ...state,
                { title: "", isCompleted: false, id: uuidv4() },
              ]);
            }}
          >
            + Add New Subtask
          </button>
        </div>

          {/* priority Status  */}
        <div className="mt-8 flex flex-col space-y-3">
          <label className="  text-sm dark:text-white text-gray-500">
            Priority Status
          </label>
          <select value={priority} onChange={handleChangePriority} className="flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0  border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none" >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* date Status  */}
        <div className="flex flex-col mt-5 space-y-1">
          <label className="text-sm text-gray-500 dark:text-white" htmlFor="date">Due Date</label>
          <ReactDatePicker className="flex-grow cursor-pointer mt-2 px-4 py-2 rounded-md text-sm bg-transparent focus:border-0  border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none" selected={dueDate} onChange={date => handleChangeDueDate(date)} dateFormat="dd MMMM yyyy" placeholderText="select a due date" />
        </div>

        {/* current Status  */}
        <div className="mt-6 flex flex-col space-y-3">
          <label className="  text-sm dark:text-white text-gray-500">
            Current Status
          </label>
          <select value={status} onChange={onChangeStatus} className=" select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0  border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none" >
            {columns.map((column, index) => (
              <option key={index}>{column.name}</option>
            ))}
          </select>
          <button onClick={() => {
              const isValid = Validate();
              if (isValid) {
                handleSubmit(type);
                setAddEditTask(false);
              }
            }}
            className=" w-full items-center text-white bg-[#635fc7] py-2 rounded-full "
          >
           {type === "edit" ? " save edit" : "Create task"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEditTaskModal;