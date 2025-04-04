import React, { useState } from 'react'
import {FaThumbtack, FaTrashAlt, FaEdit} from "react-icons/fa";
import useAuthStore from '../store/authStore';
import EditTask from './EditTask';


const TaskManager = () => {

    const {tasks, taskPinToggle, deleteTaskFromDB, editTask} = useAuthStore();
    const [editMode, setEditMode] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    console.log(tasks)

    if(tasks.length === 0){

        return (

            <>
                <p className='mt-3 font-semibold text-2xl'>No Tasks at Present, Create One!!</p>
            </>
        )
    }
    return (
        <>
            <div className="w-full p-3 mt-3 h-screen bg-white shadow-lg rounded-lg ">

                <h2 className="text-xl font-semibold text-gray-700 mb-4">Task Manager</h2>
                <div className="space-y-3 ">
                    {tasks
                        .sort((a, b) => b.isPinned - a.isPinned) // Pinned tasks appear first
                        .map((task, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm cursor-pointer hover:scale-y-105 hover:transform transition ease-in-out">
                                <div>
                                    <h3 className={`font-medium ${task.pinned ? "text-blue-600" : "text-gray-800"}`}>
                                        {task.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">{task.status}</p>
                                </div>

                                <div className="flex gap-5">
                                    <button onClick={() => { setEditMode(true); setSelectedTask(task); }} className="text-yellow-500 hover:text-yellow-700">
                                        <FaEdit size={18} />
                                    </button>
                                    <button onClick={() => deleteTaskFromDB(task._id)} className="text-red-500 hover:text-red-700">
                                        <FaTrashAlt size={18} />
                                    </button>
                                    <button onClick={() => taskPinToggle(task._id)} className={`${task.isPinned ? "text-blue-500" : "text-gray-500"} hover:text-blue-700`}>
                                        <FaThumbtack size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {editMode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <EditTask modelToggle={setEditMode} task={selectedTask}/>
                </div>
            )}
        
        </>
    )
}

export default TaskManager
