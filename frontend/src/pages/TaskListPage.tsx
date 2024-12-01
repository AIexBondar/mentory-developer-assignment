import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Container,
  Grid,
  Box
} from '@mui/material';
import { Delete as DeleteIcon, Share as ShareIcon } from '@mui/icons-material';

const HomePage: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [taskLists, setTaskLists] = useState<any[]>([]);
  const [taskListName, setTaskListName] = useState<string>('');
  const [taskName, setTaskName] = useState<string>('');
  const [currentTaskListId, setCurrentTaskListId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Fetch the task lists for the logged-in user
      axios
        .get('http://localhost:8000/api/task-lists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTaskLists(response.data);
        })
        .catch((error) => {
          console.error('Error fetching task lists:', error);
        });
    }
  }, [user, token, navigate]);

  const handleCreateTaskList = () => {
    if (taskListName.trim()) {
      axios
        .post(
          'http://localhost:8000/api/task-lists',
          { name: taskListName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setTaskLists([...taskLists, response.data]);
          setTaskListName('');
        })
        .catch((error) => {
          console.error('Error creating task list:', error);
        });
    }
  };

  const handleUpdateTaskList = (id: number, newName: string) => {
    axios
      .put(
        `http://localhost:8000/api/task-lists/${id}`,
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setTaskLists(
          taskLists.map((taskList) =>
            taskList.id === id ? { ...taskList, name: newName } : taskList
          )
        );
      })
      .catch((error) => {
        console.error('Error updating task list:', error);
      });
  };

  const handleDeleteTaskList = (id: number) => {
    axios
      .delete(`http://localhost:8000/api/task-lists/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setTaskLists(taskLists.filter((taskList) => taskList.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting task list:', error);
      });
  };

  const handleAddTaskToList = (taskListId: number) => {
    if (taskName.trim()) {
      axios
        .post(
          `http://localhost:8000/api/task-lists/${taskListId}/tasks`,
          { name: taskName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setTaskName('');
          setTaskLists(
            taskLists.map((taskList) =>
              taskList.id === taskListId
                ? { ...taskList, tasks: [...taskList.tasks, response.data] }
                : taskList
            )
          );
        })
        .catch((error) => {
          console.error('Error adding task:', error);
        });
    }
  };

  const handleDeleteTask = (taskListId: number, taskId: number) => {
    axios
      .delete(
        `http://localhost:8000/api/task-lists/${taskListId}/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setTaskLists(
          taskLists.map((taskList) =>
            taskList.id === taskListId
              ? {
                  ...taskList,
                  tasks: taskList.tasks.filter((task: any) => task.id !== taskId),
                }
              : taskList
          )
        );
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  };

  const handleShareTaskList = (id: number) => {
    // Functionality for sharing the task list (you can implement the share logic here)
    console.log(`Sharing task list with ID: ${id}`);
  };

  return (
    <Container>
      <header>
        <h1>Welcome, {user?.name}</h1>
        <Button onClick={() => navigate('/login')}>Logout</Button>
      </header>

      <main>
        <h2>Create Task List</h2>
        <TextField
          label="Task List Name"
          variant="outlined"
          value={taskListName}
          onChange={(e) => setTaskListName(e.target.value)}
        />
        <Button onClick={handleCreateTaskList}>Create</Button>

        <h2>Your Task Lists</h2>

        <Grid container spacing={2}>
          {taskLists.map((taskList) => (
            <Grid item xs={12} sm={6} md={4} key={taskList.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{taskList.name}</Typography>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    onClick={() => {
                      setCurrentTaskListId(taskList.id);
                      navigate(`/task-list/${taskList.id}`);
                    }}
                  >
                    View Tasks
                  </Button>

                  <IconButton onClick={() => handleShareTaskList(taskList.id)}>
                    <ShareIcon />
                  </IconButton>

                  <IconButton onClick={() => handleDeleteTaskList(taskList.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>

                {/* Add tasks to the list */}
                {currentTaskListId === taskList.id && (
                  <Box>
                    <TextField
                      label="Task Name"
                      variant="outlined"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                    />
                    <Button onClick={() => handleAddTaskToList(taskList.id)}>
                      Add Task
                    </Button>

                    <h3>Tasks</h3>
                    <Grid container spacing={2}>
                      {taskList.tasks &&
                        taskList.tasks.map((task: any) => (
                          <Grid item xs={12} sm={6} key={task.id}>
                            <Card>
                              <CardContent>
                                <Typography variant="body1">{task.name}</Typography>
                              </CardContent>

                              <CardActions>
                                <IconButton
                                  onClick={() =>
                                    handleDeleteTask(taskList.id, task.id)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </CardActions>
                            </Card>
                          </Grid>
                        ))}
                    </Grid>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </main>
    </Container>
  );
};

export default HomePage;
