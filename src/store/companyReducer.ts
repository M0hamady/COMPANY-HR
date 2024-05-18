import { AnyAction } from 'redux';

interface CompanyState {
  name: string | null;
  loggedIn: boolean;
  token: string | null;
  projects: any[]; // Placeholder for project data
  projectData: any; // Placeholder for specific project data
  tasks: any[]; // Placeholder for tasks
}

const initialState: CompanyState = {
  name: null,
  loggedIn: false,
  token: null,
  projects: [],
  projectData: null,
  tasks: [],
};

const companyReducer = (state: CompanyState = initialState, action: AnyAction): CompanyState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        loggedIn: true,
        name: action.payload.name,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        ...state,
        loggedIn: false,
        token: null,
      };
    case 'FETCH_PROJECTS_REQUEST':
      return {
        ...state,
        // Potentially set a loading flag or other state changes
      };
    case 'FETCH_PROJECTS_SUCCESS':
      return {
        ...state,
        projects: action.payload.projects,
      };
    case 'FETCH_PROJECT_DATA_REQUEST':
      return {
        ...state,
        // Potentially set a loading flag or other state changes
      };
    case 'FETCH_PROJECT_DATA_SUCCESS':
      return {
        ...state,
        projectData: action.payload.projectData,
      };
    case 'FETCH_TASKS_REQUEST':
      return {
        ...state,
        // Potentially set a loading flag or other state changes
      };
    case 'FETCH_TASKS_SUCCESS':
      return {
        ...state,
        tasks: action.payload.tasks,
      };
    default:
      return state;
  }
};

export default companyReducer;