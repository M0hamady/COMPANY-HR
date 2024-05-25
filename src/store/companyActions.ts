import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';

const LOGIN_API_URL = 'http://hrsupport.pythonanywhere.com/api/login/';
const TASKS_API_URL = 'http://hrsupport.pythonanywhere.com/api/tasks/';
const PROJECTS_API_URL = 'http://hrsupport.pythonanywhere.com/api/projects/';

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
    throw new Error('Failed to get tasks');
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