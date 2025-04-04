import teamModel from "../models/teamModel.js";
import userModel from "../models/userModel.js";

const getSearchTeamMembers = async(req, res)=>{

    try{

        const { query, userID } = req.query; 
        console.log("Search Query:", query, "Logged-in UserID:", userID);

        if(!query || !userID){

            return res.status(400).json({ message: "Search query is Empty"});
        }

        const user = await userModel.findById(userID).populate("teamMembers", "username email _id");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Filter team members based on the search query
        const filteredMembers = user.teamMembers.filter(member =>
            member.username.toLowerCase().includes(query.toLowerCase())
        );

        console.log("Filtered Team Members:", filteredMembers);
        return res.json({ message: "Users Found", users: filteredMembers });

    }

    catch(error){
        
        console.error("Error searching team members:", error);
        return res.status(500).json({ message: "Internal Server Error" });

    }
}

const getSearchMembers = async(req, res)=>{

    try{

        const { query, userID } = req.query; 
        console.log("Search Query:", query, "Logged-in UserID:", userID);

        if(!query || !userID){

            return res.status(400).json({ message: "Search query is Empty"});
        }

        const users = await userModel.find({
            _id: { $ne: userID }, 
            username: { $regex: query, $options: "i" } 
        }).select("username email _id");

        console.log("Users:", users)
        return res.json({message:"Users Are Found",users:users});

    }

    catch(error){
        
        console.error("Error searching team members:", error);
        return res.status(500).json({ message: "Internal Server Error" });

    }
}

const sendFriendRequest = async(req, res)=>{

    try{

        const { senderID, receiverID } = req.body;

        if(!senderID || !receiverID){

            console.log("Both senderID and receiverID required")
            return res.status(400).json({ message: "Both senderID and receiverID are required."});

        }

        const existingRequest = await teamModel.findOne({ $or: [
            { sender: senderID, receiver: receiverID },
            { sender: receiverID, receiver: senderID }
        ]});

        if(existingRequest){

            console.log("Friend Request Already Sent")
            return res.status(400).json({ message: "Friend request already sent.",  });
        }

        // Create new friend request
        const newRequest = new teamModel({
            sender: senderID,
            receiver: receiverID,
            status: "pending", // Default status
        });

        await newRequest.save();

        return res.status(201).json({ message: "Friend request sent successfully!"});

    } 
    
    catch(error){

        console.error("Error sending friend request:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

const getFriendRequestsList = async(req, res)=>{

    try{

        const {userID} = req.query;
        console.log(userID);

        const friendRequests = await teamModel.find({receiver:userID, status:"pending"}).populate("sender", "name email") // Populate sender details
        .lean(); 
        console.log("Friend Request Senders:", friendRequests);

        if(!friendRequests.length){

            return res.json({ message: "No Friend Requests At Present", friendRequests: [] });
        }

        return res.json({message:"Friend Requests Received Are:", friendRequests});

    }

    catch(error){

        console.log("Error in Fetching Friend Requests", error);
        return res.json({message:"Error in Fetching Friend Requests"})

    }
}


const acceptFriendRequest = async (req, res) => {
    
    try{
        
        const { requestID, senderID,  userID } = req.body;
        
        const request = await teamModel.findById(requestID);

        if(!request){

            return res.status(404).json({ message: "Friend request not found" });
        }

        if(request.status === "accepted"){

            return res.status(400).json({ message: "Friend request already accepted" });

        }

        const user = await userModel.findOne({_id:userID});

        if(!user){

            console.log("User Doesnt Exists for adding team member");
            return res.json({message:"User Doesnt exist for adding team member"});

        }

        const updatedTeam1 = await userModel.findByIdAndUpdate(
            userID, 
            { $addToSet: { teamMembers: senderID } }, // Prevent duplicate entries
            { new: true }
        );
        const updatedTeam2 = await userModel.findByIdAndUpdate(
            senderID, 
            { $addToSet: { teamMembers: userID } }, // Prevent duplicate entries
            { new: true }

        )
        

        request.status = "accepted"
        await request.save();

        return res.status(200).json({ message: "Friend request accepted successfully" });
    } 
    
    catch(error){

        console.error("Error in accepting friend request:", error);
        return res.status(500).json({ message: "Error in accepting friend request" });
    }
};


const rejectFriendRequest = async (req, res) => {
    try {
        const { requestID } = req.body;

        // Find and remove the friend request
        const request = await teamModel.findById(requestID);

        if (!request) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        // Remove the request from the database
        await request.deleteOne();

        return res.status(200).json({ message: "Friend request rejected successfully" });
    } catch (error) {
        console.error("Error in rejecting friend request:", error);
        return res.status(500).json({ message: "Error in rejecting friend request" });
    }
};

const getAllTeamMembers = async (req, res) => {
    try{
        const { userID } = req.query; // Assuming userID is passed as a query parameter
        
        console.log("User ID from all team memebers", userID)
        const acceptedRequests = await teamModel.find({
            $or: [
                { receiver: userID, status: "accepted" }, // Case when the user is the receiver
                { sender: userID, status: "accepted" }    // Case when the user is the sender
            ]
        })
        .populate("sender", "name email avatar")  // Populate sender details
        .populate("receiver", "name email avatar") // Populate receiver details
        .lean();
        
        console.log("Team members",acceptedRequests)
        if (!acceptedRequests.length) {
            return res.status(404).json({ message: "No accepted friend requests found." });
        }

        return res.status(200).json({ message: "Accepted friend requests fetched successfully.", teamMembers:acceptedRequests });
    } 
    
    catch (error) {
        console.error("Error in fetching accepted friend requests:", error);
        return res.status(500).json({ message: "Error in fetching accepted friend requests." });
    }
};

const getTeamMemberProfile = async(req, res)=>{

    try{

        const {memberID} = req.body;
        console.log(memberID);

        if(!memberID){

            console.log("Member userID not available");
            return res.json({message:"Member userID required"});

        }

        const memberProfile = await userModel.findOne({_id:memberID});

        if(!memberProfile){

            console.log("Couldn't Find Member Profile");
            return res.json({message:"Couldn't Find Member Profile"})
        }
        console.log("Found Member Profile", memberProfile)

        return res.json({message:"Found Member Profile", teamMemberProfile: memberProfile})
    }

    catch(error){


    }
}

export {getAllTeamMembers, getSearchTeamMembers, getSearchMembers, sendFriendRequest, getFriendRequestsList, rejectFriendRequest, acceptFriendRequest, getTeamMemberProfile}