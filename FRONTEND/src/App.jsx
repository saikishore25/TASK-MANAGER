import React, { useEffect } from 'react'
import {Routes, Route} from "react-router-dom"
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/LandingPage'
import LandingPage from './pages/LandingPage'
import DashBoardPage from './pages/DashBoardPage'
import useAuthStore from './store/authStore'
import ManageTasksPage from './pages/ManageTasksPage'
import Tasks from './components/Tasks'
import CreateTaskPage from './pages/CreateTaskPage'
import TeamMembersPage from './pages/TeamMembersPage'

const App = () => {
    
    const {isAuthenticated, user, checkAuth} = useAuthStore();
    console.log(isAuthenticated, user)

    
    useEffect(() => {
      
        checkAuth(); 
    
    }, []);

    
    return (
      <>  
        <Routes>

            <Route path="/" element={<LandingPage/>}></Route> 
            <Route path="/dashboard" element={<DashBoardPage/>}></Route>
            <Route path="/manage-tasks" element={<ManageTasksPage/>}></Route>
            <Route path="/create-task" element={<CreateTaskPage/>}></Route>
            <Route path="/team-members" element={<TeamMembersPage/>}></Route>
            <Route path="/login" element={<LoginPage/>}></Route>
            <Route path="/signup" element={<SignUpPage/>}></Route>

        </Routes>
        
      </>
    )

}

export default App
