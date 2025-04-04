import React from "react";
import { FaTasks, FaPlus, FaUsers, FaSignOutAlt, FaColumns } from "react-icons/fa";
import useAuthStore from "../store/authStore";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const SideBar = () => {
    const { 
        user, 
        isAuthenticated,  
        backendURL,
        tasks,
        setTasks,
        setTeamMembers,
        userAvatar,
        setUserAvatar
    } = useAuthStore();
    console.log(user)

    const navigate = useNavigate();
    const location = useLocation();

    

    const handleLogout = async()=>{

        try{

            const response = await fetch(`${backendURL}/auth/logout`, {

                method:"POST", 
                headers:  {"Content-Type": "application/json"},
                credentials:"include"
            })

            if(response.ok){

                const responseData = await response.json();
                console.log(responseData);
                setTasks([])
                setTeamMembers([])
                setUserAvatar("")
                localStorage.clear();
                navigate("/");
            }

        }

        catch(error){

            console.log("Error Logging Out", error);

        }
    }

    console.log(user);
    return(

        <>
            <div className="h-full w-80 bg-white mt-5 rounded-md text-black flex flex-col p-4 shadow-lg">
                
               
                <div className="flex flex-col items-center border-b border-gray-700 pb-4">
                    <img
                        src={`${userAvatar}`} 
                        alt="User Avatar"
                        className="w-16 h-16 rounded-full border-2 border-blue-500"
                    />
                    <h2 className="mt-3 text-lg font-semibold">{user || "Guest"}</h2>
                    <p className="text-sm text-gray-400">{isAuthenticated ? "Logged In" : "Not Logged In"}</p>
                </div>

                
                <nav className="mt-6 flex flex-col items-start justify-center w-full">
                    
                    <ul className="flex flex-col gap-2 w-full">
                        <li>
                            <button 
                                onClick={() => navigate("/dashboard")}  
                                className={`flex items-center p-3 w-full rounded-lg transition ${location.pathname === "/dashboard" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}` }
                            >
                                <FaColumns className="mr-3" /> Dashboard
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={() => navigate("/manage-tasks")}  
                                className={`flex items-center p-3 w-full rounded-lg transition ${location.pathname === "/manage-tasks" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
                            >
                                <FaTasks className="mr-3" /> Manage Tasks
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={() => navigate("/create-task")}  
                                className={`flex items-center p-3 w-full rounded-lg transition ${location.pathname === "/create-task" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
                            >
                                <FaPlus className="mr-3" />Create Task
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={() => navigate("/team-members")}  
                                className={` flex items-center p-3 w-full rounded-lg transition ${location.pathname === "/team-members" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
                            >
                                <FaUsers className="mr-3" /> Team Members
                            </button>
                        </li>
                    </ul>
                </nav>

                
                <button onClick={()=>handleLogout()} className="flex items-center w-full p-3 mt-auto bg-red-600 hover:bg-red-700 rounded-lg transition">
                    <FaSignOutAlt className="mr-3" /> Logout
                </button>
            </div>
        </>
    );
};

export default SideBar;
