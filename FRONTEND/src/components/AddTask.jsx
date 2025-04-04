import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { MdAdd, MdClose } from "react-icons/md";
import useAuthStore from "../store/authStore";

const AddTask = ({ modelToggle}) => {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [status, setStatus] = useState("Pending");
    const [assignedTo, setAssignedTo] = useState([]);
    const [attachments, setAttachments] = useState(null);
    const [progress, setProgress] = useState(0);
    const [inputTag, setInputTag] = useState("");
    const [inputTagArray, setInputTagArray] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const {user, userID, backendURL, getAllTasks, setIsModelOpen} = useAuthStore();

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
        if (!assignedTo.find((u) => u._id === user._id)) {
          setAssignedTo([...assignedTo, user]);
        }
        setSearchQuery("");
        setSearchResults([]);
    };
    
    const removeAssignedUser = (id) => {
    setAssignedTo(assignedTo.filter((user) => user._id !== id));
    };
    
    const addNewTag = (e) => {
        e.preventDefault();
        if (inputTag.trim() !== "") {
            setInputTagArray([...inputTagArray, inputTag.trim()]);
            setInputTag("");
        }
    };

    const removeTag = (index) => {
        setInputTagArray(inputTagArray.filter((_, i) => i !== index));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("priority", priority);
        formData.append("status", status);
        formData.append("assignedTo", JSON.stringify(assignedTo.map(user => user.username)));
        formData.append("createdBy", userID);
        formData.append("progress", progress);
        formData.append("attachments", attachments);
        formData.append("inputTagArray", JSON.stringify(inputTagArray));

        // for(let pair of formData.entries()){

        //     console.log(pair[0] + ':', pair[1]);
        // }
        try{

            const response = await fetch(`${backendURL}/task/create-task`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if(response.ok){

                console.log("Task added successfully!");

                await getAllTasks();
                setIsModelOpen(false)

            }
            setTitle("");
            setContent("");
            setPriority("Medium");
            setStatus("Pending");
            setAssignedTo([]);
            setProgress(0);
            setInputTagArray([]);

        } 
        
        catch(error){

            console.log("Error adding task:", error);
        } 
        
        finally{

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
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Content"
                            className="w-full bg-gray-100 h-32 p-2 rounded-lg"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>

                        <select
                            className="w-full bg-gray-100 h-12 p-2 rounded-lg"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>

                        <select
                            className="w-full bg-gray-100 h-12 p-2 rounded-lg"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
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
                        {searchResults.length > 0 && (
                            <div className="bg-white border rounded-md shadow-md max-h-40 overflow-y-auto">
                            {searchResults.map((user) => (
                                <div
                                key={user._id}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => selectUser(user)}
                                >
                                {user.username} 
                                </div>
                            ))}
                            </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {assignedTo.map((user) => (
                            <div key={user._id} className="bg-gray-200 px-3 py-1 rounded-lg flex items-center gap-2">
                                <span>{user.username}</span>
                                <MdClose className="cursor-pointer text-gray-500" onClick={() => removeAssignedUser(user._id)} />
                            </div>
                            ))}
                        </div>

                        <input type="file" className="w-full" onChange={(e) => setAttachments(e.target.files[0])} />
                        <input
                            type="number"
                            placeholder="Progress %"
                            className="w-full bg-gray-100 h-12 pl-2 rounded-lg"
                            value={progress}
                            onChange={(e) => setProgress(Number(e.target.value))}
                        />

                        <div>
                            <label className="block text-gray-700 font-bold">Tags</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {inputTagArray.map((tag, index) => (
                                    <div key={index} className="bg-gray-200 px-3 py-1 rounded-lg flex items-center gap-2">
                                        <span>{tag}</span>
                                        <MdClose className="cursor-pointer text-gray-500" onClick={() => removeTag(index)} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputTag}
                                    onChange={(e) => setInputTag(e.target.value)}
                                    className="border-gray-200 p-2 border-2 rounded-sm"
                                    placeholder="Add Tags"
                                    onKeyDown={(e) => e.key === "Enter" && addNewTag(e)}
                                />
                                <button
                                    className="bg-blue-500 text-white p-2 rounded-md h-10 w-10 flex items-center justify-center"
                                    onClick={addNewTag}
                                >
                                    <MdAdd />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-blue-500 text-white rounded-lg py-2 font-semibold ${
                                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                            }`}
                        >
                            {isSubmitting ? "Adding Task..." : "Add Task"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddTask;
