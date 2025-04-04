import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { MdAdd, MdClose } from "react-icons/md";
import useAuthStore from "../store/authStore";

const EditTask = ({ modelToggle, task }) => {
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [updatedContent, setUpdatedContent] = useState("");
    const [updatedPriority, setUpdatedPriority] = useState("Medium");
    const [updatedStatus, setUpdatedStatus] = useState("Pending");
    const [updatedAssignedTo, setUpdatedAssignedTo] = useState([]);
    const [updatedAttachments, setUpdatedAttachments] = useState(null);
    const [updatedProgress, setUpdatedProgress] = useState(0);
    const [updatedInputTag, setUpdatedInputTag] = useState("");
    const [updatedInputTagArray, setUpdatedInputTagArray] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const { userID, backendURL, getAllTasks, setIsModelOpen } = useAuthStore();

    // Populate form fields when a task is provided
    useEffect(() => {
        if (task) {
            setUpdatedTitle(task.title || "");
            setUpdatedContent(task.content || "");
            setUpdatedPriority(task.priority || "Medium");
            setUpdatedStatus(task.status || "Pending");
            setUpdatedAssignedTo(task.assignedTo || []);
            setUpdatedProgress(task.progress || 0);
            setUpdatedInputTagArray(task.tags || []);
        }
    }, [task]);

    const searchTeamMembers = async (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await fetch(
                `${backendURL}/team/get-search-team-members?query=${query}&userID=${userID}`
            );
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.users || []);
            }
        } catch (error) {
            console.error("Error searching team members:", error);
        }
    };

    const selectUser = (user) => {
        if (!updatedAssignedTo.find((u) => u._id === user._id)) {
            setUpdatedAssignedTo([...updatedAssignedTo, user]);
        }
        setSearchQuery("");
        setSearchResults([]);
    };

    const removeAssignedUser = (id) => {
        setUpdatedAssignedTo(updatedAssignedTo.filter((user) => user._id !== id));
    };

    const addNewTag = (e) => {
        e.preventDefault();
        if (updatedInputTag.trim() !== "") {
            setUpdatedInputTagArray([...updatedInputTagArray, updatedInputTag.trim()]);
            setUpdatedInputTag("");
        }
    };

    const removeTag = (index) => {
        setUpdatedInputTagArray(updatedInputTagArray.filter((_, i) => i !== index));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("title", updatedTitle);
        formData.append("content", updatedContent);
        formData.append("priority", updatedPriority);
        formData.append("status", updatedStatus);
        formData.append("assignedTo", JSON.stringify(updatedAssignedTo.map(user => user.username)));
        formData.append("progress", updatedProgress);
        if (updatedAttachments) formData.append("attachments", updatedAttachments);
        formData.append("inputTagArray", JSON.stringify(updatedInputTagArray));

        try {
            const response = await fetch(`${backendURL}/task/update-task/${task._id}`, {
                method: "PUT",
                body: formData,
                credentials: "include",
            });

            if (response.ok) {
                console.log("Task updated successfully!");
                await getAllTasks();
                setIsModelOpen(false);
            }
        } 
        
        catch (error){

            console.log("Error updating task:", error);
        } 
        finally{
            modelToggle(false)
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white shadow-lg rounded-xl p-6 w-1/2">
                    <div className="flex justify-end">
                        <FaTimes
                            className="text-gray-400 h-7 w-7 p-1 rounded-full cursor-pointer hover:bg-gray-200"
                            onClick={() => modelToggle(false)}
                        />
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full bg-gray-100 h-10 pl-2 rounded-lg"
                            value={updatedTitle}
                            onChange={(e) => setUpdatedTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Content"
                            className="w-full bg-gray-100 h-32 p-2 rounded-lg"
                            value={updatedContent}
                            onChange={(e) => setUpdatedContent(e.target.value)}
                        ></textarea>

                        <select
                            className="w-full bg-gray-100 h-12 p-2 rounded-lg"
                            value={updatedPriority}
                            onChange={(e) => setUpdatedPriority(e.target.value)}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>

                        <select
                            className="w-full bg-gray-100 h-12 p-2 rounded-lg"
                            value={updatedStatus}
                            onChange={(e) => setUpdatedStatus(e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Search Team Members"
                            className="w-full bg-gray-100 h-10 pl-2 rounded-lg"
                            value={searchQuery}
                            onChange={(e) => searchTeamMembers(e.target.value)}
                        />
                        <div className="flex flex-wrap gap-2">
                            {updatedAssignedTo.map((user, index) => (
                                <div key={index} className="bg-gray-200 px-3 py-1 rounded-lg flex items-center gap-2">
                                    <span>{user.username}</span>
                                    <MdClose className="cursor-pointer text-gray-500" onClick={() => removeAssignedUser(user._id)} />
                                </div>
                            ))}
                        </div>

                        <input type="file" className="w-full" onChange={(e) => setUpdatedAttachments(e.target.files[0])} />
                        <input
                            type="number"
                            placeholder="Progress %"
                            className="w-full bg-gray-100 h-12 pl-2 rounded-lg"
                            value={updatedProgress}
                            onChange={(e) => setUpdatedProgress(Number(e.target.value))}
                        />

                        <div>
                            <label className="block text-gray-700 font-bold">Tags</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={updatedInputTag}
                                    onChange={(e) => setUpdatedInputTag(e.target.value)}
                                    className="border-gray-200 p-2 border-2 rounded-sm"
                                    placeholder="Add Tags"
                                    onKeyDown={(e) => e.key === "Enter" && addNewTag(e)}
                                />
                                <button className="bg-blue-500 text-white p-2 rounded-md" onClick={addNewTag}>
                                    <MdAdd />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-green-500 text-white rounded-lg py-2 font-semibold ${
                                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
                            }`}
                        >
                            {isSubmitting ? "Updating Task..." : "Update Task"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditTask;
