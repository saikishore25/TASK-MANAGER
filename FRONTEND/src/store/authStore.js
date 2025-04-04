import { create } from "zustand";
import { persist } from "zustand/middleware";  // ✅ Import persist middleware
import axios from "axios";

const useAuthStore = create(
    
    persist(
        
        (set, get) => ({
            isAuthenticated: false,
            setIsAuthenticated: (value)=>set({isAuthenticated:value}),
            user: null,
            setUser: (value) => set({ user: value }),
            userID: null,
            setUserID: (value)=> set({userID: value}),
            tasks: [],
            assignedTasks: [],
            setAssignedTasks: (newTasks)=> set({ assignedTasks: Array.isArray(newTasks) ? newTasks : [] }),
            userAvatar: "",
            setUserAvatar: (value)=>set({userAvatar:value}),
            setTasks: (newTasks) => set({ tasks: Array.isArray(newTasks) ? newTasks : [] }),
            teamMembers: [],
            setTeamMembers: (value) =>set({teamMembers:value}),
            teamMembersProfile: [],
            setTeamMembersProfile: (value) =>set({teamMembersProfile:value}),
            backendURL: import.meta.env.VITE_BACKEND_URL,
            isModelOpen:false,
            setIsModelOpen: (value)=>set({isModelOpen:value}),
            friendRequestsCount: 0,
            setFriendRequestsCount: (value) => set({friendRequestsCount:value}),
            

            checkAuth: async () => {
                
                try{
                    const response = await fetch(`${get().backendURL}/auth/check-auth`, {
                        method: "GET",
                        credentials: "include",
                    });

                    if(response.ok){

                        const responseData = await response.json();
                        set({ isAuthenticated: true, user: responseData.user });
                    } 

                    else{

                        set({ isAuthenticated: false, user: null });
                    }
                } 
                
                catch (error){

                    console.error("Error checking authentication:", error);
                    set({ isAuthenticated: false, user: null });
                }

            },

            getAllTasks: async()=>{
            
                try{
        
                    const response = await fetch(`${get().backendURL}/task/get-all-tasks`, {
        
                        method:"POST",
                        credentials:"include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ userID: get().userID })
                        
                    })
        
                    if(response.ok){
        
                        const responseData = await response.json();
                        console.log(responseData);
                        set({ tasks: responseData.tasks })
                        
                    }
        
                }
        
                catch(error){
        
                    console.log("Unable to Get All Tasks", error);
        
                }
        
            },



            getAllAssignedTasks: async()=>{

                try{
                    
                    const response = await fetch(`${get().backendURL}/task/get-assigned-tasks`, {
        
                        method:"POST",
                        credentials:"include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ userID: get().userID })
                        
                    })

                    if(response.ok){

                        const responseData = await response.json();
                        console.log(responseData);
                        get().setAssignedTasks(responseData.assignedTasks)

                    }

                }

                catch(error){

                    console.log("Failed To Assigned Tasks");

                }

            },
            
            getAllTeamMembers: async()=>{

                try{

                    const response = await fetch(`${get().backendURL}/team/get-all-team-members`, {
        
                        method:"POST",
                        credentials:"include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ userID: get().userID })
                        
                    })

                    

                }

                catch(error){
                        

                }
            },

            deleteTaskFromDB : async(taskID)=>{

                try{

                    if(window.confirm("Are you sure you want to delete this task?")){

                        try{
                            const responseData = await axios.delete(`${get().backendURL}/task/delete-task/${taskID}/${get().userID}`);
                            console.log(responseData.data);
                            get().deleteTask(taskID);

                        } 
                        
                        catch(error){

                            console.error("Error deleting task:", error);
                            alert("Failed to Delete Task. Please try again.");
                            return;
                        }
                    }
                }

                catch(error){

                    console.log("Error Deleting Task Please try Again", error);
                    alert("Failed to Delete Task");

                }
            },

            taskPinToggle: async(taskID)=>{

                try{

                    const responseData = await axios.post(`${get().backendURL}/task/toggle-pin-task`, {taskID});
                    console.log(responseData.data);
                    get().togglePin(taskID);

                }

                catch(error){

                    console.log("Failed to pin/unpin task", error);

                }
            },

            togglePin: (id) => {
                const updatedTasks = get().tasks.map(task => 
                    task._id === id ? { ...task, isPinned: !task.isPinned } : task
                );
            
                console.log("Updated Tasks after pin toggle:", updatedTasks); // Debugging log
                get().setTasks(updatedTasks);
            },
        
            
            deleteTask: (taskID) => {
                get().setTasks(get().tasks.filter(task => task._id !== taskID));
            },
        
            
            editTask : (id) => {
                alert(`Edit Task ID: ${id}`); // You can replace this with a modal for editing
            }

        }),

        {
            name: "auth-storage",  // ✅ Key for localStorage
            getStorage: () => localStorage, // ✅ Stores state in localStorage
        }
    )
);

export default useAuthStore;
