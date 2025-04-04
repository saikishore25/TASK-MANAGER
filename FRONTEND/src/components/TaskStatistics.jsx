import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth } from "date-fns";

import { FaTasks, FaCheckCircle, FaClock } from "react-icons/fa";

import useAuthStore from "../store/authStore";

const TaskStatistics = ({ tasks }) => {

    const groupedTasks = tasks.reduce((acc, task) => {
        const date = new Date(task.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + (task.status === "Completed" ? 1 : 0);
        return acc;
    }, {});
    
    const data = Object.entries(groupedTasks).map(([date, count]) => ({
    date,
    completed: count,
    }));
    
    const taskStats = {
        total: tasks.length, // ✅ Corrected
        pending: tasks?.filter(task => task.status === "Pending").length || 0,
        completed: tasks?.filter(task => task.status === "Completed").length || 0,
        inProgress: tasks?.filter(task => task.status === "In Progress").length || 0,
    };
    
    const priorityStats = {
        low: tasks?.filter(task => task.priority === "Low").length || 0,
        medium: tasks?.filter(task => task.priority === "Medium").length || 0,
        high: tasks?.filter(task => task.priority === "High").length || 0,
    };
    
    
    const pieData = [
        { name: "Pending", value: taskStats.pending, color: "#FFBB28" },
        { name: "Completed", value: taskStats.completed, color: "#00C49F" },
        { name: "In Progress", value: taskStats.inProgress, color: "#0088FE" },
    ];

    const barData = [
        { name: "Low", value: priorityStats.low, color: "#8884d8" },
        { name: "Medium", value: priorityStats.medium, color: "#82ca9d" },
        { name: "High", value: priorityStats.high, color: "#FF8042" },
    ];
    
    const totalTasks = tasks.length || 0;
    const progressPercentage = totalTasks > 0 ? (taskStats.inProgress / totalTasks) * 100 : 0;
    
    const { user } = useAuthStore();

    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Extract task dates
    const taskDates = tasks.map(task => format(new Date(task.createdAt), "yyyy-MM-dd"));

    console.log("Task Dates", taskDates)
    // Generate calendar days
    const generateCalendar = () => {
        const startDate = startOfWeek(startOfMonth(currentMonth));
        const endDate = endOfWeek(endOfMonth(currentMonth));

        const days = [];
        let day = startDate;

        while (day <= endDate) {
        days.push(day);
        day = addDays(day, 1);
        }

        return days;
    };

    
    return(
        <>
            <div className="mt-3 flex flex-col w-full gap-5 ">
                
                <div className="flex flex-col bg-white p-3 rounded-xl ">

                    <div className="flex flex-col mb-2">

                        <h2 className="text-xl font-bold text-gray-800">Hello, {user}!</h2>
                        <h2>{new Date().toLocaleString()}</h2>

                    </div>

                    <div className="grid grid-cols-4 gap-0 text-center text-lg font-semibold">
                        
                        <div className="text-purple-800 flex items-center justify-center gap-2">
                        <FaClock size={20} /> Total: {taskStats.total}
                        </div>
                        <div className="text-yellow-500 flex items-center justify-center gap-2">
                        <FaClock size={20} /> Pending: {taskStats.pending}
                        </div>
                        <div className="text-green-500 flex items-center justify-center gap-2">
                        <FaCheckCircle size={20} /> Completed: {taskStats.completed}
                        </div>
                        <div className="text-blue-500 flex items-center justify-center gap-2">
                        <FaTasks size={20} /> In Progress: {taskStats.inProgress}
                        </div>
                    </div>

                </div>

            
                <div className="grid grid-cols-2 gap-6 ">
                    
                    <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow">
                        <h3 className="text-lg font-semibold mb-2">Task Status Distribution</h3>
                        <PieChart width={300} height={300}>
                            <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>

                    
                    <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow">
                        <h3 className="text-lg font-semibold mb-2">Task Priority Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value">
                                {barData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            
                <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    
                    <div
                    className="bg-blue-500 h-6 text-center text-white text-sm flex items-center justify-center"
                    style={{ width: `${progressPercentage}%` }}
                    >
                    {progressPercentage.toFixed(1)}

                    </div>

                </div>
                

                <div className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-around flex-row ">
                    
                    <div className="shadow-lg">

                        <h2 className="text-xl font-semibold mb-3">Task Completion Over Time</h2>
                        <BarChart width={400} height={250} data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="completed" fill="#82ca9d" />
                        </BarChart>

                    </div>

                    

                    <div className=" p-4 rounded-lg shadow-lg ">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={() => setCurrentMonth(addDays(currentMonth, -30))} className="px-3 py-1 bg-gray-200 rounded">Prev</button>
                            <h2 className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
                            <button onClick={() => setCurrentMonth(addDays(currentMonth, 30))} className="px-3 py-1 bg-gray-200 rounded">Next</button>
                        </div>

                        <div className="grid grid-cols-7 gap-2 text-center">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                            <div key={index} className="font-semibold">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2 mt-2">
                            {generateCalendar().map((day, index) => {
                            const formattedDate = format(day, "yyyy-MM-dd");
                            const hasTask = taskDates.includes(formattedDate);

                            return (
                                <div
                                key={index}
                                className={`p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm
                                    ${isSameMonth(day, currentMonth) ? "text-black" : "text-gray-400"}
                                    ${hasTask ? "bg-blue-500 text-white font-bold" : "bg-gray-100"}
                                    `}
                                >
                                {format(day, "d")}
                                </div>
                            );
                            })}
                        </div>
                    </div>

                    
                </div>   

            </div>
        </>
    );
};

export default TaskStatistics;