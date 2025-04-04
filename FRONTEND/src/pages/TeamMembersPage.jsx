import React from 'react'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import TeamMembers from '../components/TeamMembers'

const TeamMembersPage = () => {
    
    return (
        <>
            <div className="dashboard flex flex-col bg-gray-100 h-screen overflow-auto">
                <Navbar title={"Task Manager"} navbar={true} />

                <div className="flex flex-row h-full">
                    <SideBar />

                    <div className="content p-2 w-full flex-1 overflow-auto">
                        <TeamMembers/>
                    </div>
                </div>
            </div>
        
        </>
    )
}

export default TeamMembersPage
