import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { FaUserPlus } from "react-icons/fa"; // Friend request icon
import { MdOutlineCancel, MdCheckCircle } from "react-icons/md"; // Accept/Reject Icons
import MemberCard from "./MemberCard";

const TeamMembers = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [activeTab, setActiveTab] = useState("search");

    const { backendURL, userID, teamMembers, setTeamMembers, setFriendRequestsCount, friendRequestsCount } = useAuthStore();

    console.log("Friend Requests", friendRequests)
    console.log("Team Members", teamMembers)
    // Fetch all team members
    const fetchTeamMembers = useCallback(async () => {
        
        try{

            const { data } = await axios.get(`${backendURL}/team/get-all-team-members?userID=${userID}`);
            setTeamMembers(data.teamMembers || []);
        }
        catch(error){

            console.error("Couldn't Fetch Team Members:", error);
        }

    }, [backendURL, userID, setTeamMembers]);

    // Fetch friend requests
    const getFriendRequestsList = useCallback(async () => {
        try{

            const { data } = await axios.get(`${backendURL}/team/get-friend-requests-list?userID=${userID}`);
            setFriendRequests(data.friendRequests || []);
            setFriendRequestsCount(data.friendRequests?.length || 0);
        } 
        
        catch(error){

            console.error("Error fetching friend requests:", error);
        }
    }, [backendURL, userID, setFriendRequestsCount]);

    useEffect(() => {

        fetchTeamMembers();
        getFriendRequestsList();

    }, [fetchTeamMembers, getFriendRequestsList, friendRequestsCount]);
    // console.log(friendRequestsCount)

    const handleSearch = useCallback(async (query) => {
        setSearchQuery(query);
        if (!query.trim()) return setUsers([]);

        try{

            const { data } = await axios.get(`${backendURL}/team/get-search-members`, {
                params: { query, userID },
            });
            setUsers(data.users || []);
        } 
        
        catch(error){

            console.error("Search error:", error);
        }
    }, [backendURL, userID]);

    const handleSendRequest = useCallback(async (receiverID) =>{
        
        try{
            const { status } = await axios.post(`${backendURL}/team/send-friend-request`, { senderID: userID, receiverID });
            if (status >= 200 && status < 300) alert("Friend request sent successfully!");
        } 
        
        catch(error){

            if(error.response){

                const msg = error.response.status === 400 ? "You've already sent a request to this user." : error.response.data?.message;
                alert(`Error: ${msg || "Something went wrong"}`);
            } 
            else{

                alert("Network error! Please try again.");
            }
            console.error("Error sending request:", error);
        }
    }, [backendURL, userID]);

    
    const handleAcceptRequest = async (requestID, senderID) => {
        
        try{
            await axios.post(`${backendURL}/team/accept-friend-request`, { requestID,senderID,  userID });
            setFriendRequests((prev) => prev.filter((req) => req._id !== requestID));
            fetchTeamMembers(); 
        } 
        
        catch(error){

            console.error("Error accepting request:", error);
        }
    };

    const handleRejectRequest = async (requestID) => {
        
        try{
            await axios.post(`${backendURL}/team/reject-friend-request`, { requestID });
            setFriendRequests((prev) => prev.filter((req) => req._id !== requestID));
        } 
        catch(error){

            console.error("Error rejecting request:", error);
        }

    };

    return (
        <>
            <div className="p-6 bg-white shadow-lg rounded-lg w-full h-full mt-3 flex flex-col">
                
                <div className="flex justify-center space-x-4 mb-4">
                    
                    <button
                        className={`px-4 py-2 rounded ${activeTab === "search" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setActiveTab("search")}
                    >
                        Search Members
                    </button>
                    <button
                        className={`px-4 py-2 w-fit flex flex-row gap-2 rounded ${activeTab === "requests" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setActiveTab("requests")}
                    >
                        Friend Requests
                        <div className="bg-white text-black rounded-full w-7 h-7  flex items-center justify-center">

                            <p className="">{friendRequestsCount}</p>
                        </div>
                    </button>

                </div>

                
                {activeTab === "search" && (
                    <div className="search-team w-full flex flex-col items-center">
                        <h3 className="text-lg font-semibold mt-4 mb-2">Search Members</h3>
                        <div className="relative w-1/4">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                className="border-2 border-black outline-0 p-2 rounded-md w-full mb-2"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            {users.length > 0 && (
                                <ul className="absolute left-0 right-0 bg-white border rounded shadow-md mt-1 max-h-40 overflow-auto">
                                    {users.map((user) => (
                                        <li key={user._id} className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                                            <span>{user.name} ({user.email})</span>
                                            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleSendRequest(user._id)}>
                                                <FaUserPlus size={18} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        
                        <div className="team-members w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {teamMembers.map((value, index) => {
                                    console.log("value", value)
                                    return <MemberCard 
                                        member={value.sender._id === userID ? value.receiver : value.sender} 
                                        key={index} 
                                    />
                                })}
                            </div>
                        </div>
                    </div>
                )}

                
                {activeTab === "requests" && (
                    <div className="friend-requests w-full flex flex-col items-center">
                        <h3 className="text-lg font-semibold mt-4 mb-2">Friend Requests</h3>
                        {friendRequests.length === 0 ? (
                            <p className="text-gray-500">No friend requests yet.</p>
                        ) : (
                            <ul className="w-1/4 border rounded shadow-md p-4">
                                {friendRequests.map((request) => (
                                    <li key={request._id} className="flex justify-between items-center p-2 border-b">
                                        <span>{request.sender.name} ({request.sender.email})</span>
                                        <div className="flex space-x-2">
                                            <button className="text-green-500 hover:text-green-700" onClick={() => handleAcceptRequest(request._id, request.sender._id)}>
                                                <MdCheckCircle size={20} />
                                            </button>
                                            <button className="text-red-500 hover:text-red-700" onClick={() => handleRejectRequest(request._id)}>
                                                <MdOutlineCancel size={20} />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default TeamMembers;
