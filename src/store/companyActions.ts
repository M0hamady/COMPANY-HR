import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
// https://hrsupport.pythonanywhere.com/
// https://hrsupport.pythonanywhere.com/
const LOGIN_API_URL = 'https://hrsupport.pythonanywhere.com/api/login/';
const TASKS_API_URL = 'https://hrsupport.pythonanywhere.com/api/tasks/';
const DAILY_REPORT_API_URL = 'https://hrsupport.pythonanywhere.com/api/daily-report/';
const TASK_PROBLEM_API_URL = 'https://hrsupport.pythonanywhere.com/api/task-problem/';
const PROJECTS_API_URL = 'https://hrsupport.pythonanywhere.com/api/projects/';
const ATTENDANCE_API_URL = 'https://hrsupport.pythonanywhere.com/api/attendance/';

// Define the type for the payload
interface TaskProblemFieldsPayload {
  taskProblemId?: number; // Optional: ID of the task problem to update
  task: number;
  degree_of_problem: string;
  text: string;
  is_solved:Boolean
}
export interface Attendance2 {
  employee: string | null;
  id: number;
  // date: Date | null;
  check_in: Date |  string | null;
  check_out: Date | null;
  latitude: number | null;
  longitude: number | null;
  duration: number | null; // Duration in seconds
  user: number | null; // ID of the user
}
export interface Attendance {
  id: number;
  // date: Date | null;
  check_in: Date |  string | null;
  check_out: Date | null;
  latitude: number | null;
  longitude: number | null;
  duration: number | null; // Duration in seconds
  user: number | null; // ID of the user
}

export interface TodayAttendance {
  userName: string | null;
  check_in: Date | string | null;
  checkInLocation: {
    latitude: number | null;
    longitude: number | null;
    googleMapsLink: string | null;
  };
  check_out?: Date | string | null;
  checkOutLocation?: {
    latitude: number | null;
    longitude: number | null;
    googleMapsLink: string | null;
  };
  totalDuration?: number | null; // in seconds
}
interface LoginResponse {
  token: string;
  username: string;
  email: string;
  userType: string;
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
      localStorage.setItem('userType', responseData.userType);

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
      is_solved,
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
          url: `${TASK_PROBLEM_API_URL}${taskProblemId}/`, // Append taskProblemId to the URL for update
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: {
            task,
            degree_of_problem,
            text,
            is_solved,
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



// Async Thunk for getting attendance data
export const getAttendance = createAsyncThunk('attendance/getAttendance', async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      // Navigate to the login page
      window.location.href = '/login';
      throw new Error('Token not found in localStorage');
    }

    const requestConfig: AxiosRequestConfig = {
      method: 'GET',
      url: ATTENDANCE_API_URL,
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.request(requestConfig);
    const attendance: Attendance[] = response.data;

    return attendance;
  } catch (error) {
    // Navigate to the login page
    window.location.href = '/login';
    throw error;
  }
});

// Async Thunk for posting attendance data
export const postAttendance = createAsyncThunk('attendance/postAttendance', async (attendanceData: Attendance & { latitude: number | null, longitude : number | null }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      // Navigate to the login page
      window.location.href = '/login';
      throw new Error('Token not found in localStorage');
    }

    const requestConfig: AxiosRequestConfig = {
      method: 'POST',
      url: ATTENDANCE_API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        ...attendanceData,
        latitude: attendanceData.latitude,
        longitude: attendanceData.longitude
      }
    };

    const response = await axios.request(requestConfig);
    const newAttendance: Attendance = response.data;

    return newAttendance;
  } catch (error) {
    // Navigate to the login page
    throw error;
  }
});


export const getTodayAttendance = createAsyncThunk('attendance/getTodayAttendance', async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      // Navigate to the login page
      window.location.href = '/login';
      throw new Error('Token not found in localStorage');
    }

    const today = new Date().toISOString().slice(0, 10);
    const requestConfig: AxiosRequestConfig = {
      method: 'GET',
      url: `${ATTENDANCE_API_URL}?date=${today}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.request(requestConfig);
    const attendance: Attendance2[] = response.data;

    const todayAttendance: TodayAttendance[] = attendance.map((item) => ({
      userName: `${item.employee}` || null ,
      check_in: item.check_in || null,
      checkInLocation: {
        latitude: item.latitude || null,
        longitude: item.longitude || null,
        googleMapsLink: item.check_in
          ? `https://www.google.com/maps?q=${item.latitude},${item.longitude}`
          : null
      },
      check_out: item.check_out || null,
      checkOutLocation: item.check_out
        ? {
            latitude: item.latitude || null,
            longitude: item.longitude || null,
            googleMapsLink: `https://www.google.com/maps?q=${item.latitude},${item.longitude}`
          }
        : undefined,
      totalDuration: item.duration || null
    }));

    return todayAttendance;
  } catch (error) {
    // Navigate to the login page
    // window.location.href = '/login';
    throw error;
  }
});