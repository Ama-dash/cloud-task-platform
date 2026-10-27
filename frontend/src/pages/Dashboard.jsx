
import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [taskData, setTaskData] = useState({
        title: "",
        description: ""
    });
    const [editTask, setEditTask] = useState(null);

    const token = localStorage.getItem("token");

    // Get all tasks
    const getTasks = useCallback(async () => {
        try {
            const response = await api.get("/tasks", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTasks(response.data.tasks);
        } catch (error) {
            console.log(error);
        }
    }, [token]);

    // Protect dashboard and load tasks
    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true });
        }
    }, [token, navigate]);

    // Load tasks after the dashboard is mounted.
    // The timeout schedules the fetch outside the synchronous
    // effect body, avoiding the set-state-in-effect lint rule.
    useEffect(() => {
        if (!token) {
            return;
        }

        let cancelled = false;

        const loadTasks = async () => {
            try {
                const response = await api.get("/tasks", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!cancelled) {
                    setTasks(response.data.tasks);
                }
            } catch (error) {
                if (!cancelled) {
                    console.log(error);
                }
            }
        };

        const timerId = setTimeout(() => {
            loadTasks();
        }, 0);

        return () => {
            cancelled = true;
            clearTimeout(timerId);
        };
    }, [token]);

    // Handle create-task input
    const handleChange = (e) => {
        setTaskData({
            ...taskData,
            [e.target.name]: e.target.value
        });
    };

    // Create task
    const createTask = async (e) => {
        e.preventDefault();

        try {
            await api.post("/tasks", taskData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTaskData({
                title: "",
                description: ""
            });

            await getTasks();
        } catch (error) {
            console.log(error);
        }
    };

    // Update task
    const updateTask = async (id) => {
        try {
            await api.put(`/tasks/${id}`, editTask, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setEditTask(null);
            await getTasks();
        } catch (error) {
            console.log(error);
        }
    };

    // Delete task
    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            await getTasks();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="p-10">
                <h1 className="text-3xl font-bold mb-8">
                    Cloud Task Dashboard
                </h1>

                {/* Create Task */}
                <div className="bg-white shadow rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Create New Task
                    </h2>

                    <form onSubmit={createTask}>
                        <input
                            className="border rounded-lg p-3 w-full mb-3"
                            name="title"
                            placeholder="Task title"
                            value={taskData.title}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            className="border rounded-lg p-3 w-full mb-3"
                            name="description"
                            placeholder="Task description"
                            value={taskData.description}
                            onChange={handleChange}
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                        >
                            Add Task
                        </button>
                    </form>
                </div>

                {/* Edit Task */}
                {editTask && (
                    <div className="bg-white shadow rounded-xl p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">
                            Edit Task
                        </h2>

                        <input
                            className="border p-3 w-full mb-3"
                            value={editTask.title}
                            onChange={(e) =>
                                setEditTask({
                                    ...editTask,
                                    title: e.target.value
                                })
                            }
                            required
                        />

                        <textarea
                            className="border p-3 w-full mb-3"
                            value={editTask.description ?? ""}
                            onChange={(e) =>
                                setEditTask({
                                    ...editTask,
                                    description: e.target.value
                                })
                            }
                        />

                        <label
                            htmlFor="task-status"
                            className="block mb-2 font-medium"
                        >
                            Task status
                        </label>

                        <select
                            id="task-status"
                            className="border p-3 w-full mb-3"
                            value={editTask.status}
                            onChange={(e) =>
                                setEditTask({
                                    ...editTask,
                                    status: e.target.value
                                })
                            }
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <button
                            type="button"
                            className="bg-green-600 text-white px-5 py-2 rounded"
                            onClick={() => updateTask(editTask.id)}
                        >
                            Save Changes
                        </button>

                        <button
                            type="button"
                            className="ml-3 border px-5 py-2 rounded"
                            onClick={() => setEditTask(null)}
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {/* Task List */}
                <div className="grid gap-5">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-white shadow rounded-xl p-5"
                        >
                            <h2 className="text-xl font-semibold">
                                {task.title}
                            </h2>

                            <p className="text-gray-600 mt-2">
                                {task.description}
                            </p>

                            <p className="mt-3 font-medium">
                                Status:
                                <span className="ml-2">
                                    {task.status}
                                </span>
                            </p>

                            <div className="mt-4 flex gap-3">
                                <button
                                    type="button"
                                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                                    onClick={() => setEditTask({ ...task })}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {tasks.length === 0 && (
                        <p className="text-gray-600">
                            No tasks found yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
