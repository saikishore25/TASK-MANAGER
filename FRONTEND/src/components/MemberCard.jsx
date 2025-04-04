import React, { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import TeamMembers from './TeamMembers';


const MemberCard = ({ member }) => {
    
    
    const {backendURL, userID, teamMembersProfile, setTeamMembersProfile, userAvatar} = useAuthStore();
    console.log("Member", member)
    console.log(teamMembersProfile);

    const getProfile = async()=>{

        try{

            const responseData = await axios.post(`${backendURL}/team/get-team-member-profile`, {memberID: member._id});
            setTeamMembersProfile(responseData.data.teamMemberProfile);

        }

        catch(error){

            console.log("Error Find Profile Details", error);

        }

    }

    useEffect(()=>{

        getProfile();

    },[])

    return (
        <>
            <div className="w-64 bg-white shadow-md rounded-lg p-4 mb-4">
                {/* Profile Picture */}
                <div className="flex justify-center mb-4">
                    <img
                        src={`${member.avatar}`} 
                        alt={member.name|| null}
                        className="w-24 h-24 rounded-full object-cover"
                    />
                </div>

                {/* Member Details */}
                <div className="text-center">
                    <h3 className="text-xl font-semibold">{member.username || null}</h3>
                    <p className="text-gray-500">{member.email}</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-around">
                    <button className="text-blue-500 hover:text-blue-700">View Profile</button>
                    <button className="text-green-500 hover:text-green-700">Send Message</button>
                </div>
            </div>
        </>
    );
};

export default MemberCard;
