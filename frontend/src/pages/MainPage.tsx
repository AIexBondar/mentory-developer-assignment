import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MainPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [taskLists, setTaskLists] = useState<any[]>([]);
  const [newTaskListName, setNewTaskListName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      axios
        .get('http://localhost:8000/api/user', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => setUser(response.data))
        .catch(() => navigate('/login'));

      axios
        .get('http://localhost:8000/api/task-lists', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => setTaskLists(response.data))
        .catch((error) => console.error('Error loading task lists:', error));
    }
  }, [navigate]);

  const handleCreateTaskList = () => {
    axios
      .post(
        'http://localhost:8000/api/task-lists',
        { name: newTaskListName },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      .then((response) => {
        setTaskLists([...taskLists, response.data]);
        setNewTaskListName('');
      })
      .catch((error) => console.error('Error creating task list:', error));
  };

  return (
    <Container>
      {user && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Typography variant="h5">Welcome, {user.name}</Typography>
            <Button
              variant="contained"
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
            >
              Logout
            </Button>
          </Box>
          <Box sx={{ mt: 3 }}>
            <TextField
              label="New Task List Name"
              fullWidth
              value={newTaskListName}
              onChange={(e) => setNewTaskListName(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleCreateTaskList}
            >
              Create Task List
            </Button>
          </Box>

          <List sx={{ mt: 3 }}>
            {taskLists.map((taskList) => (
              <ListItem key={taskList.id} onClick={() => navigate(`/task-lists/${taskList.id}`)}>
                <ListItemText primary={taskList.name} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Container>
  );
};

export default MainPage;
