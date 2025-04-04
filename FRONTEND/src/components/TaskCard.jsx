import React from "react";

import {FaPaperclip } from "react-icons/fa";
const TaskCard = ({title, content, priority, status, assignedTo, attachments, inputTagArray, progress, date }) => {

   
    const priorityColors = {
        Low: "bg-green-200 text-green-700",
        Medium: "bg-yellow-200 text-yellow-700",
        High: "bg-red-200 text-red-700",
    };

    
    const statusColors = {
        Pending: "bg-gray-200 text-gray-700",
        "In Progress": "bg-blue-200 text-blue-700",
        Completed: "bg-green-200 text-green-700",
    };

    

    return (
        <div className="w-96 h-60 cursor-pointer bg-white rounded-xl shadow-md p-4 m-2 hover:shadow-lg transition-all duration-300">
            
            {/* Header: Title & Date */}
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-gray-500 text-sm">{new Date(date).toLocaleDateString()}</p>
            </div>

            {/* Task Content */}
            <p className="text-gray-700 mt-2 line-clamp-2">{content}</p>

            {/* Priority, Status & Progress */}
            <div className="mt-3 flex flex-wrap gap-2">
                <span className={`px-2 py-1 text-sm font-medium rounded ${priorityColors[priority]}`}>
                    {priority}
                </span>
                <span className={`px-2 py-1 text-sm font-medium rounded ${statusColors[status]}`}>
                    {status}
                </span>
                {progress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                )}
            </div>

            {/* Assigned To */}
            {assignedTo && (
                <p className="text-gray-500 text-sm mt-2 ">
                    <strong>Assigned to: </strong>{assignedTo.join(", ")}
                </p>
            )}

            {/* Tags */}
            {inputTagArray.length > 0 && (
                <div className="mt-2 text-gray-600 text-sm flex flex-wrap gap-1">
                    {inputTagArray.map((tag, index) => (
                        <span key={index} className="bg-gray-200 px-2 py-1 rounded text-xs">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Attachments */}
            {attachments && (
                <div className="mt-2 flex items-center gap-2 text-blue-600 text-sm cursor-pointer">
                    <FaPaperclip />
                    <a href={attachments} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        View Attachment
                    </a>
                </div>
            )}

            
        </div>
    );
};

export default TaskCard;
