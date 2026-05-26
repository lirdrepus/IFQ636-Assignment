import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get('/api/tasks', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(response.data);
      } catch (error) {
        alert('Failed to fetch recipes.');
      }
    };

    fetchTasks();
  }, [user]);

  const handleDelete = async (taskId) => {
    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      alert('Failed to delete recipe.');
    }
  };

  if (!user) return <div className="container mx-auto p-6">Please login first.</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel - All Recipes</h1>
      <div>
        {tasks.map((task) => (
          <div key={task._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
            <h2 className="font-bold">{task.title}</h2>
            <p className="text-sm text-gray-500"><span className="font-semibold">Category:</span> {task.category}</p>
            <p className="text-sm text-gray-500"><span className="font-semibold">Ingredients:</span> {task.ingredients}</p>
            <p className="text-sm text-gray-500"><span className="font-semibold">Steps:</span> {task.steps}</p>
            <div className="mt-2">
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;