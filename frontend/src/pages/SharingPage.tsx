import React, { useState } from 'react';
import axios from 'axios';

const SharingPage: React.FC = () => {
  const [taskListId, setTaskListId] = useState<number | string>('');
  const [username, setUsername] = useState('');
  const [permission, setPermission] = useState('view');

  const handleSubmit = () => {
    axios
      .post('http://localhost:8000/api/share-task-list', {
        task_list_id: taskListId,
        user_id: username, 
        permission: permission,
      })
      .then((response) => {
        alert('Task list shared successfully');
      })
      .catch((error) => {
        console.error('Error sharing task list:', error);
      });
  };

  return (
    <div>
      <h2>Share Task List</h2>
      <input
        type="text"
        value={taskListId}
        onChange={(e) => setTaskListId(e.target.value)}
        placeholder="Task List ID"
      />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <select onChange={(e) => setPermission(e.target.value)} value={permission}>
        <option value="view">View Only</option>
        <option value="edit">Edit</option>
      </select>
      <button onClick={handleSubmit}>Share</button>
    </div>
  );
};

export default SharingPage;