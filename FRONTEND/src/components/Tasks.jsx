import React, { useEffect, useState } from "react";
import NotesCard from "./TaskCard";
import { FaPlus } from "react-icons/fa";
import useAuthStore from "../store/authStore";
import AddTask from "./AddTask";
import TaskCard from "./TaskCard";

const Tasks = () => {

    const { isAuthenticated, user, userID, tasks, setTasks, backendURL, getAllTasks } = useAuthStore();
    

    const {isModelOpen, setIsModelOpen, assignedTasks, get, getAllAssignedTasks} = useAuthStore();
    const toggleModel = () => setIsModelOpen(!isModelOpen);

    
    useEffect(()=>{

        getAllTasks();
        
    }, [])
    
    useEffect(()=>{
        
        getAllAssignedTasks();

    }, [])
    // console.log(tasks)
    console.log(assignedTasks)

    return (
        <>

            <div className="relative h-full w-full flex flex-col  ">
                
                { tasks.length >0 && (
                    <>  
                        
                        <p className="font-semibold mt-3 ml-2 text-2xl">Tasks</p>
                        <div className="cards mt-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {
                                tasks
                                .slice() // Create a shallow copy to avoid mutating the state
                                .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)) // Sort: Pinned first
                                .map((value, index) => (
                                    <TaskCard 
                                        
                                        key={index} 
                                        title={value.title} 
                                        content={value.content} 
                                        priority={value.priority} 
                                        status={value.status} 
                                        assignedTo={value.assignedTo} 
                                        attachments={value.attachments} 
                                        inputTagArray={value.inputTagArray} 
                                        progress={value.progress} 
                                        date={value.date} 
                                    />
                                ))
                            }
                        </div>
                    </>

                    )

                }

                { assignedTasks.length >0 && (

                    <>
                        <p className="font-semibold mt-3 ml-2 text-2xl">Assigned Tasks</p>
                        <div className="cards mt-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {
                                assignedTasks.map((value, index) => (
                                    <TaskCard
                                        
                                        key={index} 
                                        title={value.title} 
                                        content={value.content} 
                                        priority={value.priority} 
                                        status={value.status} 
                                        assignedTo={null} 
                                        attachments={value.attachments} 
                                        inputTagArray={value.inputTagArray} 
                                        progress={value.progress} 
                                        date={value.date} 
                                    />
                                ))
                            }
                        </div>
                    
                    </>
                    )


                }


                <div className="add-notes flex items-center justify-end m-10">
                    <div
                        onClick={toggleModel}
                        className="notesplus cursor-pointer w-16 h-16 rounded-xl bg-blue-500 flex items-center justify-center"
                    >
                        <FaPlus className="text-white" />
                    </div>
                </div>
               
                {isModelOpen && <AddTask modelToggle={setIsModelOpen}/>}

            </div>
        </>
    );
};

export default Tasks;
