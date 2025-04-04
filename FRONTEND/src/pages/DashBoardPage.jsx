import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import useAuthStore from "../store/authStore";
import TaskStatistics from "../components/TaskStatistics";
import Tasks from "../components/Tasks";
import TeamMembers from "../components/TeamMembers";
import TaskManager from "../components/TaskManager";

const DashBoardPage = () => {
    
    const { isDashboardSelected, isManageTaskSelected, isAllTaskSelected, isTeamMembersSelected } = useAuthStore();
    
    const {tasks, getAllTasks} = useAuthStore()
    
    useEffect(()=>{

        getAllTasks();

    },[])
    
        
    return (
        <>
        <div className="dashboard flex flex-col bg-gray-100 h-screen overflow-auto">
            <Navbar title={"Task Manager"} navbar={true} />

            <div className="flex flex-row h-full">
            <SideBar />

            <div className="content p-2 w-full flex-1 overflow-auto">
                <TaskStatistics tasks={tasks}/>
            </div>
            </div>
        </div>
        </>
    );
};

export default DashBoardPage;
