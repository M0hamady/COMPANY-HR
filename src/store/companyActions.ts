import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
// http://127.0.0.1:8000/
// http://127.0.0.1:8000/
const LOGIN_API_URL = 'http://127.0.0.1:8000/api/login/';
const TASKS_API_URL = 'http://127.0.0.1:8000/api/tasks/';
const DAILY_REPORT_API_URL = 'http://127.0.0.1:8000/api/daily-report/';
const TASK_PROBLEM_API_URL = 'http://127.0.0.1:8000/api/task-problem/';
const PROJECTS_API_URL = 'http://127.0.0.1:8000/api/projects/';
// Define the type for the payload
interface TaskProblemFieldsPayload {
  taskProblemId?: number; // Optional: ID of the task problem to update
  task: number;
  degree_of_problem: string;
  text: string;
}
interface LoginResponse {
  token: string;
  username: string;
  email: string;
}
interface Task {
  id: number;
  title: string;
  description: string;
  // Add more properties as needed
}

interface Project {
  id: number;
  title: string;
  tasks: Task[];
  // Add more properties as needed
}

async function getCsrfToken(): Promise<string> {
  const csrfTokenElement = document.querySelector('meta[name=csrf-token]');
  if (csrfTokenElement) {
    return csrfTokenElement.getAttribute('content') || '';
  }
  throw new Error('CSRF token not found in the DOM');
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }) => {
    try {
      const csrfToken = await getCsrfToken();

      const requestConfig: AxiosRequestConfig = {
        method: 'POST',
        url: LOGIN_API_URL,
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ username, password })
      };

      const response = await axios.request(requestConfig);
      const responseData: LoginResponse = response.data;
      localStorage.setItem('loginResponse', JSON.stringify(response.data));
      localStorage.setItem('token', responseData.token);

      return { ...responseData, username, email: responseData.email };
    } catch (error) {
      
      throw new Error('Login failed. Please check your credentials.');
    }
  }
);



export const getTasks = createAsyncThunk('tasks/getTasks', async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      // Navigate to the login page
      window.location.href = '/login';
      throw new Error('Token not found in localStorage');
    }

    const requestConfig: AxiosRequestConfig = {
      method: 'GET',
      url: TASKS_API_URL,
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.request(requestConfig);
    const tasks: Task[] = response.data;

    return tasks;
  } catch (error) {
    // Navigate to the login page
    window.location.href = '/login';
    throw error;
  }
});

export const getProjects = createAsyncThunk('projects/getProjects', async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found in localStorage');
    }

    const requestConfig: AxiosRequestConfig = {
      method: 'GET',
      url: PROJECTS_API_URL,
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.request(requestConfig);
    const projects: Project[] = response.data;

    return projects;
  } catch (error) {
    throw new Error('Failed to get projects');
  }
});

export const getExactProject = createAsyncThunk(
  'projects/getExactProject',
  async (projectId: number| any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const requestConfig: AxiosRequestConfig = {
        method: 'GET',
        url: `${PROJECTS_API_URL}${projectId}/`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.request(requestConfig);
      const project: Project = response.data;

      return project;
    } catch (error) {
      throw new Error('Failed to get the project');
    }
  }
);
export const assignTaskToFinish = createAsyncThunk(
  'tasks/assignTaskToFinish',
  async (taskId: number | null, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const requestConfig: AxiosRequestConfig = {
        method: 'PUT',
        url: `${TASKS_API_URL}${taskId}/`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          is_finished: true
        }
      };

      const response = await axios.request(requestConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to assign the task as finished');
    }
  }
);
export const updateTaskFields = createAsyncThunk(
  'tasks/updateTaskFields',
  async (
    { taskId, fieldName, fieldValue }: { taskId: string; fieldName: string; fieldValue: any },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const requestConfig: AxiosRequestConfig = {
        method: 'PUT',
        url: `${TASKS_API_URL}${taskId}/`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          [fieldName]: fieldValue
        }
      };

      const response = await axios.request(requestConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update the task fields');
    }
  }
);
export const updateDailyReportFields = createAsyncThunk(
  'tasks/updateTaskFields',
  async (
    { dailyId, fieldName, fieldValue }: { dailyId: string; fieldName: string; fieldValue: any },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const requestConfig: AxiosRequestConfig = {
        method: 'PUT',
        url: `${DAILY_REPORT_API_URL}${dailyId}/`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          [fieldName]: fieldValue
        }
      };

      const response = await axios.request(requestConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update the task fields');
    }
  }
);

export const updateOrCreateTaskProblemFields = createAsyncThunk(
  'tasks/updateOrCreateTaskProblemFields',
  async (
    {
      taskProblemId,
      task,
      degree_of_problem,
      text,
    }: TaskProblemFieldsPayload,
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      let requestConfig: AxiosRequestConfig;
      if (taskProblemId) {
        // If taskProblemId is provided, update an existing task problem
        requestConfig = {
          method: 'PUT', // Adjust the HTTP method for update
          url: `${TASK_PROBLEM_API_URL}/${taskProblemId}`, // Append taskProblemId to the URL for update
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: {
            task,
            degree_of_problem,
            text,
          }
        };
      } else {
        // If taskProblemId is not provided, create a new task problem
        requestConfig = {
          method: 'POST', // Adjust the HTTP method for create
          url: `${TASK_PROBLEM_API_URL}`, // Adjust the API endpoint for create
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: {
            task,
            degree_of_problem,
            text,
          }
        };
      }

      const response = await axios.request(requestConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update/create the task problem fields');
    }
  }
);

export const createDailyReportFields = createAsyncThunk(
  'tasks/updateTaskFields',
  async (
    {
      task,
      num_of_crafts_man,
      num_of_crafts_man_assistant,
    }: {
      task: number;
      num_of_crafts_man: number;
      num_of_crafts_man_assistant: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const requestConfig: AxiosRequestConfig = {
        method: 'POST',
        url: `${DAILY_REPORT_API_URL}`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          task,
          num_of_crafts_man,
          num_of_crafts_man_assistant,
        }
      };

      const response = await axios.request(requestConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update the task fields');
    }
  }
);

export const getExactTask = createAsyncThunk(
  'tasks/assignTaskToFinish',
  async (taskId: number | any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const requestConfig: AxiosRequestConfig = {
        method: 'GET',
        url: `${TASKS_API_URL}${taskId}/`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        
      };

      const response = await axios.request(requestConfig);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to assign the task as finished');
    }
  }
);
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    // Clear the token from localStorage
    localStorage.removeItem('token');

    // Clear all other data from localStorage
    localStorage.clear();

    // Return a success message
    return 'Logout successful';
  } catch (error) {
    throw new Error('Failed to log out');
  }
});