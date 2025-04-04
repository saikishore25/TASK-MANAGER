import express from "express"
import { getAllTeamMembers, getSearchTeamMembers,getSearchMembers, sendFriendRequest, getFriendRequestsList, acceptFriendRequest, rejectFriendRequest, getTeamMemberProfile } from "../controllers/teamController.js";

const router = express.Router();

router.get("/get-all-team-members", getAllTeamMembers);
router.get("/get-search-team-members", getSearchTeamMembers);
router.get("/get-search-members", getSearchMembers);
router.post("/send-friend-request", sendFriendRequest);
router.get("/get-friend-requests-list", getFriendRequestsList);
router.post("/accept-friend-request", acceptFriendRequest);
router.post("/reject-friend-request", rejectFriendRequest);
router.post("/get-team-member-profile", getTeamMemberProfile);

export default router;