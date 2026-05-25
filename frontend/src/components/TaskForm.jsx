import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ tasks, setTasks, editingTask, setEditingTask }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', ingredients: '', steps: '', category: '' });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        ingredients: editingTask.ingredients,
        steps: editingTask.steps,
        category: editingTask.category,
      });
    } else {
      setFormData({ title: '', ingredients: '', steps: '', category: '' });
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const response = await axiosInstance.put(`/api/tasks/${editingTask._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(tasks.map((task) => (task._id === response.data._id ? response.data : task)));
      } else {
        const response = await axiosInstance.post('/api/tasks', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks([...tasks, response.data]);
      }
      setEditingTask(null);
      setFormData({ title: '', ingredients: '', steps: '', category: '' });
    } catch (error) {
      alert('Failed to save recipe.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingTask ? 'Edit Recipe' : 'Add Recipe'}</h1>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Ingredients"
        value={formData.ingredients}
        onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <textarea
        placeholder="Steps"
        value={formData.steps}
        onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        rows={3}
      />
      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingTask ? 'Update Recipe' : 'Add Recipe'}
      </button>
    </form>
  );
};

export default TaskForm;